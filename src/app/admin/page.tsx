"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import GuildNav from "@/components/guild-nav";
import {
  Flame,
  Plus,
  Trash2,
  ExternalLink,
  Heart,
  Repeat2,
  X,
} from "lucide-react";

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

interface HotPost {
  id: string;
  x_post_url: string;
  author_handle: string;
  content_preview: string;
  likes: number;
  retweets: number;
  created_at: string;
}

export default function AdminPage() {
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [digestResult, setDigestResult] = useState<string | null>(null);
  const [sendingDigest, setSendingDigest] = useState(false);

  // Hot posts state
  const [hotPosts, setHotPosts] = useState<HotPost[]>([]);
  const [showAddPost, setShowAddPost] = useState(false);
  const [postUrl, setPostUrl] = useState("");
  const [addingPost, setAddingPost] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/members").then((r) => r.json()),
      fetch("/api/hot-posts").then((r) => r.json()),
    ])
      .then(([membersData, postsData]) => {
        setMembers(membersData.members || []);
        setHotPosts(postsData.posts || []);
      })
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

  async function addHotPost(e: React.FormEvent) {
    e.preventDefault();
    setAddingPost(true);
    setPostError(null);
    try {
      const res = await fetch("/api/hot-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ x_post_url: postUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPostError(data.error || "Failed to add post");
        return;
      }
      setHotPosts((prev) => [data.post, ...prev]);
      setPostUrl("");
      setShowAddPost(false);
    } catch {
      setPostError("Network error.");
    } finally {
      setAddingPost(false);
    }
  }

  async function removeHotPost(id: string) {
    if (!confirm("Remove this hot post?")) return;
    const res = await fetch(`/api/hot-posts?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setHotPosts((prev) => prev.filter((p) => p.id !== id));
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

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">

        {/* ──── Header ──── */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <button
            onClick={triggerDigest}
            disabled={sendingDigest}
            className="px-4 py-2 bg-[#C8A951] text-[#0B1120] rounded-lg text-sm font-semibold hover:bg-[#dbbf6a] transition-colors disabled:opacity-50"
          >
            {sendingDigest ? "Sending..." : "Send Email Digest"}
          </button>
        </div>

        {digestResult && (
          <div className="p-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white/60">
            {digestResult}
          </div>
        )}

        {/* ════════════════════ HOT POSTS MANAGEMENT ════════════════════ */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/10 flex items-center justify-center">
                <Flame className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Hot Posts</h2>
                <p className="text-[11px] text-white/25 uppercase tracking-[0.12em]">
                  {hotPosts.length} post{hotPosts.length !== 1 ? "s" : ""} shown on member dashboards
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddPost(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] hover:border-[#C8A951]/20 rounded-lg text-sm font-medium transition-all"
            >
              <Plus className="w-4 h-4" /> Add Post
            </button>
          </div>

          {/* Add Post Form */}
          {showAddPost && (
            <form onSubmit={addHotPost} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 mb-6">
              <div className="flex items-center gap-3">
                <input
                  type="url"
                  required
                  autoFocus
                  placeholder="Paste X post link — https://x.com/user/status/..."
                  value={postUrl}
                  onChange={(e) => setPostUrl(e.target.value)}
                  className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-[#C8A951]/30 transition-colors"
                />
                <button
                  type="submit"
                  disabled={addingPost}
                  className="px-5 py-2.5 bg-[#C8A951] text-[#0B1120] rounded-lg text-sm font-semibold hover:bg-[#dbbf6a] transition-colors disabled:opacity-50 shrink-0"
                >
                  {addingPost ? "Adding..." : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAddPost(false); setPostError(null); }}
                  className="text-white/20 hover:text-white/50 transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {postError && (
                <p className="text-sm text-red-400 mt-3">{postError}</p>
              )}
            </form>
          )}

          {/* Hot Posts List */}
          {hotPosts.length === 0 ? (
            <div className="bg-white/[0.02] border border-white/[0.06] border-dashed rounded-2xl py-12 text-center">
              <Flame className="w-8 h-8 text-white/10 mx-auto mb-3" />
              <p className="text-sm text-white/25">No hot posts yet. Add one to show on member dashboards.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {hotPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-start gap-4 bg-white/[0.02] border border-white/[0.06] rounded-xl px-5 py-4 group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm font-semibold text-white/70">@{post.author_handle}</span>
                      <span className="text-[11px] text-white/15">{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-white/40 leading-relaxed line-clamp-2 mb-2">
                      {post.content_preview}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-xs text-white/15">
                        <Heart className="w-3 h-3" /> {post.likes.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-white/15">
                        <Repeat2 className="w-3 h-3" /> {post.retweets.toLocaleString()}
                      </span>
                      <a
                        href={post.x_post_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-white/15 hover:text-white/40 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" /> View on X
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => removeHotPost(post.id)}
                    className="shrink-0 p-2 text-white/10 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    title="Remove post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ════════════════════ MEMBERS TABLE ════════════════════ */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold">Members</h2>
              <p className="text-[11px] text-white/25 uppercase tracking-[0.12em]">{members.length} total</p>
            </div>
          </div>

          <div className="overflow-auto rounded-xl border border-white/[0.06]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-left text-white/25 text-xs uppercase tracking-wider">
                  <th className="p-3.5">Handle</th>
                  <th className="p-3.5">Name</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Joined</th>
                  <th className="p-3.5">Last Sync</th>
                  <th className="p-3.5">Following</th>
                  <th className="p-3.5">Followers</th>
                  <th className="p-3.5"></th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="p-3.5 font-medium text-white/70">@{m.x_handle}</td>
                    <td className="p-3.5 text-white/35">{m.display_name || "-"}</td>
                    <td className="p-3.5 text-white/35">{m.email}</td>
                    <td className="p-3.5 text-white/35">{new Date(m.joined_at).toLocaleDateString()}</td>
                    <td className="p-3.5 text-white/35">
                      {m.lastSync ? new Date(m.lastSync).toLocaleDateString() : "Never"}
                    </td>
                    <td className="p-3.5 tabular-nums">{m.followingCount}</td>
                    <td className="p-3.5 tabular-nums">{m.followersCount}</td>
                    <td className="p-3.5">
                      <button
                        onClick={() => removeMember(m.id, m.x_handle)}
                        className="text-red-400/50 hover:text-red-400 text-xs transition-colors"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
