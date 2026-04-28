"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/layout/AuthProvider";
import { useAppStore } from "@/store/app-store";
import { getTasks, getEnergyLogs, getHabitLogs } from "@/lib/firestore";
import { EnergySelector } from "@/components/ui/EnergySelector";
import { BestTaskCard } from "@/components/dashboard/BestTaskCard";
import { Timeline } from "@/components/dashboard/Timeline";
import { BottomNav } from "@/components/layout/BottomNav";
import { generateRecommendations, analyzePeakHours } from "@/lib/ai-engine";
import { format } from "date-fns";
import { EnergyLevel } from "@/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const { tasks, setTasks, energyLogs, setEnergyLogs, habitLogs, setHabitLogs,
    userProfile, currentEnergy, setCurrentEnergy } = useAppStore() as any;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getTasks(user.uid).then(setTasks),
      getEnergyLogs(user.uid).then(setEnergyLogs),
    ]).finally(() => setLoading(false));
  }, [user]);

  const done = tasks.filter((t: any) => t.status === "completed").length;
  const total = tasks.length;
  const streak = userProfile?.streak || 1;
  const name = userProfile?.displayName?.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const recommendations = generateRecommendations(tasks, currentEnergy);
  const peak = energyLogs.length >= 3 ? analyzePeakHours(energyLogs) : null;

  const energyByPeriod: Record<string, EnergyLevel> = {};
  const today = format(new Date(), "yyyy-MM-dd");
  energyLogs.filter((l: any) => l.date === today).forEach((l: any) => {
    energyByPeriod[l.period] = l.level;
  });

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-gray-900">{greeting} ✦</h1>
          <p className="text-sm text-gray-400 mt-0.5">{format(new Date(), "EEEE, MMMM d")}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4a7c59] to-[#3a7bd5] flex items-center justify-center text-white font-semibold text-sm">
          {name.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Energy selector */}
      <div className="px-4 mb-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">How's your energy?</p>
        <EnergySelector value={currentEnergy} onChange={setCurrentEnergy} />
      </div>

      {/* Best task */}
      <div className="mt-4">
        <BestTaskCard tasks={tasks} energy={currentEnergy} />
      </div>

      {/* Stats */}
      <div className="px-4 mb-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-2xl font-semibold text-gray-900">{done}/{total}</p>
            <p className="text-xs text-gray-400 mt-0.5">Tasks done today</p>
            <div className="mt-2 h-1 bg-gray-200 rounded-full">
              <div className="h-1 bg-[#4a7c59] rounded-full transition-all"
                style={{ width: total ? `${Math.round(done / total * 100)}%` : "0%" }} />
            </div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-2xl font-semibold text-gray-900">{streak}</p>
            <p className="text-xs text-gray-400 mt-0.5">Day streak</p>
            <p className="text-xs text-amber-500 mt-1 font-medium">🔥 Keep it up!</p>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      {recommendations.length > 0 && (
        <div className="px-4 mb-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">AI insights</p>
          <div className="space-y-2">
            {recommendations.slice(0, 2).map((rec, i) => {
              const styles: Record<string, string> = {
                best_task: "bg-[#e8f5ec]", break: "bg-[#fceef1]", deep_work: "bg-[#e8f0fb]",
                hydration: "bg-[#e8f0fb]", movement: "bg-[#fceef1]",
              };
              const icons: Record<string, string> = {
                best_task: "🧠", break: "☕", deep_work: "⚡", hydration: "💧", movement: "🧘",
              };
              return (
                <div key={i} className={`${styles[rec.type]} rounded-2xl p-3.5 flex gap-3`}>
                  <span className="text-lg mt-0.5">{icons[rec.type]}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{rec.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{rec.description}</p>
                  </div>
                </div>
              );
            })}
            {peak && (
              <div className="bg-[#fdf3e3] rounded-2xl p-3.5 flex gap-3">
                <span className="text-lg mt-0.5">🔮</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Peak hours: {peak.peakPeriod}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{peak.recommendation}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="px-4 mb-24">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Today's schedule</p>
        <Timeline tasks={tasks} energyByPeriod={energyByPeriod} />
      </div>

      <BottomNav />
    </div>
  );
}
