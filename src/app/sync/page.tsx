"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUp, ExternalLink, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";
import GuildNav from "@/components/guild-nav";

export default function SyncPage() {
  const [bookmarkletUrl, setBookmarkletUrl] = useState("");
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [xHandle, setXHandle] = useState("");
  const [showSetup, setShowSetup] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const bookmarkletRef = useRef<HTMLDivElement>(null);

  const hasSyncedBefore = !!lastSync;

  useEffect(() => {
    fetch("/api/sync-info")
      .then((r) => r.json())
      .then((data) => {
        setBookmarkletUrl(data.bookmarkletUrl || "");
        setLastSync(data.lastSync);
        setXHandle(data.xHandle || "");
      })
      .finally(() => setLoading(false));
  }, []);

  // Inject bookmarklet link via raw DOM to bypass React's javascript: URL blocking
  useEffect(() => {
    if (!bookmarkletUrl || !bookmarkletRef.current) return;
    const container = bookmarkletRef.current;
    container.innerHTML = "";
    const a = document.createElement("a");
    a.href = bookmarkletUrl;
    a.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:8px"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>Sync X Guild';
    a.className =
      "inline-flex items-center gap-2 px-8 py-4 bg-[#C8A951] text-[#0B1120] rounded-xl text-lg font-semibold hover:bg-[#dbbf6a] transition-colors cursor-grab active:cursor-grabbing select-none";
    a.title = "Drag me to your bookmarks bar!";
    a.addEventListener("click", (e) => {
      e.preventDefault();
    });
    container.appendChild(a);
  }, [bookmarkletUrl, showSetup]);

  function handleCopyUrl() {
    navigator.clipboard.writeText(bookmarkletUrl).then(() => {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 3000);
    });
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
          Sync
        </p>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Sync Your Following List</h1>
        <p className="text-white/40 mb-8">
          {hasSyncedBefore
            ? "Re-sync after following new people to keep your data up to date."
            : "Set up the sync bookmark once, then use it anytime."}
        </p>

        {/* Last sync status */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 mb-8 flex items-center justify-between">
          <div>
            <div className="text-xs text-white/25 uppercase tracking-[0.12em]">Last synced</div>
            <div className="text-lg font-semibold mt-1 text-white/80">
              {lastSync ? new Date(lastSync).toLocaleString() : "Never synced"}
            </div>
          </div>
          {hasSyncedBefore && (
            <a
              href={`https://x.com/${xHandle}/following`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white/[0.05] border border-white/[0.08] rounded-lg text-sm text-white/50 hover:text-white/80 hover:bg-white/[0.08] transition-all"
            >
              Open X Following <ExternalLink className="inline w-3.5 h-3.5 ml-1" />
            </a>
          )}
        </div>

        {/* Returning user: simple instructions */}
        {hasSyncedBefore && !showSetup && (
          <div className="space-y-6">
            <div className="border border-white/[0.06] bg-white/[0.03] rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 text-white/90">How to re-sync</h2>
              <ol className="space-y-3 text-white/50">
                <li className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 bg-[#C8A951]/10 text-[#C8A951] rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <span>
                    Go to{" "}
                    <a
                      href={`https://x.com/${xHandle}/following`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#C8A951]/70 hover:text-[#C8A951] transition-colors"
                    >
                      x.com/{xHandle}/following
                    </a>
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 bg-[#C8A951]/10 text-[#C8A951] rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <span>Click the <strong className="text-white/70">&quot;Sync X Guild&quot;</strong> bookmark in your bookmarks bar</span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 bg-[#C8A951]/10 text-[#C8A951] rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <span>Wait for it to scroll and collect — you&apos;ll be redirected back automatically</span>
                </li>
              </ol>
            </div>

            <button
              onClick={() => setShowSetup(true)}
              className="text-sm text-white/25 hover:text-white/50 transition-colors"
            >
              Lost the bookmark? Set it up again <ChevronDown className="inline w-4 h-4 ml-0.5" />
            </button>
          </div>
        )}

        {/* First-time setup or re-setup */}
        {(!hasSyncedBefore || showSetup) && (
          <div className="space-y-6">
            {showSetup && (
              <button
                onClick={() => setShowSetup(false)}
                className="text-sm text-white/25 hover:text-white/50 transition-colors"
              >
                <ChevronUp className="inline w-4 h-4 mr-0.5" /> Back to sync instructions
              </button>
            )}

            {/* Step 1: Add bookmark via drag */}
            <div className="border border-[#C8A951]/20 bg-white/[0.03] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#C8A951]/80">One-time setup</span>
              </div>
              <h2 className="text-lg font-semibold mb-2 text-white/90">Add the sync bookmark</h2>
              <p className="text-white/35 text-sm mb-5">
                Drag the button below to your <strong className="text-white/60">bookmarks bar</strong>.
              </p>

              {/* Drag target with animated arrow */}
              <div className="relative flex flex-col items-center py-4">
                <div className="mb-3 animate-bounce text-white/20">
                  <ArrowUp className="w-6 h-6" />
                </div>
                <p className="text-xs text-white/20 mb-3">Drag this up to your bookmarks bar</p>
                <div ref={bookmarkletRef} />
              </div>

              {/* Can't drag? Fallback */}
              <details className="mt-5 text-sm">
                <summary className="text-white/25 cursor-pointer hover:text-white/50 transition-colors">
                  Can&apos;t drag? Create the bookmark manually
                </summary>
                <div className="mt-3 space-y-3 text-white/35">
                  <div>
                    <p className="mb-2">1. Copy the bookmark code:</p>
                    <button
                      onClick={handleCopyUrl}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        copiedUrl
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                          : "bg-white/[0.05] border border-white/[0.08] text-white/60 hover:bg-white/[0.08]"
                      }`}
                    >
                      {copiedUrl ? <><Check className="inline w-4 h-4 mr-1" />Copied!</> : <><Copy className="inline w-4 h-4 mr-1" />Copy Bookmark Code</>}
                    </button>
                  </div>
                  <p>2. Open your browser&apos;s bookmark manager:</p>
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 space-y-1 text-xs">
                    <p><strong className="text-white/50">Chrome:</strong> Ctrl+Shift+O (or Cmd+Shift+O on Mac)</p>
                    <p><strong className="text-white/50">Firefox:</strong> Ctrl+Shift+O (or Cmd+Shift+O on Mac)</p>
                    <p><strong className="text-white/50">Safari:</strong> Bookmarks &rarr; Edit Bookmarks</p>
                    <p><strong className="text-white/50">Edge:</strong> Ctrl+Shift+O</p>
                  </div>
                  <p>3. Add a new bookmark, name it <strong className="text-white/50">&quot;Sync X Guild&quot;</strong>, and paste the code as the URL.</p>
                </div>
              </details>
            </div>

            {/* Step 2: Use it */}
            <div className="border border-white/[0.06] bg-white/[0.03] rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 text-white/90">Then sync anytime</h2>
              <ol className="space-y-3 text-white/50">
                <li className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 bg-[#C8A951]/10 text-[#C8A951] rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <span>
                    Go to{" "}
                    <a
                      href={`https://x.com/${xHandle}/following`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#C8A951]/70 hover:text-[#C8A951] transition-colors"
                    >
                      x.com/{xHandle}/following
                    </a>
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 bg-[#C8A951]/10 text-[#C8A951] rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <span>Click the <strong className="text-white/70">&quot;Sync X Guild&quot;</strong> bookmark</span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 bg-[#C8A951]/10 text-[#C8A951] rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <span>Wait — you&apos;ll be redirected back here when done</span>
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* Alternative */}
        <div className="mt-8 pt-8 border-t border-white/[0.06]">
          <Link
            href="/sync/manual"
            className="text-sm text-white/20 hover:text-white/50 transition-colors"
          >
            Prefer to sync manually? &rarr;
          </Link>
        </div>
      </main>
    </div>
  );
}
