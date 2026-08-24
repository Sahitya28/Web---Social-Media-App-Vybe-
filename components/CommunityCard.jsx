"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import DeleteButton from "./DeleteButton";

export default function CommunityCard({ community: c }) {
  const { data: session } = useSession();
  const isCreator = session && session.user.username === c.creator?.username;

  return (
    <div className="card p-4 hover:border-vybe-purple/50 transition-colors">
      <Link href={`/r/${c.slug}`}>
        <h2 className="font-bold text-vybe-text hover:text-vybe-purple">
          {c.emoji} r/{c.name}
        </h2>
      </Link>
      {c.description && (
        <p className="text-sm text-vybe-muted mt-1 line-clamp-2">{c.description}</p>
      )}
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-vybe-muted/70">
          {c._count.posts} posts • by u/{c.creator?.username}
        </p>
        {isCreator && (
          <DeleteButton
            endpoint={`/api/communities/${c.slug}`}
            confirmMessage="Delete this community and all its posts"
            label="Delete"
          />
        )}
      </div>
    </div>
  );
}
