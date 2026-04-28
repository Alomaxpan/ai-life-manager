"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ListTodo, Zap, Heart, UserCircle } from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", Icon: ListTodo },
  { href: "/energy", label: "Energy", Icon: Zap },
  { href: "/habits", label: "Habits", Icon: Heart },
  { href: "/profile", label: "Profile", Icon: UserCircle },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 z-50">
      <div className="flex justify-around items-center py-2 pb-safe">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all ${
                active
                  ? "text-[#4a7c59]"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
