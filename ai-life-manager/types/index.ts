export type EnergyLevel = "low" | "medium" | "high";
export type TaskCategory = "work" | "personal" | "health" | "study";
export type TaskPriority = "high" | "medium" | "low";
export type TaskStatus = "pending" | "in_progress" | "completed";

export interface Task {
  id: string;
  userId: string;
  name: string;
  category: TaskCategory;
  priority: TaskPriority;
  energyRequired: EnergyLevel;
  estimatedMinutes: number;
  status: TaskStatus;
  notes?: string;
  subtasks?: Subtask[];
  deadline?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subtask {
  id: string;
  name: string;
  done: boolean;
}

export interface EnergyLog {
  id: string;
  userId: string;
  date: string;
  period: "morning" | "afternoon" | "evening";
  level: EnergyLevel;
  createdAt: string;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  icon: string;
  category: "water" | "food" | "movement" | "sleep" | "mindfulness" | "custom";
  reminderTime?: string;
  active: boolean;
  createdAt: string;
}

export interface HabitLog {
  id: string;
  userId: string;
  habitId: string;
  date: string;
  done: boolean;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  preferredWorkStart: string;
  preferredWorkEnd: string;
  darkMode: boolean;
  smartNotifications: boolean;
  weeklyReport: boolean;
  streak: number;
  lastActiveDate: string;
  createdAt: string;
}

export interface AIRecommendation {
  type: "best_task" | "break" | "deep_work" | "hydration" | "movement";
  title: string;
  description: string;
  taskId?: string;
  priority: number;
}
