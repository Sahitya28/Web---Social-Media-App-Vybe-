import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import ReactionBar from "../../../components/ReactionBar";
import PostActions from "../../../components/PostActions";
import PostImage from "../../../components/PostImage";
import Avatar from "../../../components/Avatar";
import CommentForm from "../../../components/CommentForm";
import CommentList from "../../../components/CommentList";
import prisma from "../../../lib/prisma";

export default async function PostDetailPage({ params }) {
  const session = await getServerSession(authOptions);

  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      author: { select: { username: true, avatarUrl: true } },
      community: { select: { name: true, slug: true, emoji: true } },
      reactions: true,
      comments: {
        include: {
          author: { select: { username: true, avatarUrl: true } },
          reactions: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!post) notFound();

  const counts = {};
  for (const r of post.reactions) counts[r.emoji] = (counts[r.emoji] || 0) + 1;
  const myReaction = session
    ? post.reactions.find((r) => r.userId === session.user.id)?.emoji || null
    : null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-4 mb-4">
        <div className="flex items-center gap-1.5 text-xs text-vybe-muted mb-1.5">
          <Avatar src={post.author.avatarUrl} username={post.author.username} className="w-5 h-5 text-[10px]" />
          <Link href={`/r/${post.community.slug}`} className="font-bold text-vybe-text hover:underline">
            {post.community.emoji} r/{post.community.name}
          </Link>
          {" • u/"}
          {post.author.username}
          {" • "}
          {new Date(post.createdAt).toLocaleString()}
        </div>

        <h1 className="text-xl font-bold break-words">{post.title}</h1>

        {post.content && (
          <p className="text-sm text-vybe-muted mt-2 whitespace-pre-wrap break-words">
            {post.content}
          </p>
        )}

        {post.imageUrl && (
          <PostImage
            src={post.imageUrl}
            alt={post.title}
            className="mt-3 max-h-[500px] rounded-xl object-contain w-full"
          />
        )}

        <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
          <ReactionBar
            targetId={post.id}
            kind="post"
            initialCounts={counts}
            initialMyReaction={myReaction}
          />
          <PostActions postId={post.id} authorUsername={post.author.username} />
        </div>
      </div>

      <div className="card p-4">
        <h2 className="text-sm font-bold text-vybe-muted mb-3">
          {post.comments.length} Comments
        </h2>
        <CommentForm postId={post.id} />
        <CommentList comments={post.comments} />
      </div>
    </div>
  );
}
