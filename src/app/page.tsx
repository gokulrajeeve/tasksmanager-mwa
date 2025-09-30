"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import AdminDashboard from "@/components/tasks/AdminDashboard";
import UserDashboard from "@/components/tasks/UserDashboard";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!user) {
    // not logged in → redirect to login
    useEffect(() => {
      router.push("/login");
    }, [router]);
    return null;
  }

  // logged in → show correct dashboard
  const isAdmin = user?.user_metadata?.role === "admin";

  return (
    <div className="p-6">
      {isAdmin ? <AdminDashboard /> : <UserDashboard />}
    </div>
  );
}