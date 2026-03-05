import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-[#0a0a0a] via-[#111827] to-[#0a0a0a]">
      <div className="max-w-2xl text-center">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-gray-400 mb-6">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Community of 100+ Persian tech people
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white tracking-tight">
            Persian X Lobby
          </h1>
          <p className="mt-4 text-lg text-gray-400 leading-relaxed">
            We support each other on X. Join the lobby, sync your following list,
            and make sure every member is connected.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/join"
            className="px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Join the Lobby
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 bg-white/10 text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-2xl font-bold text-white">1.</div>
            <p className="mt-2 text-sm text-gray-500">Join with an invite code</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">2.</div>
            <p className="mt-2 text-sm text-gray-500">Sync your following list</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">3.</div>
            <p className="mt-2 text-sm text-gray-500">Follow missing members</p>
          </div>
        </div>
      </div>
    </div>
  );
}
