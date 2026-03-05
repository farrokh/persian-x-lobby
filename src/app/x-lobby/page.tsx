import Link from "next/link";
import { Users, Zap, Network, ArrowRight, Shield, Eye } from "lucide-react";
import RequestAccessForm from "@/components/request-access-form";

const SHOWCASE_HANDLES = [
  "kiafarrokh", "frkia", "jeffshomali", "ashkaandaneshi",
  "kiafarrokh", "frkia", "jeffshomali", "ashkaandaneshi",
  "kiafarrokh", "frkia", "jeffshomali", "ashkaandaneshi",
];

export default function XLobbyHome() {
  return (
    <div className="min-h-screen bg-[#070d1b] text-white overflow-hidden">
      {/* Noise texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />

      {/* Radial glow behind hero */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#C8A951]/[0.04] rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed top-1/3 right-0 w-[400px] h-[400px] bg-[#C8A951]/[0.02] rounded-full blur-[120px] pointer-events-none" />

      {/* ─── Nav ─── */}
      <nav className="relative z-20 max-w-6xl mx-auto flex items-center justify-between px-6 py-6 animate-[fadeDown_0.8s_ease-out]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C8A951] to-[#8B6914] flex items-center justify-center">
            <span className="text-white text-sm">&#10022;</span>
          </div>
          <span className="text-sm font-bold tracking-[0.15em] uppercase text-white/90">
            X Guild
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="text-sm text-white/30 hover:text-white/70 transition-colors px-4 py-2"
          >
            Sign In
          </Link>
          <Link
            href="/join"
            className="text-sm font-semibold bg-[#C8A951] text-[#0B1120] px-5 py-2 rounded-lg hover:bg-[#dbbf6a] transition-colors"
          >
            Join
          </Link>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div className="animate-[fadeUp_0.9s_ease-out]">
            <div className="inline-flex items-center gap-2 bg-[#C8A951]/[0.08] border border-[#C8A951]/15 rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 bg-[#C8A951] rounded-full animate-pulse" />
              <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#C8A951]/80">
                Invite Only
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
              <span className="block text-white">The Guild</span>
              <span className="block bg-gradient-to-r from-[#C8A951] via-[#E8D48B] to-[#C8A951] bg-clip-text text-transparent">
                That Follows
              </span>
              <span className="block text-white">Together</span>
            </h1>

            <p className="text-lg text-white/35 leading-relaxed max-w-lg mb-10">
              An exclusive network of influential Iranians on X. We sync our following lists,
              amplify each other&apos;s voices, and build the strongest diaspora network on the platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#request"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#C8A951] to-[#B8993D] text-[#0B1120] font-bold rounded-xl hover:from-[#dbbf6a] hover:to-[#C8A951] transition-all text-base shadow-lg shadow-[#C8A951]/10"
              >
                Request Access
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/[0.04] text-white/60 font-semibold rounded-xl border border-white/[0.08] hover:bg-white/[0.08] hover:text-white/90 hover:border-white/[0.15] transition-all text-base"
              >
                I&apos;m a Member
              </Link>
            </div>
          </div>

          {/* Right: Avatar constellation */}
          <div className="relative h-[420px] hidden lg:block animate-[fadeUp_1.1s_ease-out]">
            {/* Central emblem */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-2xl bg-gradient-to-br from-[#C8A951]/20 to-[#C8A951]/5 border border-[#C8A951]/20 flex items-center justify-center z-10 shadow-2xl shadow-[#C8A951]/10">
              <span className="text-[#C8A951] text-3xl">&#10022;</span>
            </div>

            {/* Orbiting lines */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-[#C8A951]/[0.06] animate-[spin_60s_linear_infinite]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-white/[0.04] animate-[spin_45s_linear_infinite_reverse]" />

            {/* Floating avatars */}
            {SHOWCASE_HANDLES.map((handle, i) => {
              const angle = (i / SHOWCASE_HANDLES.length) * 360;
              const radius = i % 3 === 0 ? 170 : i % 3 === 1 ? 130 : 90;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;
              const size = i % 3 === 0 ? 44 : i % 3 === 1 ? 36 : 30;
              const delay = i * 0.15;

              return (
                <div
                  key={`${handle}-${i}`}
                  className="absolute top-1/2 left-1/2 animate-[fadeScale_0.6s_ease-out_both]"
                  style={{
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    animationDelay: `${delay + 0.5}s`,
                  }}
                >
                  <div className="relative group">
                    <div
                      className="rounded-full overflow-hidden border-2 border-[#C8A951]/20 hover:border-[#C8A951]/60 transition-all duration-300 hover:scale-110 shadow-lg shadow-black/30"
                      style={{ width: size, height: size }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://unavatar.io/x/${handle}`}
                        alt=""
                        width={size}
                        height={size}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    {/* Connection lines (decorative dots) */}
                    {i % 2 === 0 && (
                      <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-[#C8A951]/20 rounded-full" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </section>

      {/* ─── How It Works ─── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-10 animate-[fadeUp_0.6s_ease-out]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C8A951]/60 mb-3">
            How It Works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Three Steps to Full Sync
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              icon: Shield,
              title: "Get Invited",
              desc: "Receive an invite code from an existing member. Enter your X handle and email to join the guild.",
              accent: "from-[#C8A951]/20 to-[#C8A951]/5",
              border: "border-[#C8A951]/10 hover:border-[#C8A951]/25",
            },
            {
              step: "02",
              icon: Zap,
              title: "Sync Your List",
              desc: "Use our bookmarklet on your X following page. It auto-scrolls and captures your entire follow list in seconds.",
              accent: "from-blue-500/10 to-blue-500/5",
              border: "border-blue-500/10 hover:border-blue-500/20",
            },
            {
              step: "03",
              icon: Eye,
              title: "Close the Gaps",
              desc: "Your dashboard shows exactly who you need to follow. One click opens their X profile. Stay 100% connected.",
              accent: "from-emerald-500/10 to-emerald-500/5",
              border: "border-emerald-500/10 hover:border-emerald-500/20",
            },
          ].map((item, i) => (
            <div
              key={item.step}
              className={`relative overflow-hidden bg-gradient-to-b ${item.accent} border ${item.border} rounded-2xl p-8 transition-all duration-300 group animate-[fadeUp_0.6s_ease-out_both]`}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full -translate-y-16 translate-x-16" />
              <span className="text-6xl font-black text-white/[0.03] absolute top-4 right-6">
                {item.step}
              </span>
              <item.icon className="w-6 h-6 text-white/30 mb-5 group-hover:text-white/50 transition-colors" />
              <h3 className="text-lg font-bold text-white/90 mb-2">{item.title}</h3>
              <p className="text-sm text-white/30 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 hover:border-white/[0.1] transition-all">
            <Users className="w-6 h-6 text-[#C8A951]/50 mb-4" />
            <h3 className="text-xl font-bold mb-2">Follow Matrix</h3>
            <p className="text-sm text-white/30 leading-relaxed">
              A real-time grid showing who follows whom. Track completion rates,
              find gaps, and see the full network topology at a glance.
            </p>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 hover:border-white/[0.1] transition-all">
            <Network className="w-6 h-6 text-[#C8A951]/50 mb-4" />
            <h3 className="text-xl font-bold mb-2">Hot Posts</h3>
            <p className="text-sm text-white/30 leading-relaxed">
              Curated posts from guild members that need engagement. Like, retweet,
              and amplify the voices that matter to our community.
            </p>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section id="request" className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#C8A951]/10 via-[#C8A951]/5 to-transparent border border-[#C8A951]/15 rounded-3xl p-12 sm:p-16">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8A951]/[0.05] rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C8A951]/[0.03] rounded-full blur-[60px]" />

          <div className="relative z-10">
            <div className="text-center mb-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C8A951] to-[#8B6914] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#C8A951]/20">
                <span className="text-white text-2xl">&#10022;</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
                Request Access
              </h2>
              <p className="text-white/30 max-w-md mx-auto">
                Submit your request and we&apos;ll send you an invite code once approved.
              </p>
            </div>
            <RequestAccessForm />
            <p className="text-center mt-6 text-sm text-white/20">
              Already have an invite?{" "}
              <Link href="/join" className="text-[#C8A951]/60 hover:text-[#C8A951] transition-colors">
                Join directly
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="relative z-10 max-w-6xl mx-auto px-6 py-10 border-t border-white/[0.04]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#C8A951] to-[#8B6914] flex items-center justify-center">
              <span className="text-white text-[10px]">&#10022;</span>
            </div>
            <span className="text-xs text-white/20 tracking-[0.1em] uppercase">X Guild</span>
          </div>
          <Link href="/" className="text-xs text-white/15 hover:text-white/40 transition-colors">
            Lion and Sun Public Affairs Guild
          </Link>
        </div>
      </footer>

      {/* Keyframe animations */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeScale {
          from { opacity: 0; scale: 0; }
          to { opacity: 1; scale: 1; }
        }
      `}</style>
    </div>
  );
}
