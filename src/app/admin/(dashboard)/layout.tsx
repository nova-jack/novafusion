// src/app/admin/(dashboard)/layout.tsx
"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";

interface User {
  email: string;
  name: string;
  role: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/auth", {
        credentials: 'include', // Important for cookies
      });
      
      if (!res.ok) {
        router.replace("/admin/login");
        return;
      }

      const data = await res.json();
      
      if (data.authenticated && data.user) {
        setUser(data.user);
      } else {
        router.replace("/admin/login");
      }
    } catch {
      router.replace("/admin/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Re-check auth periodically (optional - detect session expiry)
  useEffect(() => {
    const interval = setInterval(checkAuth, 5 * 60 * 1000); // Every 5 minutes
    return () => clearInterval(interval);
  }, [checkAuth]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar user={user} />
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}