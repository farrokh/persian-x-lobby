"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface MatrixData {
  members: { id: string; x_handle: string }[];
  matrix: Record<string, Set<string>>;
  stats: { handle: string; following: number; followers: number; pct: number }[];
}

export default function MatrixPage() {
  const [data, setData] = useState<MatrixData | null>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-gray-400">Loading matrix...</div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="border-b border-white/10 px-6 py-4">
        <div className="max-w-[95vw] mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="font-bold text-lg">Persian X Lobby</Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link>
            <Link href="/sync" className="text-gray-400 hover:text-white transition-colors">Sync</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-[95vw] mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-2">Follow Matrix</h1>
        <p className="text-gray-400 mb-8">
          Rows = who the member follows. Green = follows, Red = doesn&apos;t follow.
        </p>

        {/* Stats summary */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {data.stats.length > 0 && (
            <>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-sm text-gray-500">Average completion</div>
                <div className="text-2xl font-bold mt-1">
                  {Math.round(data.stats.reduce((a, s) => a + s.pct, 0) / data.stats.length)}%
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-sm text-gray-500">Most connected</div>
                <div className="text-lg font-bold mt-1">
                  @{data.stats.sort((a, b) => b.pct - a.pct)[0]?.handle}
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-sm text-gray-500">Least connected</div>
                <div className="text-lg font-bold mt-1">
                  @{data.stats.sort((a, b) => a.pct - b.pct)[0]?.handle}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Matrix table */}
        <div className="overflow-auto rounded-xl border border-white/10">
          <table className="text-xs">
            <thead>
              <tr>
                <th className="sticky left-0 bg-[#0a0a0a] z-10 p-2 text-left text-gray-500 border-b border-r border-white/10">
                  Follower \ Following
                </th>
                {data.members.map((m) => (
                  <th
                    key={m.id}
                    className="p-2 text-gray-500 border-b border-white/10 whitespace-nowrap"
                    style={{ writingMode: "vertical-rl" }}
                  >
                    @{m.x_handle}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.members.map((row) => (
                <tr key={row.id}>
                  <td className="sticky left-0 bg-[#0a0a0a] z-10 p-2 font-medium text-gray-300 border-r border-white/10 whitespace-nowrap">
                    @{row.x_handle}
                  </td>
                  {data.members.map((col) => {
                    if (row.id === col.id) {
                      return (
                        <td key={col.id} className="p-2 text-center bg-white/5">
                          <span className="text-gray-600">-</span>
                        </td>
                      );
                    }
                    const follows = data.matrix[row.id]?.has(col.x_handle);
                    return (
                      <td
                        key={col.id}
                        className={`p-2 text-center ${follows ? "bg-emerald-500/20" : "bg-red-500/20"}`}
                      >
                        {follows ? (
                          <span className="text-emerald-400">&#10003;</span>
                        ) : (
                          <span className="text-red-400">&#10007;</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
