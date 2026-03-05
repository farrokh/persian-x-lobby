"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
      // Get token from cookie via API
      const tokenRes = await fetch("/api/sync-info");
      const tokenData = await tokenRes.json();

      // We need to extract the token from the bookmarklet URL - instead use a direct cookie-based endpoint
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
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-gray-400">Loading members...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="border-b border-white/10 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="font-bold text-lg">Persian X Lobby</Link>
          <Link href="/sync" className="text-gray-400 hover:text-white transition-colors text-sm">
            &larr; Back to Sync
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-2">Manual Sync</h1>
        <p className="text-gray-400 mb-6">
          Check the members you follow, or paste a list of handles.
        </p>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setPasteMode(false)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${!pasteMode ? "bg-white text-black" : "bg-white/10 text-gray-400"}`}
          >
            Checklist
          </button>
          <button
            onClick={() => setPasteMode(true)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${pasteMode ? "bg-white text-black" : "bg-white/10 text-gray-400"}`}
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
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 font-mono text-sm"
            />
          </div>
        ) : (
          <div className="mb-6">
            <button onClick={toggleAll} className="text-sm text-gray-400 hover:text-white mb-3 transition-colors">
              {checked.size === members.length ? "Uncheck all" : "Check all"}
            </button>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {members.map((m) => (
                <label
                  key={m.id}
                  className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-3 cursor-pointer hover:bg-white/10 transition-colors"
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
                    className="w-4 h-4 rounded accent-emerald-500"
                  />
                  <span className="text-gray-300">@{m.x_handle}</span>
                  {m.display_name && <span className="text-gray-600 text-sm">({m.display_name})</span>}
                </label>
              ))}
            </div>
          </div>
        )}

        {result && (
          <div className={`p-3 rounded-lg mb-4 text-sm ${result.startsWith("Error") ? "bg-red-500/10 border border-red-500/20 text-red-400" : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"}`}>
            {result}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          {submitting ? "Syncing..." : "Sync"}
        </button>
      </main>
    </div>
  );
}
