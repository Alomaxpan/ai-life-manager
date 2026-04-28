"use client";
import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { EnergyLog } from "@/types";
import { format, subDays } from "date-fns";

Chart.register(...registerables);

export function EnergyChart({ logs }: { logs: EnergyLog[] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (chartRef.current) chartRef.current.destroy();

    const days = Array.from({ length: 7 }, (_, i) =>
      format(subDays(new Date(), 6 - i), "yyyy-MM-dd")
    );
    const labels = days.map(d => format(new Date(d), "EEE"));

    const energyVal = (level: string) => level === "high" ? 3 : level === "medium" ? 2 : 1;

    const periodData = (period: string) =>
      days.map(date => {
        const log = logs.find(l => l.date === date && l.period === period);
        return log ? energyVal(log.level) : null;
      });

    chartRef.current = new Chart(ref.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Morning",
            data: periodData("morning"),
            borderColor: "#4a7c59",
            backgroundColor: "rgba(74,124,89,.1)",
            tension: 0.4,
            fill: true,
            pointRadius: 5,
            pointBackgroundColor: "#4a7c59",
            spanGaps: true,
          },
          {
            label: "Afternoon",
            data: periodData("afternoon"),
            borderColor: "#c97d2a",
            backgroundColor: "transparent",
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: "#c97d2a",
            borderDash: [4, 3],
            spanGaps: true,
          },
          {
            label: "Evening",
            data: periodData("evening"),
            borderColor: "#c4556a",
            backgroundColor: "transparent",
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: "#c4556a",
            borderDash: [2, 4],
            spanGaps: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            min: 0.5, max: 3.5,
            ticks: { stepSize: 1, callback: (v) => ["", "Low", "Med", "High"][v as number] || "", font: { size: 10 } },
            grid: { color: "rgba(0,0,0,.05)" },
          },
          x: { ticks: { font: { size: 11 } }, grid: { display: false } },
        },
      },
    });
    return () => chartRef.current?.destroy();
  }, [logs]);

  return (
    <div>
      <div className="flex gap-4 mb-3">
        {[["#4a7c59","Morning"],["#c97d2a","Afternoon"],["#c4556a","Evening"]].map(([color, label]) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: color }} />
            <span className="text-[11px] text-gray-500">{label}</span>
          </div>
        ))}
      </div>
      <div style={{ position: "relative", height: "180px" }}>
        <canvas ref={ref} role="img" aria-label="Weekly energy levels by period">Weekly energy chart</canvas>
      </div>
    </div>
  );
}
