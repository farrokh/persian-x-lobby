"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface AdminMember {
  id: string;
  x_handle: string;
  display_name: string;
  email: string;
  joined_at: string;
  lastSync: string | null;
  followingCount: number;
  followersCount: number;
}

export default function AdminPage() {
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [digestResult, setDigestResult] = useState<string | null>(null);
  const [sendingDigest, setSendingDigest] = useState(false);

  useEffect(() => {
    fetch("/api/admin/members")
      .then((r) => r.json())
      .then((data) => setMembers(data.members || []))
      .finally(() => setLoading(false));
  }, []);

  async function triggerDigest() {
    setSendingDigest(true);
    setDigestResult(null);
    try {
      const res = await fetch("/api/admin/digest", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setDigestResult(`Sent ${data.emailsSent} digest emails.`);
      } else {
        setDigestResult(`Error: ${data.error}`);
      }
    } catch {
      setDigestResult("Network error.");
    } finally {
      setSendingDigest(false);
    }
  }

  async function removeMember(id: string, handle: string) {
    if (!confirm(`Remove @${handle} from the lobby?`)) return;
    const res = await fetch(`/api/admin/members?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="font-bold text-lg">Persian X Lobby</Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link>
            <span className="text-amber-400 text-xs bg-amber-400/10 px-2 py-1 rounded">Admin</span>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <button
            onClick={triggerDigest}
            disabled={sendingDigest}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-500 transition-colors disabled:opacity-50"
          >
            {sendingDigest ? "Sending..." : "Send Email Digest"}
          </button>
        </div>

        {digestResult && (
          <div className="p-3 bg-white/5 border border-white/10 rounded-lg mb-6 text-sm text-gray-300">
            {digestResult}
          </div>
        )}

        <div className="bg-white/5 border border-white/10 rounded-xl p-2 mb-6">
          <div className="text-sm text-gray-500 p-2">
            {members.length} members
          </div>
        </div>

        <div className="overflow-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-gray-500">
                <th className="p-3">Handle</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Joined</th>
                <th className="p-3">Last Sync</th>
                <th className="p-3">Following</th>
                <th className="p-3">Followers</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-3 font-medium">@{m.x_handle}</td>
                  <td className="p-3 text-gray-400">{m.display_name || "-"}</td>
                  <td className="p-3 text-gray-400">{m.email}</td>
                  <td className="p-3 text-gray-400">{new Date(m.joined_at).toLocaleDateString()}</td>
                  <td className="p-3 text-gray-400">
                    {m.lastSync ? new Date(m.lastSync).toLocaleDateString() : "Never"}
                  </td>
                  <td className="p-3">{m.followingCount}</td>
                  <td className="p-3">{m.followersCount}</td>
                  <td className="p-3">
                    <button
                      onClick={() => removeMember(m.id, m.x_handle)}
                      className="text-red-400 hover:text-red-300 text-xs"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
