"use client";

import { useEffect, useState } from "react";
import GuildNav from "@/components/guild-nav";

interface Member {
  id: string;
  x_handle: string;
  display_name: string;
}

export default function ManualSyncPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [pasteMode, setPasteMode] = useState(false);
  const [pasteText, setPasteText] = useState("");

  useEffect(() => {
    fetch("/api/members")
      .then((r) => r.json())
      .then((data) => setMembers(data.members || []))
      .finally(() => setLoading(false));
  }, []);

  function toggleAll() {
    if (checked.size === members.length) {
      setChecked(new Set());
    } else {
      setChecked(new Set(members.map((m) => m.x_handle)));
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setResult(null);

    let handles: string[];
    if (pasteMode) {
      handles = pasteText
        .split(/[\n,\s]+/)
        .map((h) => h.replace(/^@/, "").trim())
        .filter(Boolean);
    } else {
      handles = Array.from(checked);
    }

    try {
      await fetch("/api/sync-info");

      const res = await fetch("/api/sync-manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handles }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(`Synced ${data.count} handles successfully!`);
      } else {
        setResult(`Error: ${data.error}`);
      }
    } catch {
      setResult("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070d1b] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#C8A951]/20 border-t-[#C8A951] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070d1b] text-white">
      <GuildNav />

      <main className="max-w-3xl mx-auto px-6 py-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C8A951]/80 mb-3">
          Manual
        </p>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Manual Sync</h1>
        <p className="text-white/40 mb-6">
          Check the members you follow, or paste a list of handles.
        </p>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setPasteMode(false)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              !pasteMode
                ? "bg-[#C8A951] text-[#0B1120]"
                : "bg-white/[0.05] border border-white/[0.08] text-white/40 hover:text-white/60"
            }`}
          >
            Checklist
          </button>
          <button
            onClick={() => setPasteMode(true)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              pasteMode
                ? "bg-[#C8A951] text-[#0B1120]"
                : "bg-white/[0.05] border border-white/[0.08] text-white/40 hover:text-white/60"
            }`}
          >
            Paste Handles
          </button>
        </div>

        {pasteMode ? (
          <div className="mb-6">
            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="Paste handles, one per line or comma-separated&#10;@handle1&#10;@handle2&#10;handle3"
              rows={10}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 text-white placeholder-white/15 focus:outline-none focus:border-[#C8A951]/30 font-mono text-sm transition-colors"
            />
          </div>
        ) : (
          <div className="mb-6">
            <button onClick={toggleAll} className="text-sm text-white/25 hover:text-white/50 mb-3 transition-colors">
              {checked.size === members.length ? "Uncheck all" : "Check all"}
            </button>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {members.map((m) => (
                <label
                  key={m.id}
                  className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl p-3.5 cursor-pointer hover:bg-white/[0.05] hover:border-white/[0.1] transition-all"
                >
                  <input
                    type="checkbox"
                    checked={checked.has(m.x_handle)}
                    onChange={() => {
                      const next = new Set(checked);
                      if (next.has(m.x_handle)) next.delete(m.x_handle);
                      else next.add(m.x_handle);
                      setChecked(next);
                    }}
                    className="w-4 h-4 rounded accent-[#C8A951]"
                  />
                  <span className="text-white/60">@{m.x_handle}</span>
                  {m.display_name && <span className="text-white/20 text-sm">({m.display_name})</span>}
                </label>
              ))}
            </div>
          </div>
        )}

        {result && (
          <div className={`p-4 rounded-xl mb-4 text-sm ${
            result.startsWith("Error")
              ? "bg-red-500/10 border border-red-500/20 text-red-400"
              : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
          }`}>
            {result}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-3 bg-[#C8A951] text-[#0B1120] font-semibold rounded-xl hover:bg-[#dbbf6a] transition-colors disabled:opacity-50"
        >
          {submitting ? "Syncing..." : "Sync"}
        </button>
      </main>
    </div>
  );
}
