"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function SyncPage() {
  const [bookmarkletUrl, setBookmarkletUrl] = useState("");
  const [consoleScript, setConsoleScript] = useState("");
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [xHandle, setXHandle] = useState("");
  const [copied, setCopied] = useState(false);
  const bookmarkletRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/sync-info")
      .then((r) => r.json())
      .then((data) => {
        setBookmarkletUrl(data.bookmarkletUrl || "");
        setConsoleScript(data.consoleScript || "");
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
    a.textContent = "Sync X Lobby";
    a.className = "inline-block px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-500 cursor-grab";
    a.addEventListener("click", (e) => e.preventDefault());
    container.appendChild(a);
  }, [bookmarkletUrl]);

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
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="font-bold text-lg">Persian X Lobby</Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link>
            <Link href="/matrix" className="text-gray-400 hover:text-white transition-colors">Matrix</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-2">Sync Your Following List</h1>
        <p className="text-gray-400 mb-8">
          Use the bookmarklet below to automatically collect who you follow on X.
        </p>

        {/* Status */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-8">
          <div className="text-sm text-gray-500">Last synced</div>
          <div className="text-lg font-semibold mt-1">
            {lastSync ? new Date(lastSync).toLocaleString() : "Never synced"}
          </div>
        </div>

        {/* Bookmarklet instructions */}
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Desktop: Bookmarklet (Recommended)</h2>
            <ol className="space-y-4 text-gray-300">
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span>
                  Drag this link to your bookmarks bar:
                  <span ref={bookmarkletRef} className="ml-2 inline" />
                </span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span>
                  Go to{" "}
                  <a
                    href={`https://x.com/${xHandle}/following`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    x.com/{xHandle}/following
                  </a>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <span>Click the &quot;Sync X Lobby&quot; bookmark</span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                <span>Wait for the page to auto-scroll and collect handles</span>
              </li>
            </ol>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Alternative: Paste in Browser Console</h2>
            <p className="text-gray-400 mb-4 text-sm">
              If the bookmarklet doesn&apos;t work, copy this script and paste it into your browser&apos;s
              Developer Console (F12) while on your X following page.
            </p>
            <div className="relative">
              <pre className="bg-black/50 border border-white/10 rounded-lg p-4 text-xs text-gray-400 overflow-x-auto max-h-24 overflow-y-auto">
                {consoleScript}
              </pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(consoleScript);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="absolute top-2 right-2 px-3 py-1 bg-white/10 rounded text-xs hover:bg-white/20 transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-2">Mobile: Manual Sync</h2>
            <p className="text-gray-400 mb-4">
              On mobile or bookmarklet not working? Use manual sync instead.
            </p>
            <Link
              href="/sync/manual"
              className="inline-block px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm hover:bg-white/20 transition-colors"
            >
              Manual Sync
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
