import Link from "next/link";

const initiatives = [
  {
    title: "X Guild",
    farsi: "گیلد ایکس",
    description:
      "A mutual-support network for Persian tech professionals on X. Members sync their following lists and ensure the community stays connected.",
    href: "/x-lobby",
    status: "Active",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    title: "Policy & Advocacy",
    farsi: "سیاست‌گذاری و حمایت",
    description:
      "Strategic engagement with policymakers, think tanks, and media to advance transparent democratic governance for Iran.",
    href: "#",
    status: "Coming Soon",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
      </svg>
    ),
  },
  {
    title: "Iran Prosperity Project",
    farsi: "پروژه آبادانی ایران",
    description:
      "Economic development frameworks and emergency-phase planning aligned with NUFDI for a post-transition Iran.",
    href: "#",
    status: "Coming Soon",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
      </svg>
    ),
  },
  {
    title: "Community & Culture",
    farsi: "جامعه و فرهنگ",
    description:
      "Cultural preservation initiatives, diaspora networking events, and educational programs connecting Iranians worldwide.",
    href: "#",
    status: "Coming Soon",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
  },
];

const regions = [
  "Washington, D.C.",
  "Silicon Valley",
  "Beverly Hills",
  "New York City",
  "Houston",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B1120] text-[#E8E0D0] selection:bg-[#C8A951]/30">
      {/* Decorative background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C8A951' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Top gradient wash */}
      <div className="fixed top-0 left-0 right-0 h-[600px] pointer-events-none bg-gradient-to-b from-[#0D1B3A]/80 via-[#0B1120]/40 to-transparent" />

      {/* Header */}
      <header className="relative z-10 border-b border-[#C8A951]/10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[#C8A951] text-xl">&#10022;</span>
            <span className="font-semibold tracking-wide text-sm uppercase text-[#C8A951]/80">
              LASPAG
            </span>
          </div>
          <nav className="hidden sm:flex items-center gap-8 text-sm text-[#E8E0D0]/50">
            <a href="#initiatives" className="hover:text-[#C8A951] transition-colors">
              Initiatives
            </a>
            <a href="#about" className="hover:text-[#C8A951] transition-colors">
              About
            </a>
            <a href="#regions" className="hover:text-[#C8A951] transition-colors">
              Regions
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 pt-24 pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Four-pointed star */}
          <div className="text-[#C8A951] text-4xl mb-8 animate-pulse" style={{ animationDuration: "3s" }}>
            &#10022;
          </div>

          <h1
            className="text-5xl sm:text-7xl font-bold tracking-tight leading-[1.1] text-white"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
          >
            Lion and Sun
            <br />
            <span className="text-[#C8A951]">Public Affairs Guild</span>
          </h1>

          <p
            className="mt-6 text-2xl text-[#C8A951]/70 tracking-wide"
            style={{ fontFamily: "var(--font-vazirmatn), 'Georgia', serif" }}
            dir="rtl"
          >
            کانون رایزنی شیر و خورشید
          </p>

          {/* Gold divider */}
          <div className="mt-10 mx-auto w-64 h-px bg-gradient-to-r from-transparent via-[#C8A951]/60 to-transparent" />

          <p className="mt-10 text-lg sm:text-xl text-[#E8E0D0]/60 max-w-2xl mx-auto leading-relaxed">
            The official transparent lobby for a democratic Iran.
            <br className="hidden sm:block" />
            Advancing policy, building community, and empowering the diaspora.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3 text-xs text-[#C8A951]/40 uppercase tracking-[0.2em]">
            <span>Aligned with NUFDI</span>
            <span className="text-[#C8A951]/20">&bull;</span>
            <span>Iran Prosperity Project</span>
          </div>
        </div>
      </section>

      {/* Initiatives */}
      <section id="initiatives" className="relative z-10 px-6 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-[#C8A951]/50 mb-3">
              Our Work
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-white"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Strategic Initiatives
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {initiatives.map((item) => {
              const isActive = item.status === "Active";
              const cardClass = `group relative overflow-hidden rounded-2xl border p-8 transition-all duration-500 ${
                isActive
                  ? "border-[#C8A951]/30 bg-gradient-to-br from-[#0D1B3A] to-[#0B1120] hover:border-[#C8A951]/60 hover:shadow-[0_0_40px_rgba(200,169,81,0.08)] cursor-pointer"
                  : "border-[#E8E0D0]/8 bg-[#0D1525]/50 cursor-default opacity-70"
              }`;

              const inner = (
                <>
                  {isActive && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#C8A951]/5 to-transparent rounded-bl-full transition-opacity group-hover:opacity-100 opacity-50" />
                  )}

                  <div className="relative">
                    <div className="flex items-start justify-between mb-5">
                      <div
                        className={`p-3 rounded-xl ${
                          isActive
                            ? "bg-[#C8A951]/10 text-[#C8A951]"
                            : "bg-white/5 text-[#E8E0D0]/30"
                        }`}
                      >
                        {item.icon}
                      </div>
                      <span
                        className={`text-xs px-3 py-1 rounded-full tracking-wider uppercase ${
                          isActive
                            ? "bg-[#C8A951]/10 text-[#C8A951]/80 border border-[#C8A951]/20"
                            : "bg-white/5 text-[#E8E0D0]/30 border border-white/5"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <h3
                      className={`text-xl font-bold mb-1 ${
                        isActive
                          ? "text-white group-hover:text-[#C8A951] transition-colors"
                          : "text-[#E8E0D0]/50"
                      }`}
                      style={{ fontFamily: "'Georgia', serif" }}
                    >
                      {item.title}
                    </h3>

                    <p
                      className="text-sm text-[#C8A951]/40 mb-4"
                      dir="rtl"
                      style={{ fontFamily: "var(--font-vazirmatn), 'Georgia', serif" }}
                    >
                      {item.farsi}
                    </p>

                    <p
                      className={`text-sm leading-relaxed ${
                        isActive ? "text-[#E8E0D0]/50" : "text-[#E8E0D0]/30"
                      }`}
                    >
                      {item.description}
                    </p>

                    {isActive && (
                      <div className="mt-6 flex items-center gap-2 text-[#C8A951]/60 text-sm group-hover:text-[#C8A951] transition-colors">
                        <span>Enter</span>
                        <svg
                          className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                      </div>
                    )}
                  </div>
                </>
              );

              return isActive ? (
                <Link key={item.title} href={item.href} className={cardClass}>
                  {inner}
                </Link>
              ) : (
                <div key={item.title} className={cardClass}>
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="relative z-10 px-6 pb-32">
        <div className="max-w-4xl mx-auto">
          <div className="border border-[#C8A951]/15 rounded-2xl p-10 sm:p-14 bg-gradient-to-b from-[#0D1B3A]/60 to-transparent">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-[#C8A951]/50 mb-3">
                Our Mission
              </p>
              <h2
                className="text-3xl sm:text-4xl font-bold text-white mb-8"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                Comprehensive Organizational Strategy
              </h2>
              <div className="mx-auto w-32 h-px bg-gradient-to-r from-transparent via-[#C8A951]/40 to-transparent mb-8" />
              <p className="text-[#E8E0D0]/50 leading-relaxed max-w-2xl mx-auto text-lg">
                The Lion and Sun Public Affairs Guild operates as a transparent,
                accountable lobbying organization dedicated to advancing democratic
                governance, civil liberties, and economic prosperity for Iran. We
                unite professionals across technology, policy, law, media, and finance
                to coordinate strategic advocacy efforts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Regions */}
      <section id="regions" className="relative z-10 px-6 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#C8A951]/50 mb-3">
            Presence
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-12"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Regional Offices
          </h2>

          <div className="flex flex-wrap justify-center gap-4">
            {regions.map((region, i) => (
              <div
                key={region}
                className="px-6 py-3 rounded-full border border-[#C8A951]/15 bg-[#0D1B3A]/40 text-sm text-[#E8E0D0]/60"
              >
                {i === 0 && (
                  <span className="text-[#C8A951]/60 mr-2">HQ</span>
                )}
                {region}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#C8A951]/10 px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[#C8A951] text-sm">&#10022;</span>
            <span className="text-xs text-[#E8E0D0]/30 uppercase tracking-wider">
              Lion and Sun Public Affairs Guild
            </span>
          </div>
          <div className="text-xs text-[#E8E0D0]/20">
            K Street NW, Washington, D.C. &bull; March 2026 &bull; Version 2.0
          </div>
        </div>
      </footer>
    </div>
  );
}
