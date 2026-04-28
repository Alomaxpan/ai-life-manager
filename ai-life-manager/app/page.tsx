"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/layout/AuthProvider";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading) router.push(user ? "/dashboard" : "/auth/login");
  }, [user, loading]);
  return null;
}
