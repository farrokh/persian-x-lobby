"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  RefreshCw,
  ExternalLink,
  Users,
  UserPlus,
  User,
  Heart,
  Repeat2,
  Flame,
  ChevronRight,
  Zap,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import GuildNav from "@/components/guild-nav";

/* ─── Types ─── */

interface MemberCard {
  x_handle: string;
  display_name: string | null;
}

interface HotPost {
  id: string;
  x_post_url: string;
  author_handle: string;
  content_preview: string;
  likes: number;
  retweets: number;
  created_at: string;
}

interface DashboardData {
  member: { x_handle: string; display_name: string; isAdmin: boolean };
  needToFollow: MemberCard[];
  notFollowingYou: MemberCard[];
  lastSync: string | null;
  totalMembers: number;
  followingCount: number;
  hotPosts: HotPost[];
  allMembers: MemberCard[];
}

/* ─── Avatar ─── */

function Avatar({
  handle,
  size = 40,
  className = "",
}: {
  handle: string;
  size?: number;
  className?: string;
}) {
  const [error, setError] = useState(false);
  if (error) {
    return (
      <div
        className={`rounded-full bg-[#1a2540] flex items-center justify-center shrink-0 ${className}`}
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
      className={`rounded-full shrink-0 object-cover bg-[#1a2540] ${className}`}
      loading="lazy"
      onError={() => setError(true)}
    />
  );
}

/* ─── Helpers ─── */

function extractTweetId(url: string): string {
  const match = url.match(/status\/(\d+)/);
  return match ? match[1] : "";
}

/* ─── Main ─── */

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070d1b] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#C8A951]/20 border-t-[#C8A951] rounded-full animate-spin" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [followedHandles, setFollowedHandles] = useState<Set<string>>(new Set());
  const searchParams = useSearchParams();
  const syncedCount = searchParams.get("synced");

  useEffect(() => {
    setLoading(true);
    fetch("/api/dashboard", { cache: "no-store" })
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [syncedCount]);

  function handleFollowClick(handle: string) {
    setFollowedHandles((prev) => new Set(prev).add(handle));
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070d1b] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#C8A951]/20 border-t-[#C8A951] rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#070d1b] flex items-center justify-center">
        <p className="text-white/30 text-sm">Failed to load dashboard.</p>
      </div>
    );
  }

  const completionPct =
    data.totalMembers > 1
      ? Math.round((data.followingCount / (data.totalMembers - 1)) * 100)
      : 100;

  const needsResync = followedHandles.size > 0;

  // Members you're following = all members minus yourself minus needToFollow
  const needToFollowHandles = new Set(data.needToFollow.map((m) => m.x_handle));
  const youFollowMembers = data.allMembers.filter(
    (m) => m.x_handle !== data.member.x_handle && !needToFollowHandles.has(m.x_handle)
  );

  return (
    <div className="min-h-screen bg-[#070d1b] text-white">
      {/* Subtle noise texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
      }} />

      <GuildNav member={data.member} />

      <main className="relative z-10 max-w-7xl mx-auto px-6">

        {/* ════════════════════ HERO SECTION ════════════════════ */}
        <div className="pt-10 pb-12">
          {/* Synced banner */}
          {syncedCount && (
            <div className="mb-6 flex items-center gap-2.5 text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-5 py-3.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              Successfully synced {syncedCount} handles from X
            </div>
          )}

          {/* Resync banner */}
          {needsResync && (
            <div className="mb-6 flex items-center justify-between bg-[#C8A951]/[0.08] border border-[#C8A951]/20 rounded-xl px-5 py-3.5">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-4 h-4 text-[#C8A951] shrink-0" />
                <p className="text-sm text-white/70">
                  You opened <span className="font-semibold text-[#C8A951]">{followedHandles.size}</span> profile{followedHandles.size > 1 ? "s" : ""} — re-sync to update
                </p>
              </div>
              <Link
                href="/sync"
                className="text-xs font-semibold text-[#C8A951] hover:text-[#dbbf6a] transition-colors flex items-center gap-1"
              >
                Re-sync <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Hero grid: greeting + stats */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Welcome + Progress */}
            <div className="lg:col-span-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C8A951]/80 mb-3">
                Member Dashboard
              </p>
              <h1 className="text-4xl font-bold tracking-tight mb-2 leading-[1.1]">
                <span className="text-white/90">Welcome,</span>
                <br />
                <span className="bg-gradient-to-r from-[#C8A951] via-[#E8D48B] to-[#C8A951] bg-clip-text text-transparent">
                  {data.member.display_name || data.member.x_handle}
                </span>
              </h1>
              {/* Network progress */}
              <div className="mt-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-white/30 uppercase tracking-[0.15em] font-medium">Network Coverage</span>
                  <span className="text-2xl font-bold tabular-nums bg-gradient-to-r from-[#C8A951] to-[#E8D48B] bg-clip-text text-transparent">
                    {completionPct}%
                  </span>
                </div>
                <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${completionPct}%`,
                      background: completionPct === 100
                        ? "linear-gradient(90deg, #22c55e, #4ade80)"
                        : "linear-gradient(90deg, #8B6914, #C8A951, #E8D48B)",
                    }}
                  />
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-white/25">
                    Following {data.followingCount} of {data.totalMembers - 1} members
                  </span>
                  <Link
                    href="/sync"
                    className="text-xs text-[#C8A951]/60 hover:text-[#C8A951] transition-colors flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Sync
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: Stats with member avatars */}
            <div className="lg:col-span-7 grid grid-cols-3 gap-4">
              {/* Card: Guild Members */}
              <div className="relative overflow-hidden bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] rounded-2xl p-5 group hover:border-[#C8A951]/20 transition-colors">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#C8A951]/[0.03] rounded-full -translate-y-8 translate-x-8" />
                <div className="flex items-center justify-between mb-3">
                  <Users className="w-5 h-5 text-[#C8A951]/40" />
                  <Link href="/matrix" className="text-[10px] text-white/15 hover:text-[#C8A951]/60 transition-colors">
                    View all <ArrowUpRight className="w-3 h-3 inline" />
                  </Link>
                </div>
                <p className="text-3xl font-bold tabular-nums text-white/90">{data.totalMembers}</p>
                <p className="text-[11px] text-white/25 uppercase tracking-[0.12em] mt-1 mb-4">Guild Members</p>
                <div className="flex flex-wrap gap-1.5">
                  {data.allMembers.slice(0, 8).map((m) => (
                    <a key={m.x_handle} href={`https://x.com/${m.x_handle}`} target="_blank" rel="noopener noreferrer" title={m.display_name || `@${m.x_handle}`}>
                      <Avatar handle={m.x_handle} size={28} className="hover:ring-1 hover:ring-[#C8A951]/40 hover:ring-offset-1 hover:ring-offset-[#070d1b] transition-all" />
                    </a>
                  ))}
                  {data.totalMembers > 8 && (
                    <div className="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center">
                      <span className="text-[9px] text-white/25 font-medium">+{data.totalMembers - 8}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card: You Follow */}
              <div className="relative overflow-hidden bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] rounded-2xl p-5 group hover:border-[#C8A951]/20 transition-colors">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#C8A951]/[0.03] rounded-full -translate-y-8 translate-x-8" />
                <Zap className="w-5 h-5 text-[#C8A951]/40 mb-3" />
                <p className="text-3xl font-bold tabular-nums text-white/90">
                  {data.followingCount}
                  <span className="text-lg text-white/20 font-normal">/{data.totalMembers - 1}</span>
                </p>
                <p className="text-[11px] text-white/25 uppercase tracking-[0.12em] mt-1 mb-4">You Follow</p>
                <div className="flex flex-wrap gap-1.5">
                  {youFollowMembers.slice(0, 8).map((m) => (
                    <a key={m.x_handle} href={`https://x.com/${m.x_handle}`} target="_blank" rel="noopener noreferrer" title={m.display_name || `@${m.x_handle}`}>
                      <Avatar handle={m.x_handle} size={28} className="hover:ring-1 hover:ring-[#C8A951]/40 hover:ring-offset-1 hover:ring-offset-[#070d1b] transition-all" />
                    </a>
                  ))}
                  {youFollowMembers.length > 8 && (
                    <div className="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center">
                      <span className="text-[9px] text-white/25 font-medium">+{youFollowMembers.length - 8}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card: Need to Follow */}
              <div className="relative overflow-hidden bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] rounded-2xl p-5 group hover:border-[#C8A951]/20 transition-colors">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#C8A951]/[0.03] rounded-full -translate-y-8 translate-x-8" />
                <UserPlus className="w-5 h-5 text-[#C8A951]/40 mb-3" />
                <p className={`text-3xl font-bold tabular-nums ${data.needToFollow.length > 0 ? "text-[#C8A951]" : "text-emerald-400"}`}>
                  {data.needToFollow.length}
                </p>
                <p className="text-[11px] text-white/25 uppercase tracking-[0.12em] mt-1 mb-4">Need to Follow</p>
                <div className="flex flex-wrap gap-1.5">
                  {data.needToFollow.slice(0, 8).map((m) => (
                    <a key={m.x_handle} href={`https://x.com/${m.x_handle}`} target="_blank" rel="noopener noreferrer" title={m.display_name || `@${m.x_handle}`}>
                      <Avatar handle={m.x_handle} size={28} className="hover:ring-1 hover:ring-[#C8A951]/40 hover:ring-offset-1 hover:ring-offset-[#070d1b] transition-all" />
                    </a>
                  ))}
                  {data.needToFollow.length > 8 && (
                    <div className="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center">
                      <span className="text-[9px] text-white/25 font-medium">+{data.needToFollow.length - 8}</span>
                    </div>
                  )}
                  {data.needToFollow.length === 0 && (
                    <p className="text-[11px] text-emerald-400/40">All caught up</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════ MAIN CONTENT ════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16">

          {/* ──── Left Column: Hot Posts + Actions ──── */}
          <div className="lg:col-span-7 space-y-8">

            {/* HOT POSTS — Engagement-focused */}
            {data.hotPosts.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/10 flex items-center justify-center">
                    <Flame className="w-4 h-4 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white/90">Boost These Posts</h2>
                    <p className="text-[10px] text-white/25 uppercase tracking-[0.15em]">Like &amp; retweet to support guild members</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {data.hotPosts.map((post) => (
                    <div
                      key={post.id}
                      className="group relative bg-white/[0.03] border border-white/[0.06] hover:border-[#C8A951]/15 rounded-2xl p-5 transition-all duration-200"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <Avatar handle={post.author_handle} size={40} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-white/80 truncate">
                            @{post.author_handle}
                          </p>
                          <p className="text-[11px] text-white/20">
                            {new Date(post.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-[13px] text-white/50 leading-relaxed line-clamp-3 mb-5">
                        {post.content_preview}
                      </p>

                      {/* Engagement stats + action buttons */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          <span className="flex items-center gap-1.5 text-xs text-white/20">
                            <Heart className="w-3.5 h-3.5" />
                            {post.likes.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-white/20">
                            <Repeat2 className="w-3.5 h-3.5" />
                            {post.retweets.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://x.com/intent/like?tweet_id=${extractTweetId(post.x_post_url)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-pink-300/70 hover:text-pink-300 bg-pink-500/[0.08] hover:bg-pink-500/15 border border-pink-500/10 hover:border-pink-500/25 rounded-lg transition-all"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Heart className="w-3.5 h-3.5" /> Like
                          </a>
                          <a
                            href={`https://x.com/intent/retweet?tweet_id=${extractTweetId(post.x_post_url)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-300/70 hover:text-emerald-300 bg-emerald-500/[0.08] hover:bg-emerald-500/15 border border-emerald-500/10 hover:border-emerald-500/25 rounded-lg transition-all"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Repeat2 className="w-3.5 h-3.5" /> Retweet
                          </a>
                          <a
                            href={post.x_post_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/30 hover:text-white/60 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/10 rounded-lg transition-all"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Open
                          </a>
                        </div>
                      </div>

                      {/* Bottom gold accent on hover */}
                      <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-[#C8A951]/0 group-hover:via-[#C8A951]/30 to-transparent transition-all duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NOT FOLLOWING YOU */}
            {data.notFollowingYou.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-base font-bold text-white/90">Haven&apos;t Followed You</h2>
                    <span className="text-xs font-medium tabular-nums text-white/20 bg-white/[0.05] px-2 py-0.5 rounded-md">
                      {data.notFollowingYou.length}
                    </span>
                  </div>
                </div>
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden divide-y divide-white/[0.04]">
                  {data.notFollowingYou.map((m) => (
                    <div
                      key={m.x_handle}
                      className="flex items-center gap-3 px-5 py-3.5"
                    >
                      <Avatar handle={m.x_handle} size={32} />
                      <div className="min-w-0 flex-1">
                        {m.display_name && (
                          <p className="text-sm font-medium text-white/50 truncate leading-tight">
                            {m.display_name}
                          </p>
                        )}
                        <p className={`text-xs truncate ${m.display_name ? "text-white/20" : "text-sm text-white/35"}`}>
                          @{m.x_handle}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ──── Right Column: Need to Follow + Profile ──── */}
          <div className="lg:col-span-5 space-y-8">

            {/* NEED TO FOLLOW */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-base font-bold text-white/90">You Need to Follow</h2>
                  <span className={`text-xs font-semibold tabular-nums px-2 py-0.5 rounded-md ${
                    data.needToFollow.length === 0
                      ? "text-emerald-400 bg-emerald-500/10"
                      : "text-[#C8A951] bg-[#C8A951]/10"
                  }`}>
                    {data.needToFollow.length}
                  </span>
                </div>
              </div>

              {data.needToFollow.length === 0 ? (
                <div className="bg-emerald-500/[0.06] border border-emerald-500/15 rounded-2xl py-8 text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400/50 mx-auto mb-2" />
                  <p className="text-sm text-emerald-300/60">You&apos;re following all guild members</p>
                </div>
              ) : (
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden divide-y divide-white/[0.04]">
                  {data.needToFollow.map((m) => {
                    const wasFollowed = followedHandles.has(m.x_handle);
                    return (
                      <a
                        key={m.x_handle}
                        href={`https://x.com/${m.x_handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleFollowClick(m.x_handle)}
                        className={`flex items-center gap-3 px-5 py-3.5 transition-all group ${
                          wasFollowed
                            ? "bg-emerald-500/[0.04]"
                            : "hover:bg-white/[0.03]"
                        }`}
                      >
                        <Avatar handle={m.x_handle} size={36} />
                        <div className="flex-1 min-w-0">
                          {m.display_name && (
                            <p className="text-sm font-medium text-white/70 truncate leading-tight">
                              {m.display_name}
                            </p>
                          )}
                          <p className={`text-xs truncate ${m.display_name ? "text-white/25" : "text-sm text-white/45"}`}>
                            @{m.x_handle}
                          </p>
                        </div>
                        {wasFollowed ? (
                          <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Opened
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-white/0 group-hover:text-[#C8A951] transition-colors font-medium">
                            Follow <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
