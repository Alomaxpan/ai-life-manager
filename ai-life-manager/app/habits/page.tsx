"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/layout/AuthProvider";
import { useAppStore } from "@/store/app-store";
import { getHabits, getHabitLogs, logHabit } from "@/lib/firestore";
import { BottomNav } from "@/components/layout/BottomNav";
import { Habit, HabitLog } from "@/types";
import { format, subDays } from "date-fns";
import toast from "react-hot-toast";
import { Check } from "lucide-react";

export default function HabitsPage() {
  const { user } = useAuth();
  const { habits, setHabits, habitLogs, setHabitLogs } = useAppStore();
  const [loading, setLoading] = useState(true);

  const today = format(new Date(), "yyyy-MM-dd");
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    format(subDays(new Date(), 6 - i), "yyyy-MM-dd")
  );

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getHabits(user.uid).then(setHabits),
      getHabitLogs(user.uid, 7).then(setHabitLogs),
    ]).finally(() => setLoading(false));
  }, [user]);

  const isHabitDoneOn = (habitId: string, date: string) =>
    habitLogs.some((l: HabitLog) => l.habitId === habitId && l.date === date && l.done);

  const toggleHabit = async (habit: Habit) => {
    if (!user) return;
    const done = !isHabitDoneOn(habit.id, today);
    await logHabit({ userId: user.uid, habitId: habit.id, date: today, done });
    setHabitLogs(await getHabitLogs(user.uid, 7));
    if (done) toast.success(`${habit.name} logged! 🎉`);
  };

  const getStreak = (habitId: string) => {
    let streak = 0;
    for (let i = weekDays.length - 1; i >= 0; i--) {
      if (isHabitDoneOn(habitId, weekDays[i])) streak++;
      else break;
    }
    return streak;
  };

  const todayDone = habits.filter((h: Habit) => isHabitDoneOn(h.id, today)).length;
  const completionPct = habits.length ? Math.round(todayDone / habits.length * 100) : 0;

  return (
    <div className="page-enter">
      <div className="px-4 pt-6 pb-4">
        <h1 className="font-display text-2xl font-semibold text-gray-900">Habits & Health</h1>
        <p className="text-sm text-gray-400 mt-0.5">{todayDone}/{habits.length} done today</p>
      </div>

      {/* Progress bar */}
      <div className="px-4 mb-5">
        <div className="bg-gray-50 rounded-2xl p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-gray-700">Today's progress</span>
            <span className="font-semibold text-[#4a7c59]">{completionPct}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div className="h-2 bg-[#4a7c59] rounded-full transition-all duration-500"
              style={{ width: `${completionPct}%` }} />
          </div>
        </div>
      </div>

      {/* Habits list */}
      <div className="px-4 mb-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Daily habits</p>
        {loading ? (
          <div className="py-8 text-center text-sm text-gray-400">Loading habits...</div>
        ) : (
          <div className="space-y-3">
            {habits.map((habit: Habit) => {
              const done = isHabitDoneOn(habit.id, today);
              const streak = getStreak(habit.id);
              return (
                <div key={habit.id}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
                    done ? "bg-[#e8f5ec] border-[#b8d9c1]" : "bg-white border-gray-100"
                  }`}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-white border border-gray-100 flex-shrink-0">
                    {habit.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${done ? "text-[#2d6a4f]" : "text-gray-800"}`}>
                      {habit.name}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-xs text-gray-400">{habit.reminderTime || "Anytime"}</p>
                      {streak > 0 && (
                        <span className="text-xs text-amber-500 font-semibold">🔥 {streak} day streak</span>
                      )}
                    </div>
                    {/* 7-day dots */}
                    <div className="flex gap-1 mt-1.5">
                      {weekDays.map((day, i) => (
                        <div key={i}
                          className={`w-2 h-2 rounded-full ${
                            isHabitDoneOn(habit.id, day)
                              ? "bg-amber-400"
                              : day === today ? "bg-gray-300" : "bg-gray-150"
                          }`}
                          style={{ background: isHabitDoneOn(habit.id, day) ? "#f59e0b" : day === today ? "#d1d5db" : "#e5e7eb" }}
                        />
                      ))}
                    </div>
                  </div>
                  <button onClick={() => toggleHabit(habit)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                      done
                        ? "bg-[#4a7c59] text-white"
                        : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                    }`}>
                    <Check size={16} strokeWidth={2.5} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Smart reminders */}
      <div className="px-4 mb-28">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Smart reminders</p>
        <div className="space-y-2">
          <div className="bg-[#e8f0fb] rounded-2xl p-4 flex gap-3">
            <span className="text-xl">💧</span>
            <div>
              <p className="text-sm font-semibold text-[#3a7bd5]">Hydration reminder</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Staying hydrated improves focus by up to 14%. Log water every 2 hours.
              </p>
            </div>
          </div>
          <div className="bg-[#fceef1] rounded-2xl p-4 flex gap-3">
            <span className="text-xl">🧘</span>
            <div>
              <p className="text-sm font-semibold text-[#c4556a]">Movement break</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                A 5-min stretch every 90 minutes reduces fatigue and improves circulation.
              </p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
