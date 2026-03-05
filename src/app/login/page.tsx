"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ x_handle: "", invite_code: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", ...form }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#070d1b]">
      {/* Subtle noise texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
      }} />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8">
          <Link href="/x-lobby" className="text-white/20 hover:text-white/50 transition-colors text-sm">
            &larr; Back
          </Link>

          <div className="mt-6 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C8A951] to-[#8B6914] flex items-center justify-center">
              <span className="text-white text-lg">&#10022;</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white tracking-tight">Sign In</h1>
          <p className="text-white/35 mt-2">Welcome back to the guild.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-white/30 uppercase tracking-[0.12em] font-medium mb-1.5">X Handle</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">@</span>
              <input
                type="text"
                required
                placeholder="yourhandle"
                value={form.x_handle}
                onChange={(e) => setForm({ ...form, x_handle: e.target.value })}
                className="w-full pl-9 pr-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder-white/15 focus:outline-none focus:border-[#C8A951]/30 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/30 uppercase tracking-[0.12em] font-medium mb-1.5">Invite Code</label>
            <input
              type="text"
              required
              placeholder="Your invite code"
              value={form.invite_code}
              onChange={(e) => setForm({ ...form, invite_code: e.target.value })}
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder-white/15 focus:outline-none focus:border-[#C8A951]/30 transition-colors"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#C8A951] text-[#0B1120] font-semibold rounded-xl hover:bg-[#dbbf6a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/25">
          Not a member?{" "}
          <Link href="/join" className="text-[#C8A951]/70 hover:text-[#C8A951] transition-colors">
            Join the guild
          </Link>
        </p>
      </div>
    </div>
  );
}
