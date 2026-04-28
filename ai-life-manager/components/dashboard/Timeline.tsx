"use client";
import { Task, EnergyLevel } from "@/types";
import { generateDailySchedule } from "@/lib/ai-engine";

const TYPE_COLORS: Record<string, string> = {
  work: "#3a7bd5",
  study: "#c97d2a",
  health: "#4a7c59",
  admin: "#718096",
  personal: "#c4556a",
  break: "#40916c",
  review: "#805ad5",
};

export function Timeline({ tasks, energyByPeriod }: {
  tasks: Task[];
  energyByPeriod: Record<string, EnergyLevel>;
}) {
  const schedule = generateDailySchedule(tasks, energyByPeriod);
  const hour = new Date().getHours();
  const currentSlot = hour < 10 ? 0 : hour < 12 ? 1 : hour < 14 ? 2 : hour < 16 ? 3 : hour < 17 ? 4 : 5;

  return (
    <div className="relative">
      <div className="absolute left-[52px] top-0 bottom-0 w-px bg-gray-100 dark:bg-gray-800" />
      {schedule.map((slot, i) => (
        <div key={i} className="flex gap-3 mb-3 relative">
          <span className="text-[11px] text-gray-400 w-12 text-right pt-2 flex-shrink-0">{slot.time}</span>
          <div
            className="w-2.5 h-2.5 rounded-full mt-2.5 flex-shrink-0 z-10 relative"
            style={{ background: TYPE_COLORS[slot.type] }}
          />
          <div className={`flex-1 px-3 py-2 rounded-xl border text-sm transition-all ${
            i === currentSlot
              ? "border-[#4a7c59] bg-[#e8f5ec] dark:bg-green-950"
              : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900"
          }`}>
            <p className={`font-medium text-[13px] ${i === currentSlot ? "text-[#2d6a4f]" : "text-gray-800 dark:text-gray-200"}`}>
              {slot.task ? slot.task.name : slot.label}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {slot.task ? `${slot.task.estimatedMinutes} mins · ${slot.type}` : "Free block"}
              {i === currentSlot && <span className="ml-2 font-semibold text-[#4a7c59]">← Now</span>}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
