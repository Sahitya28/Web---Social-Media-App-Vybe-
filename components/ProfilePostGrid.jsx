"use client";

import Link from "next/link";

export default function ProfilePostGrid({ posts }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="card p-8 text-center text-vybe-muted">
        You haven&apos;t posted anything yet. Time to drop a vybe. ✨
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
      {posts.map((post) => {
        const totalReactions = post.reactions?.length || 0;
        return (
          <Link
            key={post.id}
            href={`/post/${post.id}`}
            className="group relative aspect-square rounded-lg overflow-hidden border border-vybe-border bg-vybe-card"
          >
            {post.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-3 bg-vybe-gradient/10">
                <p className="text-xs text-center line-clamp-4 text-vybe-text">{post.title}</p>
              </div>
            )}

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex items-center gap-3 text-white text-sm font-medium">
                <span>❤️ {totalReactions}</span>
                <span>💬 {post._count?.comments ?? 0}</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
