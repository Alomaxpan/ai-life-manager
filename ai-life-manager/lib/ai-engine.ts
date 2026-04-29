import type { Task, EnergyLevel, EnergyLog, AIRecommendation } from "@/types";

// ─── Task Scoring Engine ───────────────────────────────────────────────────────
// Scoring is intentionally rule-based and explainable.
// Each factor contributes a visible score, users can understand why a task is suggested.

export function scoreTask(task: Task, currentEnergy: EnergyLevel): number {
  if (task.status === "completed") return -9999;
  let score = 0;

  // Priority weight
  if (task.priority === "high") score += 30;
  else if (task.priority === "medium") score += 15;

  // Energy match — most important factor (40pts max)
  if (task.energyRequired === currentEnergy) {
    score += 40;
  } else if (currentEnergy === "high" && task.energyRequired === "medium") {
    score += 20; // High energy can handle medium tasks
  } else if (currentEnergy === "medium" && task.energyRequired === "low") {
    score += 15; // Medium can handle low
  } else if (currentEnergy === "low" && task.energyRequired === "high") {
    score -= 10; // Mismatch penalty
  }

  // Deadline urgency
  if (task.deadline) {
    const daysUntil = Math.ceil(
      (new Date(task.deadline).getTime() - Date.now()) / 86400000
    );
    if (daysUntil <= 0) score += 50; // Overdue!
    else if (daysUntil <= 1) score += 35;
    else if (daysUntil <= 3) score += 20;
    else if (daysUntil <= 7) score += 10;
  }

  // Short tasks get a nudge when energy is lower
  if (currentEnergy === "low" && task.estimatedMinutes <= 20) score += 10;
  if (currentEnergy === "high" && task.estimatedMinutes >= 45) score += 5; // Deep work fits high energy

  // In-progress tasks get a boost (momentum)
  if (task.status === "in_progress") score += 25;

  return score;
}

export function getBestTask(tasks: Task[], energy: EnergyLevel): Task | null {
  const pending = tasks.filter((t) => t.status !== "completed");
  if (!pending.length) return null;
  return pending.sort((a, b) => scoreTask(b, energy) - scoreTask(a, energy))[0];
}

export function getScoredTaskList(tasks: Task[], energy: EnergyLevel): Task[] {
  return [...tasks].sort((a, b) => scoreTask(b, energy) - scoreTask(a, energy));
}

// ─── Energy Pattern Analysis ──────────────────────────────────────────────────

export function analyzePeakHours(logs: EnergyLog[]): {
  peakPeriod: string;
  lowPeriod: string;
  recommendation: string;
} {
  const scores: Record<string, number[]> = { morning: [], afternoon: [], evening: [] };
  const energyScore = { low: 1, medium: 2, high: 3 };

  logs.forEach((log) => {
    scores[log.period].push(energyScore[log.level]);
  });

  const avg = (arr: number[]) =>
    arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  const avgs = {
    morning: avg(scores.morning),
    afternoon: avg(scores.afternoon),
    evening: avg(scores.evening),
  };

  const peak = Object.entries(avgs).sort((a, b) => b[1] - a[1])[0][0];
  const low = Object.entries(avgs).sort((a, b) => a[1] - b[1])[0][0];

  const recommendations: Record<string, string> = {
    morning: "Schedule deep work and high-priority tasks in the morning when you're sharpest.",
    afternoon: "Your afternoon energy is strong — great for collaborative work and meetings.",
    evening: "You're an evening person! Use mornings for planning and evenings for deep focus.",
  };

  return {
    peakPeriod: peak,
    lowPeriod: low,
    recommendation: recommendations[peak],
  };
}

// ─── Daily Schedule Generator ─────────────────────────────────────────────────

export function generateDailySchedule(
  tasks: Task[],
  energyByPeriod: Record<string, EnergyLevel>
): Array<{ time: string; task: Task | null; type: string; label: string }> {
  const schedule: Array<{ time: string; task: Task | null; type: string; label: string }> = [];
  const morning = tasks.filter(
    (t) => t.status !== "completed" && t.energyRequired === (energyByPeriod.morning || "high")
  ).slice(0, 2);
  const afternoon = tasks.filter(
    (t) => t.status !== "completed" && t.energyRequired === (energyByPeriod.afternoon || "medium")
  ).slice(0, 2);

  const slots = [
    { time: "9:00 AM", type: "work", label: "Deep work block" },
    { time: "10:30 AM", type: "work", label: "Focus session" },
    { time: "12:00 PM", type: "break", label: "Lunch & walk" },
    { time: "2:00 PM", type: "admin", label: "Admin tasks" },
    { time: "3:30 PM", type: "personal", label: "Personal time" },
    { time: "5:00 PM", type: "review", label: "Daily review" },
  ];

  const taskPool = [...morning, ...afternoon];
  slots.forEach((slot, i) => {
    schedule.push({ ...slot, task: taskPool[i] || null });
  });

  return schedule;
}

// ─── AI Recommendations ───────────────────────────────────────────────────────

export function generateRecommendations(
  tasks: Task[],
  energy: EnergyLevel,
  lastWaterLog?: Date,
  lastMovementLog?: Date
): AIRecommendation[] {
  const recs: AIRecommendation[] = [];
  const best = getBestTask(tasks, energy);

  if (best) {
    recs.push({
      type: "best_task",
      title: `Start: ${best.name}`,
      description:
        energy === "high"
          ? "Your energy is high — perfect for this task. Strike while the iron is hot!"
          : energy === "medium"
          ? "Good energy levels. This task matches your current capacity well."
          : "Even on low energy, this task is manageable and will build momentum.",
      taskId: best.id,
      priority: 1,
    });
  }

  if (energy === "low") {
    recs.push({
      type: "break",
      title: "Consider a short break",
      description: "Low energy detected. A 10-minute walk or power nap can restore focus by up to 30%.",
      priority: 2,
    });
  }

  if (energy === "high") {
    recs.push({
      type: "deep_work",
      title: "Deep work window open",
      description: "High energy is rare and precious. Block distractions and tackle your hardest task now.",
      priority: 2,
    });
  }

  if (lastWaterLog) {
    const minutesSince = (Date.now() - lastWaterLog.getTime()) / 60000;
    if (minutesSince > 120) {
      recs.push({
        type: "hydration",
        title: "Time to hydrate",
        description: `It's been ${Math.round(minutesSince)} minutes since your last water. Dehydration reduces focus by up to 14%.`,
        priority: 3,
      });
    }
  }

  return recs.sort((a, b) => a.priority - b.priority);
}
