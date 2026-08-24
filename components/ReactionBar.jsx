"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { REACTION_EMOJIS } from "../lib/reactions";

export default function ReactionBar({ targetId, kind = "post", initialCounts = {}, initialMyReaction = null }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [counts, setCounts] = useState(initialCounts);
  const [myReaction, setMyReaction] = useState(initialMyReaction);
  const [loading, setLoading] = useState(false);

  const endpoint =
    kind === "post" ? `/api/posts/${targetId}/react` : `/api/comments/${targetId}/react`;

  async function react(emoji) {
    if (!session) {
      router.push("/login");
      return;
    }
    if (loading) return;
    setLoading(true);

    // optimistic update
    setCounts((prev) => {
      const next = { ...prev };
      if (myReaction) next[myReaction] = Math.max(0, (next[myReaction] || 1) - 1);
      if (myReaction !== emoji) next[emoji] = (next[emoji] || 0) + 1;
      return next;
    });
    setMyReaction((prev) => (prev === emoji ? null : emoji));

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emoji }),
      });
      const data = await res.json();
      if (res.ok) {
        setCounts(data.reactionCounts);
        setMyReaction(data.myReaction);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {REACTION_EMOJIS.map((emoji) => {
        const count = counts[emoji] || 0;
        const isMine = myReaction === emoji;
        return (
          <button
            key={emoji}
            onClick={() => react(emoji)}
            className={`reaction-pill text-xs px-2 py-1 rounded-full border flex items-center gap-1 ${
              isMine
                ? emoji === "👎"
                  ? "border-vybe-pink bg-vybe-pink/20"
                  : "border-vybe-purple bg-vybe-purple/20"
                : "border-vybe-border bg-vybe-bg/60 hover:bg-vybe-border"
            }`}
          >
            <span>{emoji}</span>
            {count > 0 && <span className="text-vybe-muted">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}