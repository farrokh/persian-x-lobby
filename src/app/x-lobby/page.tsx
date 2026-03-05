import Link from "next/link";

export default function XLobbyHome() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#070d1b]">
      {/* Subtle noise texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
      }} />

      <div className="relative z-10 max-w-2xl text-center">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2.5 bg-white/[0.05] border border-white/[0.06] rounded-full px-4 py-1.5 text-sm text-white/40 mb-6">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Community of 100+ Persian tech people
          </div>

          <div className="mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C8A951] to-[#8B6914] flex items-center justify-center mx-auto">
              <span className="text-white text-xl">&#10022;</span>
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white tracking-tight">
            X Guild
          </h1>
          <p className="mt-4 text-lg text-white/40 leading-relaxed">
            We support each other on X. Join the guild, sync your following list,
            and make sure every member is connected.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/join"
            className="px-8 py-3 bg-[#C8A951] text-[#0B1120] font-semibold rounded-xl hover:bg-[#dbbf6a] transition-colors"
          >
            Join the Guild
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 bg-white/[0.05] text-white/70 font-semibold rounded-xl border border-white/[0.08] hover:bg-white/[0.08] hover:text-white transition-all"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 text-center">
          {[
            { step: "1", text: "Join with an invite code" },
            { step: "2", text: "Sync your following list" },
            { step: "3", text: "Follow missing members" },
          ].map((item) => (
            <div key={item.step}>
              <div className="w-8 h-8 rounded-full bg-[#C8A951]/10 text-[#C8A951] flex items-center justify-center text-sm font-bold mx-auto">
                {item.step}
              </div>
              <p className="mt-3 text-sm text-white/25">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <Link href="/" className="text-sm text-white/15 hover:text-white/40 transition-colors">
            &larr; Lion and Sun Public Affairs Guild
          </Link>
        </div>
      </div>
    </div>
  );
}
