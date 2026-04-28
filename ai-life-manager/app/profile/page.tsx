"use client";
import { useAuth } from "@/components/layout/AuthProvider";
import { useAppStore } from "@/store/app-store";
import { BottomNav } from "@/components/layout/BottomNav";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createOrUpdateUserProfile } from "@/lib/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { LogOut, Bell, Moon, BarChart2, Clock } from "lucide-react";

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle}
      className={`w-11 h-6 rounded-full transition-all flex-shrink-0 relative ${on ? "bg-[#4a7c59]" : "bg-gray-200"}`}>
      <span className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all shadow-sm ${on ? "left-5.5" : "left-0.5"}`}
        style={{ left: on ? "22px" : "2px" }} />
    </button>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  const { userProfile, setUserProfile, tasks } = useAppStore();
  const router = useRouter();

  const [settings, setSettings] = useState({
    darkMode: userProfile?.darkMode || false,
    smartNotifications: userProfile?.smartNotifications ?? true,
    weeklyReport: userProfile?.weeklyReport ?? true,
  });

  const updateSetting = async (key: keyof typeof settings) => {
    if (!user) return;
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    await createOrUpdateUserProfile({ uid: user.uid, ...updated });
    setUserProfile({ ...userProfile!, ...updated });
  };

  const logout = async () => {
    await signOut(auth);
    router.push("/auth/login");
    toast("Signed out. See you soon!", { icon: "👋" });
  };

  const name = userProfile?.displayName || user?.email?.split("@")[0] || "User";
  const initials = name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  const done = tasks.filter((t: any) => t.status === "completed").length;

  return (
    <div className="page-enter">
      <div className="px-4 pt-6 pb-4">
        <h1 className="font-display text-2xl font-semibold text-gray-900">Profile</h1>
      </div>

      {/* Profile hero */}
      <div className="px-4 mb-5">
        <div className="bg-gradient-to-br from-[#e8f5ec] to-[#e8f0fb] rounded-2xl p-5 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#4a7c59] to-[#3a7bd5] rounded-full mx-auto mb-3 flex items-center justify-center text-white text-xl font-bold">
            {initials}
          </div>
          <p className="font-display text-xl font-semibold text-gray-900">{name}</p>
          <p className="text-sm text-gray-500 mt-0.5">{user?.email}</p>
          <div className="flex justify-center gap-8 mt-4">
            {[
              { value: userProfile?.streak || 1, label: "Day streak", color: "text-amber-500" },
              { value: done, label: "Tasks done", color: "text-[#3a7bd5]" },
              { value: "84%", label: "Habit rate", color: "text-[#4a7c59]" },
            ].map(({ value, label, color }) => (
              <div key={label} className="text-center">
                <p className={`text-xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="px-4 mb-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Settings</p>
        <div className="bg-white border border-gray-100 rounded-2xl divide-y divide-gray-50">
          {[
            { key: "darkMode" as const, icon: Moon, label: "Dark mode", desc: "Easier on your eyes at night" },
            { key: "smartNotifications" as const, icon: Bell, label: "Smart notifications", desc: "Context-aware, not spammy" },
            { key: "weeklyReport" as const, icon: BarChart2, label: "Weekly insights report", desc: "Every Sunday evening" },
          ].map(({ key, icon: Icon, label, desc }) => (
            <div key={key} className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-3">
                <Icon size={16} className="text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
              </div>
              <Toggle on={settings[key]} onToggle={() => updateSetting(key)} />
            </div>
          ))}
          <div className="flex items-center justify-between px-4 py-3.5">
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-800">Preferred work hours</p>
                <p className="text-xs text-gray-400">AI schedules deep work here</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-[#4a7c59]">
              {userProfile?.preferredWorkStart || "9:00"} – {userProfile?.preferredWorkEnd || "17:00"}
            </span>
          </div>
        </div>
      </div>

      {/* Weekly insight */}
      <div className="px-4 mb-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">This week's summary</p>
        <div className="bg-gradient-to-br from-[#e8f5ec] to-[#e8f0fb] rounded-2xl p-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            You completed <strong>{done} tasks</strong> this week.
            Your streak is <strong>{userProfile?.streak || 1} days</strong> — keep the momentum going!
            Try scheduling your hardest tasks in the morning when your energy peaks.
          </p>
        </div>
      </div>

      {/* Logout */}
      <div className="px-4 mb-28">
        <button onClick={logout}
          className="w-full py-3 border border-red-100 text-red-500 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-50 transition-colors">
          <LogOut size={16} />
          Sign out
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
