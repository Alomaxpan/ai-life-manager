"use client";
import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loginEmail = async () => {
    if (!email || !password) return toast.error("Enter email and password");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch {
      toast.error("Login failed. Check your credentials.");
    } finally { setLoading(false); }
  };

  const loginGoogle = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/dashboard");
    } catch { toast.error("Google sign-in failed"); }
    finally { setLoading(false); }
  };

  const inp = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#4a7c59] focus:ring-2 focus:ring-[#4a7c59]/10";

  return (
    <div className="min-h-svh flex flex-col justify-center p-6">
      <div className="mb-10 text-center">
        <div className="w-14 h-14 bg-gradient-to-br from-[#4a7c59] to-[#3a7bd5] rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-2xl font-display font-bold">✦</div>
        <h1 className="font-display text-3xl font-semibold text-gray-900 mb-2">Welcome back</h1>
        <p className="text-gray-500 text-sm">Sign in to your AI Life Manager</p>
      </div>
      <div className="space-y-3 mb-6">
        <input type="email" className={inp} placeholder="Email address" value={email}
          onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && loginEmail()} />
        <div className="relative">
          <input type={showPw ? "text" : "password"} className={inp} placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && loginEmail()} />
          <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-3.5 text-gray-400">
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      <button onClick={loginEmail} disabled={loading}
        className="w-full py-3.5 bg-[#4a7c59] text-white rounded-xl font-semibold text-sm hover:bg-[#3d6b4c] transition-colors disabled:opacity-50 mb-3">
        {loading ? "Signing in..." : "Sign in"}
      </button>
      <div className="relative my-4 flex items-center">
        <div className="flex-1 h-px bg-gray-100" /><span className="px-3 text-xs text-gray-400">or</span><div className="flex-1 h-px bg-gray-100" />
      </div>
      <button onClick={loginGoogle} disabled={loading}
        className="w-full py-3.5 border border-gray-200 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
        Continue with Google
      </button>
      <p className="text-center text-sm text-gray-500 mt-6">
        No account? <Link href="/auth/signup" className="text-[#4a7c59] font-semibold hover:underline">Sign up free</Link>
      </p>
    </div>
  );
}
