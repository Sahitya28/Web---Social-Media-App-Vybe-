const { NextResponse } = require("next/server");
const { getServerSession } = require("next-auth");
const { authOptions } = require("../../../lib/auth");
const prisma = require("../../../lib/prisma");

async function GET() {
  const communities = await prisma.community.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { posts: true } },
      creator: { select: { username: true } },
    },
  });
  return NextResponse.json({ communities });
}

async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "You must be logged in" }, { status: 401 });
  }

  try {
    const { name, description, emoji } = await request.json();

    if (!name || !/^[a-zA-Z0-9_]{3,21}$/.test(name)) {
      return NextResponse.json(
        { error: "Community name must be 3-21 characters, letters/numbers/underscores only" },
        { status: 400 }
      );
    }

    const slug = name.toLowerCase();

    const existing = await prisma.community.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "A community with that name already exists" }, { status: 409 });
    }

    const community = await prisma.community.create({
      data: {
        name,
        slug,
        description: description || null,
        emoji: emoji || "✨",
        creatorId: session.user.id,
      },
    });

    return NextResponse.json({ community }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

module.exports = { GET, POST };
