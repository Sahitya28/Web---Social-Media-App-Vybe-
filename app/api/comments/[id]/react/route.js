const { NextResponse } = require("next/server");
const { getServerSession } = require("next-auth");
const { authOptions } = require("../../../../../lib/auth");
const prisma = require("../../../../../lib/prisma");
const { REACTION_EMOJIS } = require("../../../../../lib/reactions");

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

  const commentId = params.id;
  const userId = session.user.id;

  const existing = await prisma.commentReaction.findUnique({
    where: { userId_commentId: { userId, commentId } },
  });

  if (existing && existing.emoji === emoji) {
    await prisma.commentReaction.delete({ where: { id: existing.id } });
  } else if (existing) {
    await prisma.commentReaction.update({ where: { id: existing.id }, data: { emoji } });
  } else {
    await prisma.commentReaction.create({ data: { emoji, userId, commentId } });
  }

  const reactions = await prisma.commentReaction.findMany({ where: { commentId } });
  const counts = {};
  for (const r of reactions) counts[r.emoji] = (counts[r.emoji] || 0) + 1;
  const myReaction = reactions.find((r) => r.userId === userId)?.emoji || null;

  return NextResponse.json({ reactionCounts: counts, myReaction });
}

module.exports = { POST };