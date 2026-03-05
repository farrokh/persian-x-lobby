"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export default function RequestAccessForm() {
  const [form, setForm] = useState({ x_handle: "", email: "", name: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
          <Check className="w-7 h-7 text-emerald-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Request Submitted</h3>
        <p className="text-white/35 text-sm max-w-sm mx-auto">
          We&apos;ll review your request and send you an invite code via email once approved.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3 text-left">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 text-sm">@</span>
            <input
              type="text"
              required
              placeholder="yourhandle"
              value={form.x_handle}
              onChange={(e) => setForm({ ...form, x_handle: e.target.value })}
              className="w-full pl-8 pr-3 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-white/15 focus:outline-none focus:border-[#C8A951]/30 transition-colors"
            />
          </div>
        </div>
        <div>
          <input
            type="text"
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3.5 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-white/15 focus:outline-none focus:border-[#C8A951]/30 transition-colors"
          />
        </div>
      </div>
      <input
        type="email"
        required
        placeholder="your@email.com"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full px-3.5 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-white/15 focus:outline-none focus:border-[#C8A951]/30 transition-colors"
      />
      <textarea
        placeholder="Why do you want to join? (optional)"
        rows={2}
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className="w-full px-3.5 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-white/15 focus:outline-none focus:border-[#C8A951]/30 transition-colors resize-none"
      />

      {error && (
        <p className="text-sm text-red-400 text-center">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="group w-full flex items-center justify-center gap-2 py-3.5 bg-[#C8A951] text-[#0B1120] font-bold rounded-xl hover:bg-[#dbbf6a] transition-colors disabled:opacity-50 shadow-lg shadow-[#C8A951]/15"
      >
        {loading ? "Submitting..." : "Request Access"}
        {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
      </button>
    </form>
  );
}
