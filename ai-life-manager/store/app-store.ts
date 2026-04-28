import { create } from "zustand";
import type { Task, EnergyLevel, Habit, HabitLog, EnergyLog, UserProfile } from "@/types";

interface AppState {
  // Energy
  currentEnergy: EnergyLevel;
  setCurrentEnergy: (level: EnergyLevel) => void;

  // Tasks
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  removeTask: (id: string) => void;

  // Habits
  habits: Habit[];
  habitLogs: HabitLog[];
  setHabits: (habits: Habit[]) => void;
  setHabitLogs: (logs: HabitLog[]) => void;

  // Energy logs
  energyLogs: EnergyLog[];
  setEnergyLogs: (logs: EnergyLog[]) => void;

  // User
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;

  // UI
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentEnergy: "medium",
  setCurrentEnergy: (level) => set({ currentEnergy: level }),

  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((s) => ({ tasks: [task, ...s.tasks] })),
  updateTask: (id, data) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)),
    })),
  removeTask: (id) =>
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

  habits: [],
  habitLogs: [],
  setHabits: (habits) => set({ habits }),
  setHabitLogs: (habitLogs) => set({ habitLogs }),

  energyLogs: [],
  setEnergyLogs: (energyLogs) => set({ energyLogs }),

  userProfile: null,
  setUserProfile: (userProfile) => set({ userProfile }),

  darkMode: false,
  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
}));
