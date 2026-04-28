import type { Task, Habit, EnergyLog } from "@/types";

export const SAMPLE_TASKS: Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">[] = [
  {
    name: "Review Q3 project report",
    category: "work",
    priority: "high",
    energyRequired: "high",
    estimatedMinutes: 60,
    status: "pending",
    notes: "Focus on metrics section",
  },
  {
    name: "30-minute morning run",
    category: "health",
    priority: "medium",
    energyRequired: "medium",
    estimatedMinutes: 30,
    status: "completed",
  },
  {
    name: "Read 20 pages of current book",
    category: "study",
    priority: "low",
    energyRequired: "low",
    estimatedMinutes: 25,
    status: "pending",
  },
  {
    name: "Reply to team emails",
    category: "work",
    priority: "medium",
    energyRequired: "low",
    estimatedMinutes: 20,
    status: "pending",
  },
  {
    name: "Meditate for 10 minutes",
    category: "health",
    priority: "high",
    energyRequired: "low",
    estimatedMinutes: 10,
    status: "pending",
  },
  {
    name: "Study React advanced patterns",
    category: "study",
    priority: "high",
    energyRequired: "high",
    estimatedMinutes: 90,
    status: "pending",
    notes: "Focus on hooks and context API",
  },
  {
    name: "Grocery shopping",
    category: "personal",
    priority: "low",
    energyRequired: "medium",
    estimatedMinutes: 45,
    status: "pending",
  },
  {
    name: "Call family",
    category: "personal",
    priority: "medium",
    energyRequired: "low",
    estimatedMinutes: 20,
    status: "pending",
  },
];

export const SAMPLE_HABITS: Omit<Habit, "id" | "userId" | "createdAt">[] = [
  { name: "Drink water", icon: "💧", category: "water", reminderTime: "09:00", active: true },
  { name: "Eat breakfast", icon: "🥗", category: "food", reminderTime: "08:00", active: true },
  { name: "Stretch / move", icon: "🧘", category: "movement", reminderTime: "15:00", active: true },
  { name: "Sleep by 11pm", icon: "🌙", category: "sleep", reminderTime: "22:30", active: true },
  { name: "No screens 1hr before bed", icon: "📵", category: "mindfulness", reminderTime: "22:00", active: true },
];
