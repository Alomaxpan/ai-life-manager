"use client";
import { Task, EnergyLevel } from "@/types";
import { getBestTask, scoreTask } from "@/lib/ai-engine";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function BestTaskCard({ tasks, energy }: { tasks: Task[]; energy: EnergyLevel }) {
  const best = getBestTask(tasks, energy);

  if (!best) {
    return (
      <div className="mx-4 mb-4 rounded-2xl p-5 bg-gradient-to-br from-[#2d6a4f] to-[#40916c] text-white">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={12} className="opacity-80" />
          <span className="text-[10px] uppercase tracking-widest opacity-80">AI Suggestion</span>
        </div>
        <p className="font-display text-xl font-semibold">All done! 🎉</p>
        <p className="text-sm opacity-80 mt-1">You've completed all your tasks. Take a well-earned rest.</p>
      </div>
    );
  }

  const energyMessages: Record<EnergyLevel, string> = {
    high: "Your energy is high — tackle this now!",
    medium: "Good energy match for this task.",
    low: "Manageable even at low energy.",
  };

  return (
    <Link href="/tasks" className="block mx-4 mb-4">
      <div className="rounded-2xl p-5 bg-gradient-to-br from-[#2d6a4f] to-[#40916c] text-white relative overflow-hidden cursor-pointer hover:opacity-95 transition-opacity">
        <div className="absolute right-[-15px] top-[-15px] w-20 h-20 rounded-full bg-white/10" />
        <div className="absolute right-4 bottom-[-20px] w-16 h-16 rounded-full bg-white/5" />
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={12} className="opacity-80" />
          <span className="text-[10px] uppercase tracking-widest opacity-80">Best task for you right now</span>
        </div>
        <p className="font-display text-xl font-semibold leading-tight mb-3">{best.name}</p>
        <div className="flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <span className="text-[11px] bg-white/20 px-2.5 py-1 rounded-full capitalize">{best.category}</span>
            <span className="text-[11px] bg-white/20 px-2.5 py-1 rounded-full">{best.estimatedMinutes} mins</span>
            <span className="text-[11px] bg-white/20 px-2.5 py-1 rounded-full capitalize">{best.energyRequired} energy</span>
          </div>
          <ArrowRight size={18} className="opacity-70 flex-shrink-0" />
        </div>
        <p className="text-[11px] opacity-70 mt-2">{energyMessages[energy]}</p>
      </div>
    </Link>
  );
}
