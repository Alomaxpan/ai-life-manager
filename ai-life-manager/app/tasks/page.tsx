"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/layout/AuthProvider";
import { useAppStore } from "@/store/app-store";
import { getTasks } from "@/lib/firestore";
import { getScoredTaskList } from "@/lib/ai-engine";
import { TaskItem } from "@/components/tasks/TaskItem";
import { AddTaskModal } from "@/components/tasks/AddTaskModal";
import { BottomNav } from "@/components/layout/BottomNav";
import { Plus } from "lucide-react";
import { TaskCategory } from "@/types";

const CATS: { label: string; value: "all" | TaskCategory }[] = [
  { label: "All", value: "all" },
  { label: "Work", value: "work" },
  { label: "Personal", value: "personal" },
  { label: "Health", value: "health" },
  { label: "Study", value: "study" },
];

export default function TasksPage() {
  const { user } = useAuth();
  const { tasks, setTasks, currentEnergy } = useAppStore();
  const [filter, setFilter] = useState<"all" | TaskCategory>("all");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getTasks(user.uid).then(t => { setTasks(t); setLoading(false); });
  }, [user]);

  const filtered = filter === "all" ? tasks : tasks.filter(t => t.category === filter);
  const sorted = getScoredTaskList(filtered, currentEnergy);
  const pending = sorted.filter(t => t.status !== "completed");
  const done = sorted.filter(t => t.status === "completed");

  return (
    <div className="page-enter">
      <div className="px-4 pt-6 pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-gray-900">Tasks</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {pending.length} remaining · AI-sorted for your energy
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATS.map(({ label, value }) => (
            <button key={value} onClick={() => setFilter(value)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filter === value
                  ? "bg-[#4a7c59] text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-28 space-y-2">
        {loading ? (
          <div className="py-12 text-center text-sm text-gray-400">Loading tasks...</div>
        ) : pending.length === 0 && done.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-4xl mb-3">✅</p>
            <p className="font-semibold text-gray-700">No tasks yet</p>
            <p className="text-sm text-gray-400 mt-1">Tap + to add your first task</p>
          </div>
        ) : (
          <>
            {pending.map(t => <TaskItem key={t.id} task={t} />)}
            {done.length > 0 && (
              <>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider pt-3 pb-1">Completed</p>
                {done.map(t => <TaskItem key={t.id} task={t} />)}
              </>
            )}
          </>
        )}
      </div>

      <button onClick={() => setShowModal(true)}
        className="fixed bottom-[88px] right-4 w-14 h-14 bg-[#4a7c59] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#3d6b4c] transition-all active:scale-95 z-40"
        style={{ boxShadow: "0 4px 20px rgba(74,124,89,.4)" }}>
        <Plus size={24} />
      </button>

      {showModal && <AddTaskModal onClose={() => setShowModal(false)} />}
      <BottomNav />
    </div>
  );
}
