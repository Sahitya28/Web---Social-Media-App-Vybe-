const { NextResponse } = require("next/server");
const { getServerSession } = require("next-auth");
const { authOptions } = require("../../../lib/auth");
const prisma = require("../../../lib/prisma");
const { scoreReactions } = require("../../../lib/reactions");

async function GET(request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get("sort") || "new";
  const communitySlug = searchParams.get("community");

  const where = communitySlug ? { community: { slug: communitySlug } } : {};

  const posts = await prisma.post.findMany({
    where,
    include: {
      author: { select: { username: true, avatarUrl: true } },
      community: { select: { name: true, slug: true, emoji: true } },
      reactions: true,
      _count: { select: { comments: true } },
    },
    orderBy: sort === "new" ? { createdAt: "desc" } : undefined,
  });

  const shaped = posts.map((post) => {
    const counts = {};
    for (const r of post.reactions) {
      counts[r.emoji] = (counts[r.emoji] || 0) + 1;
    }
    const myReaction = session
      ? post.reactions.find((r) => r.userId === session.user.id)?.emoji || null
      : null;
    const totalReactions = post.reactions.length;
    const score = scoreReactions(post.reactions);
    const { reactions, ...rest } = post;
    return { ...rest, reactionCounts: counts, myReaction, totalReactions, score };
  });

  if (sort === "top") {
    // Ranked by weighted score (🔥❤️ count more, 👎 counts against), not raw reaction volume.
    // Ties broken by newest first.
    shaped.sort((a, b) => b.score - a.score || new Date(b.createdAt) - new Date(a.createdAt));
  }

  return NextResponse.json({ posts: shaped });
}

async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "You must be logged in" }, { status: 401 });
  }

  try {
    const { title, content, imageUrl, communitySlug } = await request.json();

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!communitySlug) {
      return NextResponse.json({ error: "Community is required" }, { status: 400 });
    }

    let cleanImageUrl = null;
    if (imageUrl && imageUrl.trim()) {
      const trimmed = imageUrl.trim();
      if (!/^https?:\/\//i.test(trimmed)) {
        return NextResponse.json(
          { error: "Image URL must start with http:// or https:// — use a direct link to the image file, not a webpage." },
          { status: 400 }
        );
      }
      cleanImageUrl = trimmed;
    }

    const community = await prisma.community.findUnique({ where: { slug: communitySlug } });
    if (!community) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 });
    }

    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        content: content || "",
        imageUrl: cleanImageUrl,
        communityId: community.id,
        authorId: session.user.id,
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

module.exports = { GET, POST };