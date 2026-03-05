"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User } from "lucide-react";

function NavAvatar({ handle, size = 26 }: { handle: string; size?: number }) {
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

interface MemberInfo {
  x_handle: string;
  display_name?: string;
  isAdmin?: boolean;
}

interface GuildNavProps {
  member?: MemberInfo | null;
}

export default function GuildNav({ member: memberProp }: GuildNavProps) {
  const [member, setMember] = useState<MemberInfo | null>(memberProp ?? null);

  // If no member prop provided, fetch it
  useEffect(() => {
    if (memberProp) return;
    fetch("/api/dashboard", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data.member) setMember(data.member);
      })
      .catch(() => {});
  }, [memberProp]);

  return (
    <nav className="relative z-20 border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C8A951] to-[#8B6914] flex items-center justify-center">
              <span className="text-white text-sm">&#10022;</span>
            </div>
            <span className="text-sm font-bold tracking-[0.15em] uppercase text-white/90">
              X Guild
            </span>
          </Link>
          <span className="text-white/15">|</span>
          <Link href="/" className="text-[10px] text-white/25 tracking-[0.2em] uppercase hover:text-[#C8A951]/60 transition-colors">
            LASPAG
          </Link>
        </div>
        <div className="flex items-center gap-1">
          <Link href="/dashboard" className="text-xs text-white/35 hover:text-white/80 transition-colors px-3.5 py-2 rounded-lg hover:bg-white/[0.04]">Dashboard</Link>
          <Link href="/sync" className="text-xs text-white/35 hover:text-white/80 transition-colors px-3.5 py-2 rounded-lg hover:bg-white/[0.04]">Sync</Link>
          <Link href="/matrix" className="text-xs text-white/35 hover:text-white/80 transition-colors px-3.5 py-2 rounded-lg hover:bg-white/[0.04]">Matrix</Link>
          {member?.isAdmin && (
            <Link href="/admin" className="text-xs text-white/35 hover:text-white/80 transition-colors px-3.5 py-2 rounded-lg hover:bg-white/[0.04]">Admin</Link>
          )}
          {member && (
            <div className="ml-3 flex items-center gap-2.5 bg-white/[0.05] border border-white/[0.06] rounded-full pl-1 pr-4 py-1">
              <NavAvatar handle={member.x_handle} />
              <span className="text-xs text-white/50">
                @{member.x_handle}
              </span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
