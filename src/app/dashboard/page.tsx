"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/components/layout/Loader";
import DashboardLayout from "@/components/layout/DashboardLayout";
import UserDashboard from "@/components/tasks/UserDashboard";
import AdminDashboard from "@/components/tasks/AdminDashboard";


export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  useEffect(() => {
  if (!loading) {
    console.log("DashboardPage role:", role);
  }
}, [loading, role]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    } else if (user) {
      const role = (user.user_metadata?.role as string) || "user";
      setRole(role);
    }
  }, [user, loading, router]);

  if (loading) return <Loader />;
  if (!user) return null;

  return (
    <DashboardLayout>
      {role === "admin" ? <AdminDashboard /> : <UserDashboard />}
    </DashboardLayout>
  );
}