"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserProfile, createOrUpdateUserProfile, updateStreak } from "@/lib/firestore";
import { useAppStore } from "@/store/app-store";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType { user: User | null; loading: boolean; }
const AuthContext = createContext<AuthContextType>({ user: null, loading: true });
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { setUserProfile } = useAppStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);
      if (u) {
        let profile = await getUserProfile(u.uid);
        if (!profile) {
          const np = {
            uid: u.uid, email: u.email || "",
            displayName: u.displayName || u.email?.split("@")[0] || "User",
            photoURL: u.photoURL || undefined,
            preferredWorkStart: "09:00", preferredWorkEnd: "17:00",
            darkMode: false, smartNotifications: true, weeklyReport: true,
            streak: 1, lastActiveDate: new Date().toISOString().split("T")[0],
            createdAt: new Date().toISOString(),
          };
          await createOrUpdateUserProfile(np);
          profile = np;
        } else {
          await updateStreak(u.uid);
          profile = await getUserProfile(u.uid);
        }
        setUserProfile(profile);
        if (pathname?.startsWith("/auth")) router.push("/dashboard");
      } else {
        setUserProfile(null);
        if (!pathname?.startsWith("/auth") && pathname !== "/") router.push("/auth/login");
      }
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {loading ? (
        <div className="flex items-center justify-center min-h-svh">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-3"
              style={{ borderColor: "#4a7c59", borderTopColor: "transparent" }} />
            <p className="text-sm text-gray-400">Loading your life...</p>
          </div>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
}
