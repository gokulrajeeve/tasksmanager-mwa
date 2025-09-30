"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role: "user" } },
    });

    if (error) setError(error.message);
    else setSuccess(true);

    setLoading(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Account</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="email"
          placeholder="Email address"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-600 focus:outline-none bg-gray-50 text-gray-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-600 focus:outline-none bg-gray-50 text-gray-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gray-800 text-white font-semibold hover:bg-gray-900 transition"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}
      {success && <p className="text-green-600 text-sm mt-3 text-center">Account created! You can now log in.</p>}
      <p className="mt-6 text-center text-gray-600">
        Already have an account?{" "}
        <a href="/login" className="text-gray-800 hover:underline font-medium">
          Login
        </a>
      </p>
    </div>
  );
}