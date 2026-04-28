"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/layout/AuthProvider";
import { useAppStore } from "@/store/app-store";
import { getEnergyLogs, logEnergy } from "@/lib/firestore";
import { EnergyChart } from "@/components/energy/EnergyChart";
import { EnergySelector } from "@/components/ui/EnergySelector";
import { BottomNav } from "@/components/layout/BottomNav";
import { analyzePeakHours } from "@/lib/ai-engine";
import { EnergyLevel } from "@/types";
import { format } from "date-fns";
import toast from "react-hot-toast";

type Period = "morning" | "afternoon" | "evening";
const PERIODS: { id: Period; label: string; time: string; emoji: string }[] = [
  { id: "morning", label: "Morning", time: "6am – 12pm", emoji: "🌅" },
  { id: "afternoon", label: "Afternoon", time: "12pm – 6pm", emoji: "☀️" },
  { id: "evening", label: "Evening", time: "6pm – 12am", emoji: "🌙" },
];

export default function EnergyPage() {
  const { user } = useAuth();
  const { energyLogs, setEnergyLogs } = useAppStore();
  const [localLogs, setLocalLogs] = useState<Record<Period, EnergyLevel>>({
    morning: "medium", afternoon: "medium", evening: "low",
  });

  useEffect(() => {
    if (!user) return;
    getEnergyLogs(user.uid, 14).then(logs => {
      setEnergyLogs(logs);
      const today = format(new Date(), "yyyy-MM-dd");
      const todayLogs = logs.filter(l => l.date === today);
      todayLogs.forEach(l => {
        setLocalLogs(prev => ({ ...prev, [l.period]: l.level }));
      });
    });
  }, [user]);

  const saveLog = async (period: Period, level: EnergyLevel) => {
    if (!user) return;
    setLocalLogs(prev => ({ ...prev, [period]: level }));
    await logEnergy({ userId: user.uid, date: format(new Date(), "yyyy-MM-dd"), period, level });
    setEnergyLogs(await getEnergyLogs(user.uid, 14));
    toast.success(`${period.charAt(0).toUpperCase() + period.slice(1)} energy logged!`);
  };

  const peak = energyLogs.length >= 3 ? analyzePeakHours(energyLogs) : null;

  return (
    <div className="page-enter">
      <div className="px-4 pt-6 pb-4">
        <h1 className="font-display text-2xl font-semibold text-gray-900">Energy Tracker</h1>
        <p className="text-sm text-gray-400 mt-0.5">Track patterns, work smarter</p>
      </div>

      {/* Chart */}
      <div className="px-4 mb-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">This week's patterns</p>
        <div className="bg-white border border-gray-100 rounded-2xl p-4">
          <EnergyChart logs={energyLogs} />
        </div>
      </div>

      {/* AI Prediction */}
      {peak && (
        <div className="px-4 mb-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">AI predictions</p>
          <div className="space-y-2">
            <div className="bg-[#e8f0fb] rounded-2xl p-4 flex gap-3">
              <span className="text-xl">🔮</span>
              <div>
                <p className="text-sm font-semibold text-[#3a7bd5]">Peak: {peak.peakPeriod}</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{peak.recommendation}</p>
              </div>
            </div>
            <div className="bg-[#fdf3e3] rounded-2xl p-4 flex gap-3">
              <span className="text-xl">📉</span>
              <div>
                <p className="text-sm font-semibold text-[#c97d2a]">Low point: {peak.lowPeriod}</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Reserve admin tasks, emails, and light reading for your {peak.lowPeriod}.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log energy */}
      <div className="px-4 mb-28">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Log today's energy</p>
        <div className="space-y-3">
          {PERIODS.map(({ id, label, time, emoji }) => (
            <div key={id} className="bg-white border border-gray-100 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400">{time}</p>
                </div>
              </div>
              <EnergySelector value={localLogs[id]} onChange={level => saveLog(id, level)} />
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
