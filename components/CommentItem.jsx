"use client";

import { useSession } from "next-auth/react";
import ReactionBar from "./ReactionBar";
import DeleteButton from "./DeleteButton";
import Avatar from "./Avatar";

export default function CommentItem({ comment }) {
  const { data: session } = useSession();
  const isAuthor = session && session.user.username === comment.author.username;

  const counts = {};
  for (const r of comment.reactions || []) counts[r.emoji] = (counts[r.emoji] || 0) + 1;
  const myReaction = session
    ? comment.reactions?.find((r) => r.userId === session.user.id)?.emoji || null
    : null;

  return (
    <div className="border-l-2 border-vybe-border pl-3">
      <div className="flex items-center gap-1.5 text-xs text-vybe-muted">
        <Avatar src={comment.author.avatarUrl} username={comment.author.username} className="w-5 h-5 text-[10px]" />
        <span className="font-bold text-vybe-text">u/{comment.author.username}</span>
        {" • "}
        {new Date(comment.createdAt).toLocaleString()}
      </div>
      <p className="text-sm mt-1 break-words">{comment.content}</p>
      <div className="mt-1.5 flex items-center gap-3">
        <ReactionBar
          targetId={comment.id}
          kind="comment"
          initialCounts={counts}
          initialMyReaction={myReaction}
        />
        {isAuthor && (
          <DeleteButton
            endpoint={`/api/comments/${comment.id}`}
            confirmMessage="Delete this comment"
            label="Delete"
          />
        )}
      </div>
    </div>
  );
}
