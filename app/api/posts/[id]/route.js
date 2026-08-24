const { NextResponse } = require("next/server");
const { getServerSession } = require("next-auth");
const { authOptions } = require("../../../../lib/auth");
const prisma = require("../../../../lib/prisma");

async function GET(request, { params }) {
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

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const counts = {};
  for (const r of post.reactions) counts[r.emoji] = (counts[r.emoji] || 0) + 1;
  const myReaction = session
    ? post.reactions.find((r) => r.userId === session.user.id)?.emoji || null
    : null;

  return NextResponse.json({
    post: { ...post, reactionCounts: counts, myReaction, totalReactions: post.reactions.length },
  });
}

async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "You must be logged in" }, { status: 401 });
  }

  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
  if (post.authorId !== session.user.id) {
    return NextResponse.json({ error: "You can only delete your own posts" }, { status: 403 });
  }

  await prisma.post.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}

module.exports = { GET, DELETE };
