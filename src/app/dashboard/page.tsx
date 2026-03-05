"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface DashboardData {
  member: { x_handle: string; display_name: string };
  needToFollow: string[];
  notFollowingYou: string[];
  lastSync: string | null;
  totalMembers: number;
  followingCount: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const syncedCount = searchParams.get("synced");

  useEffect(() => {
    setLoading(true);
    fetch("/api/dashboard", { cache: "no-store" })
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [syncedCount]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-red-400">Failed to load dashboard.</div>
      </div>
    );
  }

  const completionPct = data.totalMembers > 1
    ? Math.round((data.followingCount / (data.totalMembers - 1)) * 100)
    : 100;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="border-b border-white/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="font-bold text-lg">Persian X Lobby</Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/sync" className="text-gray-400 hover:text-white transition-colors">Sync</Link>
            <Link href="/matrix" className="text-gray-400 hover:text-white transition-colors">Matrix</Link>
            <span className="text-gray-600">@{data.member.x_handle}</span>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-400 mt-1">
              Welcome back, {data.member.display_name || `@${data.member.x_handle}`}
            </p>
          </div>
          <Link
            href="/sync"
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm hover:bg-white/20 transition-colors"
          >
            Sync Now
          </Link>
        </div>

        {syncedCount && (
          <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm">
            Successfully synced {syncedCount} handles from X!
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-10">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-sm text-gray-500">Completion</div>
            <div className="text-2xl font-bold mt-1">{completionPct}%</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-sm text-gray-500">Following</div>
            <div className="text-2xl font-bold mt-1">{data.followingCount}/{data.totalMembers - 1}</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-sm text-gray-500">Need to follow</div>
            <div className="text-2xl font-bold mt-1 text-amber-400">{data.needToFollow.length}</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-sm text-gray-500">Last sync</div>
            <div className="text-lg font-bold mt-1">
              {data.lastSync ? new Date(data.lastSync).toLocaleDateString() : "Never"}
            </div>
          </div>
        </div>

        {/* Need to follow */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4">
            You need to follow ({data.needToFollow.length})
          </h2>
          {data.needToFollow.length === 0 ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-emerald-400">
              You&apos;re following all group members!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {data.needToFollow.map((handle) => (
                <a
                  key={handle}
                  href={`https://x.com/${handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-colors group"
                >
                  <span className="text-gray-300">@{handle}</span>
                  <span className="text-xs text-gray-600 group-hover:text-white transition-colors">
                    Follow &rarr;
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Not following you */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Haven&apos;t followed you yet ({data.notFollowingYou.length})
          </h2>
          {data.notFollowingYou.length === 0 ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-emerald-400">
              Everyone is following you!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {data.notFollowingYou.map((handle) => (
                <div
                  key={handle}
                  className="bg-white/5 border border-white/10 rounded-xl p-3"
                >
                  <span className="text-gray-400">@{handle}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
