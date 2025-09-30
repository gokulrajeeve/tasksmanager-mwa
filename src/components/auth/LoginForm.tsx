"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Sign In</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email address"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 
                     text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 
                     focus:border-indigo-400 transition shadow-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 
                     text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 
                     focus:border-indigo-400 transition shadow-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gray-900 text-white font-semibold 
                     hover:bg-gray-800 focus:ring-2 focus:ring-indigo-400 focus:outline-none 
                     transform hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      {error && (
        <p className="mt-4 text-sm px-3 py-2 rounded-lg bg-red-100 text-red-700 text-center">
          {error}
        </p>
      )}
      <p className="mt-6 text-center text-gray-600">
        Don’t have an account?{" "}
        <a href="/register" className="text-black-500 hover:underline font-medium">
          Register
        </a>
      </p>
    </div>
  );
}