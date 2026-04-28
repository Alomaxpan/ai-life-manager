"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { Task, TaskCategory, TaskPriority, EnergyLevel } from "@/types";
import { createTask } from "@/lib/firestore";
import { useAppStore } from "@/store/app-store";
import { useAuth } from "@/components/layout/AuthProvider";
import toast from "react-hot-toast";

export function AddTaskModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const { addTask } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", category: "work" as TaskCategory, priority: "medium" as TaskPriority,
    energyRequired: "medium" as EnergyLevel, estimatedMinutes: 30, notes: "", deadline: "",
  });

  const submit = async () => {
    if (!form.name.trim() || !user) return;
    setLoading(true);
    try {
      const taskData = {
        ...form, userId: user.uid, status: "pending" as const,
        estimatedMinutes: Number(form.estimatedMinutes),
      };
      const id = await createTask(taskData);
      addTask({
        ...taskData, id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      toast.success("Task added!");
      onClose();
    } catch (e) {
      toast.error("Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  const field = (label: string, children: React.ReactNode) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1.5">{label}</label>
      {children}
    </div>
  );

  const inp = "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#4a7c59] focus:ring-2 focus:ring-[#4a7c59]/10 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200";

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-900 rounded-t-3xl p-5 w-full max-w-[480px] mx-auto animate-[slideUp_0.3s_ease]"
        style={{ animation: "slideUp 0.28s ease forwards" }}>
        <style>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold">Add new task</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X size={20} /></button>
        </div>

        <div className="space-y-3">
          {field("Task name",
            <input className={inp} placeholder="e.g. Review project proposal" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && submit()} autoFocus />
          )}

          <div className="grid grid-cols-2 gap-3">
            {field("Category",
              <select className={inp} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as TaskCategory }))}>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="health">Health</option>
                <option value="study">Study</option>
              </select>
            )}
            {field("Priority",
              <select className={inp} value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as TaskPriority }))}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {field("Energy needed",
              <select className={inp} value={form.energyRequired} onChange={e => setForm(f => ({ ...f, energyRequired: e.target.value as EnergyLevel }))}>
                <option value="high">High focus</option>
                <option value="medium">Medium focus</option>
                <option value="low">Low focus</option>
              </select>
            )}
            {field("Effort (minutes)",
              <input type="number" className={inp} min={5} max={480} value={form.estimatedMinutes}
                onChange={e => setForm(f => ({ ...f, estimatedMinutes: Number(e.target.value) }))} />
            )}
          </div>

          {field("Notes (optional)",
            <input className={inp} placeholder="Any details..." value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          )}
          {field("Deadline (optional)",
            <input type="date" className={inp} value={form.deadline}
              onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
          )}
        </div>

        <button onClick={submit} disabled={!form.name.trim() || loading}
          className="w-full mt-4 py-3 bg-[#4a7c59] text-white rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3d6b4c] transition-colors">
          {loading ? "Adding..." : "Add task"}
        </button>
      </div>
    </div>
  );
}
