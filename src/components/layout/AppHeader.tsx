"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import LogoutButton from "@/components/auth/LogoutButton";

function getInitials(email?: string | null) {
  if (!email) return "U";
  const at = email.split("@")[0];
  const parts = at.replace(/[^a-zA-Z0-9]/g, " ").trim().split(/\s+/);
  const initials = parts.slice(0, 2).map(p => p[0]?.toUpperCase()).join("");
  return initials || "U";
}

export default function AppHeader() {
  const pathname = usePathname();
  const { user } = useAuth();

  // If on login or register, show just the logo
  const isAuthPage = pathname === "/login" || pathname === "/register";
if (isAuthPage) {
  return (
    <header className="sticky top-0 z-40 bg-transparent shadow-none border-none">
      <div className="h-16 flex items-center justify-center px-6">
        <Link href="/" className="group inline-flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gray-900 text-white grid place-items-center font-extrabold tracking-tight">
            M
          </div>
          <div className="leading-tight">
            <div className="font-semibold text-gray-900">MWA Tasks</div>
            <div className="text-xs text-gray-700 -mt-0.5">Task Manager</div>
          </div>
        </Link>
      </div>
    </header>
  );
}
  // Otherwise show the full header (dashboard and app)
  const role = (user?.user_metadata?.role as string) || "user";
  const roleStyles =
    role === "admin"
      ? "bg-indigo-100 text-indigo-800"
      : "bg-gray-200 text-gray-800";

  return (
    <header className="sticky top-0 z-40 bg-transparent">
      <div className="h-16 flex items-center justify-between px-6">
        {/* Brand */}
        <Link href="/dashboard" className="group inline-flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gray-900 text-white grid place-items-center font-extrabold tracking-tight">
            M
          </div>
          <div className="leading-tight">
            <div className="font-semibold text-gray-900">MWA Tasks</div>
            <div className="text-xs text-gray-700 -mt-0.5">Task Manager</div>
          </div>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Role chip */}
          <span
            className={`px-2.5 py-1 text-xs font-semibold rounded-full ${roleStyles}`}
          >
            {role === "admin" ? "Admin" : "User"}
          </span>

          {/* User info */}
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-sm text-gray-900">{user?.email}</span>
            <div className="h-9 w-9 rounded-full bg-gray-800 text-white grid place-items-center text-sm font-semibold">
              {getInitials(user?.email)}
            </div>
          </div>

          {/* Sign out */}
          <LogoutButton className="px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-100 hover:text-gray-900" />
        </div>
      </div>
    </header>
  );
}