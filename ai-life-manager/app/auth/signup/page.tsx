"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { createTask } from "@/lib/firestore";
import { SAMPLE_TASKS, SAMPLE_HABITS } from "@/lib/sample-data";
import { createHabit } from "@/lib/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const signup = async () => {
    if (!name || !email || !password) return toast.error("Fill in all fields");
    if (password.length < 6) return toast.error("Password must be 6+ characters");
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      // Seed sample data
      await Promise.all([
        ...SAMPLE_TASKS.map(t => createTask({ ...t, userId: cred.user.uid })),
        ...SAMPLE_HABITS.map(h => createHabit({ ...h, userId: cred.user.uid })),
      ]);
      toast.success("Welcome to AI Life Manager!");
      router.push("/dashboard");
    } catch (e: any) {
      toast.error(e.message?.includes("email-already") ? "Email already in use" : "Signup failed");
    } finally { setLoading(false); }
  };

  const inp = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#4a7c59] focus:ring-2 focus:ring-[#4a7c59]/10";

  return (
    <div className="min-h-svh flex flex-col justify-center p-6">
      <div className="mb-8 text-center">
        <div className="w-14 h-14 bg-gradient-to-br from-[#4a7c59] to-[#3a7bd5] rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-2xl font-display font-bold">✦</div>
        <h1 className="font-display text-3xl font-semibold text-gray-900 mb-2">Get started</h1>
        <p className="text-gray-500 text-sm">Create your AI Life Manager account</p>
      </div>
      <div className="space-y-3 mb-6">
        <input className={inp} placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
        <input type="email" className={inp} placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" className={inp} placeholder="Password (6+ characters)" value={password}
          onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && signup()} />
      </div>
      <div className="bg-[#e8f5ec] rounded-xl p-3 mb-5">
        <p className="text-xs text-[#2d6a4f] font-medium">✦ Sample data included</p>
        <p className="text-xs text-[#4a7c59] mt-0.5">We'll add sample tasks and habits so you can explore right away.</p>
      </div>
      <button onClick={signup} disabled={loading}
        className="w-full py-3.5 bg-[#4a7c59] text-white rounded-xl font-semibold text-sm hover:bg-[#3d6b4c] transition-colors disabled:opacity-50">
        {loading ? "Creating account..." : "Create account"}
      </button>
      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account? <Link href="/auth/login" className="text-[#4a7c59] font-semibold hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
