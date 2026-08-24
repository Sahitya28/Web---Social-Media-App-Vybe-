import Link from "next/link";
import ReactionBar from "./ReactionBar";
import PostActions from "./PostActions";
import PostImage from "./PostImage";
import Avatar from "./Avatar";

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [label, secs] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count} ${label}${count > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

export default function PostCard({ post }) {
  return (
    <div className="card p-4 mb-3 hover:border-vybe-purple/50 transition-colors">
      <div className="flex items-center gap-1.5 text-xs text-vybe-muted mb-1.5">
        <Avatar src={post.author.avatarUrl} username={post.author.username} className="w-5 h-5 text-[10px]" />
        <Link href={`/r/${post.community.slug}`} className="font-bold text-vybe-text hover:underline">
          {post.community.emoji} r/{post.community.name}
        </Link>
        {" • "}
        <span>u/{post.author.username}</span>
        {" • "}
        <span>{timeAgo(post.createdAt)}</span>
      </div>

      <Link href={`/post/${post.id}`}>
        <h2 className="text-lg font-semibold hover:text-vybe-purple break-words">{post.title}</h2>
      </Link>

      {post.content && (
        <p className="text-sm text-vybe-muted mt-1 line-clamp-3 break-words">{post.content}</p>
      )}

      {post.imageUrl && (
        <PostImage
          src={post.imageUrl}
          alt={post.title}
          className="mt-2 max-h-96 rounded-xl object-contain w-full"
        />
      )}

      <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
        <ReactionBar
          targetId={post.id}
          kind="post"
          initialCounts={post.reactionCounts}
          initialMyReaction={post.myReaction}
        />

        <div className="flex items-center gap-3 text-xs text-vybe-muted">
          <Link href={`/post/${post.id}`} className="hover:text-vybe-text">
            💬 {post._count?.comments ?? 0}
          </Link>
          <PostActions postId={post.id} authorUsername={post.author.username} />
        </div>
      </div>
    </div>
  );
}
