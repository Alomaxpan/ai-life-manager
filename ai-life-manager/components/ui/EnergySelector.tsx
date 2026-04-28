"use client";
import { EnergyLevel } from "@/types";

const OPTIONS: { level: EnergyLevel; emoji: string; label: string }[] = [
  { level: "low", emoji: "😴", label: "Low" },
  { level: "medium", emoji: "😊", label: "Medium" },
  { level: "high", emoji: "⚡", label: "High" },
];

export function EnergySelector({
  value,
  onChange,
}: {
  value: EnergyLevel;
  onChange: (level: EnergyLevel) => void;
}) {
  return (
    <div className="flex gap-2 p-3 bg-[#e8f5ec] rounded-2xl">
      {OPTIONS.map(({ level, emoji, label }) => (
        <button
          key={level}
          onClick={() => onChange(level)}
          className={`flex-1 py-2.5 px-3 rounded-xl border-2 text-center transition-all text-sm font-medium ${
            value === level
              ? "border-[#4a7c59] bg-[#4a7c59] text-white"
              : "border-transparent bg-white text-gray-600 hover:border-gray-200"
          }`}
        >
          <span className="block text-lg mb-0.5">{emoji}</span>
          {label}
        </button>
      ))}
    </div>
  );
}
