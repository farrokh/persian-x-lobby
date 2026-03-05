"use client";

import { useEffect, useState } from "react";
import { User, TrendingUp, TrendingDown, BarChart3, LayoutGrid, Table2 } from "lucide-react";
import GuildNav from "@/components/guild-nav";

interface MatrixData {
  members: { id: string; x_handle: string }[];
  matrix: Record<string, Set<string>>;
  stats: { handle: string; following: number; followers: number; pct: number }[];
}

function Avatar({ handle, size = 28 }: { handle: string; size?: number }) {
  const [error, setError] = useState(false);
  if (error) {
    return (
      <div
        className="rounded-full bg-[#1a2540] flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
      >
        <User className="text-[#C8A951]/30" style={{ width: size * 0.45, height: size * 0.45 }} />
      </div>
    );
  }
  return (
    <img
      src={`https://unavatar.io/x/${handle}`}
      alt={`@${handle}`}
      width={size}
      height={size}
      className="rounded-full shrink-0 object-cover bg-[#1a2540]"
      loading="lazy"
      onError={() => setError(true)}
    />
  );
}

type ViewMode = "cards" | "table";

export default function MatrixPage() {
  const [data, setData] = useState<MatrixData | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>("cards");

  useEffect(() => {
    fetch("/api/matrix")
      .then((r) => r.json())
      .then((raw) => {
        const matrix: Record<string, Set<string>> = {};
        for (const [key, handles] of Object.entries(raw.matrix)) {
          matrix[key] = new Set(handles as string[]);
        }
        setData({ members: raw.members, matrix, stats: raw.stats });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070d1b] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#C8A951]/20 border-t-[#C8A951] rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const sortedStats = [...data.stats].sort((a, b) => b.pct - a.pct);
  const avgCompletion = data.stats.length > 0
    ? Math.round(data.stats.reduce((a, s) => a + s.pct, 0) / data.stats.length)
    : 0;

  return (
    <div className="min-h-screen bg-[#070d1b] text-white">
      <GuildNav />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C8A951]/80 mb-3">
              Network
            </p>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Follow Matrix</h1>
            <p className="text-white/40">
              See who follows whom across the guild.
            </p>
          </div>
        </div>

        {/* Stats row */}
        {data.stats.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <div className="relative overflow-hidden bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] rounded-2xl p-5 hover:border-[#C8A951]/20 transition-colors">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#C8A951]/[0.03] rounded-full -translate-y-8 translate-x-8" />
              <BarChart3 className="w-5 h-5 text-[#C8A951]/40 mb-3" />
              <p className="text-3xl font-bold tabular-nums text-white/90">{avgCompletion}%</p>
              <p className="text-[11px] text-white/25 uppercase tracking-[0.12em] mt-1">Avg Completion</p>
            </div>
            <div className="relative overflow-hidden bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] rounded-2xl p-5 hover:border-[#C8A951]/20 transition-colors">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#C8A951]/[0.03] rounded-full -translate-y-8 translate-x-8" />
              <TrendingUp className="w-5 h-5 text-emerald-400/40 mb-3" />
              <div className="flex items-center gap-2.5">
                <Avatar handle={sortedStats[0]?.handle} size={32} />
                <div>
                  <p className="text-lg font-bold text-[#C8A951]">@{sortedStats[0]?.handle}</p>
                  <p className="text-[11px] text-white/25 uppercase tracking-[0.12em]">Most Connected</p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] rounded-2xl p-5 hover:border-[#C8A951]/20 transition-colors">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#C8A951]/[0.03] rounded-full -translate-y-8 translate-x-8" />
              <TrendingDown className="w-5 h-5 text-red-400/40 mb-3" />
              <div className="flex items-center gap-2.5">
                <Avatar handle={sortedStats[sortedStats.length - 1]?.handle} size={32} />
                <div>
                  <p className="text-lg font-bold text-white/60">@{sortedStats[sortedStats.length - 1]?.handle}</p>
                  <p className="text-[11px] text-white/25 uppercase tracking-[0.12em]">Least Connected</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Member leaderboard */}
        <div className="mb-10">
          <h2 className="text-base font-bold text-white/90 mb-4">Member Rankings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sortedStats.map((s, i) => (
              <div
                key={s.handle}
                className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3 hover:border-white/[0.1] transition-all"
              >
                <span className={`text-xs font-bold tabular-nums w-5 text-center ${
                  i === 0 ? "text-[#C8A951]" : i === 1 ? "text-white/40" : i === 2 ? "text-amber-700" : "text-white/15"
                }`}>
                  {i + 1}
                </span>
                <Avatar handle={s.handle} size={32} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/70 truncate">@{s.handle}</p>
                  <p className="text-[11px] text-white/20">
                    {s.following} following &middot; {s.followers} followers
                  </p>
                </div>
                <div className="shrink-0">
                  <div className="w-12 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${s.pct}%`,
                        background: s.pct === 100
                          ? "#22c55e"
                          : s.pct >= 70
                            ? "linear-gradient(90deg, #C8A951, #E8D48B)"
                            : "#ef4444",
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-white/20 text-right mt-0.5 tabular-nums">{s.pct}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View toggle + Matrix */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white/90">Full Matrix</h2>
            <div className="flex items-center bg-white/[0.04] border border-white/[0.06] rounded-lg p-0.5">
              <button
                onClick={() => setView("cards")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  view === "cards"
                    ? "bg-[#C8A951] text-[#0B1120]"
                    : "text-white/30 hover:text-white/60"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> Cards
              </button>
              <button
                onClick={() => setView("table")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  view === "table"
                    ? "bg-[#C8A951] text-[#0B1120]"
                    : "text-white/30 hover:text-white/60"
                }`}
              >
                <Table2 className="w-3.5 h-3.5" /> Table
              </button>
            </div>
          </div>

          {/* ─── Cards View ─── */}
          {view === "cards" && (
            <div className="space-y-4">
              {data.members.map((row) => {
                const stat = data.stats.find((s) => s.handle === row.x_handle);
                const otherMembers = data.members.filter((m) => m.id !== row.id);
                const followsList = otherMembers.filter((m) => data.matrix[row.id]?.has(m.x_handle));
                const notFollowsList = otherMembers.filter((m) => !data.matrix[row.id]?.has(m.x_handle));

                return (
                  <div
                    key={row.id}
                    className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.1] transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar handle={row.x_handle} size={36} />
                        <div>
                          <p className="text-sm font-semibold text-white/80">@{row.x_handle}</p>
                          <p className="text-[11px] text-white/20">
                            Follows {stat?.following ?? 0} of {otherMembers.length} members
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${stat?.pct ?? 0}%`,
                              background: (stat?.pct ?? 0) === 100
                                ? "#22c55e"
                                : (stat?.pct ?? 0) >= 70
                                  ? "linear-gradient(90deg, #C8A951, #E8D48B)"
                                  : "#ef4444",
                            }}
                          />
                        </div>
                        <span className={`text-sm font-bold tabular-nums ${
                          (stat?.pct ?? 0) === 100 ? "text-emerald-400" : (stat?.pct ?? 0) >= 70 ? "text-[#C8A951]" : "text-red-400/70"
                        }`}>
                          {stat?.pct ?? 0}%
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-emerald-500/[0.04] border border-emerald-500/10 rounded-xl p-3">
                        <p className="text-[10px] text-emerald-400/50 uppercase tracking-[0.12em] font-medium mb-2.5">
                          Follows ({followsList.length})
                        </p>
                        {followsList.length === 0 ? (
                          <p className="text-[11px] text-white/15">None</p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {followsList.map((m) => (
                              <a
                                key={m.id}
                                href={`https://x.com/${m.x_handle}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative"
                                title={`@${m.x_handle}`}
                              >
                                <Avatar handle={m.x_handle} size={28} />
                                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                                  <span className="text-emerald-400 text-[8px]">&#10003;</span>
                                </div>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="bg-red-500/[0.04] border border-red-500/10 rounded-xl p-3">
                        <p className="text-[10px] text-red-400/50 uppercase tracking-[0.12em] font-medium mb-2.5">
                          Doesn&apos;t Follow ({notFollowsList.length})
                        </p>
                        {notFollowsList.length === 0 ? (
                          <p className="text-[11px] text-emerald-400/40">All followed!</p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {notFollowsList.map((m) => (
                              <a
                                key={m.id}
                                href={`https://x.com/${m.x_handle}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative opacity-50 hover:opacity-80 transition-opacity"
                                title={`@${m.x_handle}`}
                              >
                                <Avatar handle={m.x_handle} size={28} />
                                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                                  <span className="text-red-400 text-[8px]">&#10007;</span>
                                </div>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ─── Table View ─── */}
          {view === "table" && (
            <div className="overflow-auto rounded-2xl border border-white/[0.06] matrix-scroll">
              <table className="border-collapse">
                <thead>
                  <tr>
                    <th className="sticky left-0 z-10 bg-[#0a1225] border-b border-r border-white/[0.06] w-10 h-10" />
                    {data.members.map((m) => (
                      <th key={m.id} className="border-b border-white/[0.06] p-0">
                        <div className="group/hdr relative flex items-center justify-center w-10 h-10">
                          <Avatar handle={m.x_handle} size={22} />
                          <div className="pointer-events-none absolute top-full mt-1 left-1/2 -translate-x-1/2 opacity-0 group-hover/hdr:opacity-100 transition-opacity bg-[#0B1120] border border-white/[0.1] rounded-md px-2 py-1 whitespace-nowrap z-20 shadow-xl">
                            <span className="text-[10px] text-white/70 font-medium">@{m.x_handle}</span>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.members.map((row, rowIdx) => {
                    const stat = data.stats.find((s) => s.handle === row.x_handle);
                    return (
                      <tr key={row.id} className={rowIdx % 2 === 0 ? "" : "bg-white/[0.015]"}>
                        <td className="sticky left-0 z-10 bg-[#0a1225] border-r border-white/[0.06] p-0">
                          <div className={`group/row relative flex items-center justify-center w-10 h-10 ${rowIdx % 2 !== 0 ? "bg-white/[0.015]" : ""}`}>
                            <Avatar handle={row.x_handle} size={22} />
                            <div className="pointer-events-none absolute left-12 top-1/2 -translate-y-1/2 opacity-0 group-hover/row:opacity-100 transition-opacity bg-[#0B1120] border border-white/[0.1] rounded-lg px-3 py-2 whitespace-nowrap z-20 shadow-xl">
                              <p className="text-[11px] text-white/80 font-semibold">@{row.x_handle}</p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <div className="w-10 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full"
                                    style={{
                                      width: `${stat?.pct ?? 0}%`,
                                      background: (stat?.pct ?? 0) === 100 ? "#22c55e" : (stat?.pct ?? 0) >= 70 ? "#C8A951" : "#ef4444",
                                    }}
                                  />
                                </div>
                                <span className="text-[9px] text-white/30 tabular-nums">{stat?.pct ?? 0}%</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        {data.members.map((col) => {
                          if (row.id === col.id) {
                            return (
                              <td key={col.id} className="p-0">
                                <div className="w-10 h-10 flex items-center justify-center">
                                  <div className="w-2 h-2 rounded-full bg-white/[0.04]" />
                                </div>
                              </td>
                            );
                          }
                          const follows = data.matrix[row.id]?.has(col.x_handle);
                          return (
                            <td key={col.id} className="p-0">
                              <div className={`w-10 h-10 flex items-center justify-center transition-colors ${
                                follows ? "hover:bg-emerald-500/10" : "hover:bg-red-500/10"
                              }`}>
                                <div className={`w-2.5 h-2.5 rounded-full ${
                                  follows ? "bg-emerald-400/70" : "bg-red-400/30"
                                }`} />
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
