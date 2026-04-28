import { TaskCategory, EnergyLevel, TaskPriority } from "@/types";
import { clsx } from "clsx";

const CAT_STYLES: Record<TaskCategory, string> = {
  work: "bg-[#e8f0fb] text-[#3a7bd5]",
  personal: "bg-[#fceef1] text-[#c4556a]",
  health: "bg-[#e8f5ec] text-[#4a7c59]",
  study: "bg-[#fdf3e3] text-[#c97d2a]",
};

const ENERGY_STYLES: Record<EnergyLevel, string> = {
  low: "bg-[#fceef1] text-[#c4556a]",
  medium: "bg-[#fdf3e3] text-[#c97d2a]",
  high: "bg-[#e8f5ec] text-[#4a7c59]",
};

export function CategoryTag({ cat }: { cat: TaskCategory }) {
  return (
    <span className={clsx("text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize", CAT_STYLES[cat])}>
      {cat}
    </span>
  );
}

export function EnergyTag({ level }: { level: EnergyLevel }) {
  return (
    <span className={clsx("text-[10px] font-medium px-2 py-0.5 rounded-full capitalize", ENERGY_STYLES[level])}>
      {level} energy
    </span>
  );
}

export function PriorityDot({ priority }: { priority: TaskPriority }) {
  const colors: Record<TaskPriority, string> = {
    high: "bg-red-500",
    medium: "bg-orange-400",
    low: "bg-green-500",
  };
  return <span className={clsx("inline-block w-2 h-2 rounded-full", colors[priority])} title={`${priority} priority`} />;
}
