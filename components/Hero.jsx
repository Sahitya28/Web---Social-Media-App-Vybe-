import Link from "next/link";

export default function Hero({ communities = [] }) {
  return (
    <div className="mb-8">
      <div className="card relative overflow-hidden px-6 py-12 sm:py-16 text-center">
        <div
          className="pointer-events-none absolute inset-0 opacity-10 bg-vybe-gradient"
          aria-hidden="true"
        />
        <div className="relative">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            <span className="gradient-text">Vybe</span> — communities that hit different
          </h1>
          <p className="mt-4 text-vybe-muted text-base sm:text-lg max-w-xl mx-auto">
            Skip the boring upvotes. React with emoji, join communities you actually care about,
            and post what's on your mind.
          </p>
          <div className="mt-7 flex items-center justify-center gap-3">
            <Link
              href="/register"
              className="px-5 py-2.5 rounded-full gradient-btn text-white font-medium text-sm sm:text-base"
            >
              Sign up free
            </Link>
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-full border border-vybe-border hover:bg-vybe-bg font-medium text-sm sm:text-base"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>

      {communities.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-vybe-muted uppercase tracking-wide">
              Popular communities
            </h2>
            <Link href="/communities" className="text-sm text-vybe-purple hover:underline">
              See all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {communities.map((c) => (
              <Link
                key={c.id}
                href={`/r/${c.slug}`}
                className="card p-4 hover:border-vybe-purple/50 transition-colors block"
              >
                <p className="font-bold text-vybe-text">
                  {c.emoji} r/{c.name}
                </p>
                {c.description && (
                  <p className="text-sm text-vybe-muted mt-1 line-clamp-2">{c.description}</p>
                )}
                <p className="text-xs text-vybe-muted/70 mt-2">{c._count.posts} posts</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}