const { NextResponse } = require("next/server");
const { getServerSession } = require("next-auth");
const { authOptions } = require("../../../../../lib/auth");
const prisma = require("../../../../../lib/prisma");
const { REACTION_EMOJIS, scoreReactions } = require("../../../../../lib/reactions");

const ALLOWED_EMOJIS = REACTION_EMOJIS;

async function POST(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "You must be logged in to react" }, { status: 401 });
  }

  const { emoji } = await request.json();
  if (!ALLOWED_EMOJIS.includes(emoji)) {
    return NextResponse.json({ error: "Invalid emoji" }, { status: 400 });
  }

  const postId = params.id;
  const userId = session.user.id;

  const existing = await prisma.reaction.findUnique({
    where: { userId_postId: { userId, postId } },
  });

  if (existing && existing.emoji === emoji) {
    await prisma.reaction.delete({ where: { id: existing.id } });
  } else if (existing) {
    await prisma.reaction.update({ where: { id: existing.id }, data: { emoji } });
  } else {
    await prisma.reaction.create({ data: { emoji, userId, postId } });
  }

  const reactions = await prisma.reaction.findMany({ where: { postId } });
  const counts = {};
  for (const r of reactions) counts[r.emoji] = (counts[r.emoji] || 0) + 1;
  const myReaction = reactions.find((r) => r.userId === userId)?.emoji || null;
  const score = scoreReactions(reactions);

  return NextResponse.json({
    reactionCounts: counts,
    myReaction,
    totalReactions: reactions.length,
    score,
  });
}

module.exports = { POST };