"use client";
import { Task } from "@/types";
import { CategoryTag, EnergyTag, PriorityDot } from "@/components/ui/Tag";
import { Check, Trash2, Clock } from "lucide-react";
import { updateTask, deleteTask } from "@/lib/firestore";
import { useAppStore } from "@/store/app-store";
import toast from "react-hot-toast";

export function TaskItem({ task }: { task: Task }) {
  const { updateTask: storeUpdate, removeTask } = useAppStore();

  const toggle = async () => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    storeUpdate(task.id, { status: newStatus });
    await updateTask(task.id, { status: newStatus });
    if (newStatus === "completed") toast.success("Task completed! 🎉");
  };

  const del = async () => {
    removeTask(task.id);
    await deleteTask(task.id);
    toast("Task deleted", { icon: "🗑️" });
  };

  const done = task.status === "completed";

  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
      done ? "bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 opacity-60"
           : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-gray-200"
    }`}>
      <button
        onClick={toggle}
        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
          done ? "bg-[#4a7c59] border-[#4a7c59]" : "border-gray-300 hover:border-[#4a7c59]"
        }`}
      >
        {done && <Check size={11} color="white" strokeWidth={3} />}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-[14px] font-medium leading-snug ${done ? "line-through text-gray-400" : "text-gray-800 dark:text-gray-200"}`}>
          {task.name}
        </p>
        {task.notes && !done && (
          <p className="text-[11px] text-gray-400 mt-0.5 truncate">{task.notes}</p>
        )}
        <div className="flex gap-1.5 mt-1.5 flex-wrap">
          <CategoryTag cat={task.category} />
          <EnergyTag level={task.energyRequired} />
          {task.deadline && (
            <span className="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Clock size={9} />
              {new Date(task.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <PriorityDot priority={task.priority} />
        <span className="text-[10px] text-gray-400">{task.estimatedMinutes}m</span>
        <button onClick={del} className="text-gray-300 hover:text-red-400 transition-colors">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
