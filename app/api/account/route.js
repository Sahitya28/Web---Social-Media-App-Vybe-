const { NextResponse } = require("next/server");
const { getServerSession } = require("next-auth");
const { authOptions } = require("../../../lib/auth");
const prisma = require("../../../lib/prisma");

async function PATCH(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "You must be logged in" }, { status: 401 });
  }

  const { username } = await request.json();
  if (!username || !/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
    return NextResponse.json(
      { error: "Username must be 3-20 characters, letters/numbers/underscores only" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing && existing.id !== session.user.id) {
    return NextResponse.json({ error: "That username is already taken" }, { status: 409 });
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { username },
    select: { id: true, username: true, email: true },
  });

  return NextResponse.json({ user });
}

async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "You must be logged in" }, { status: 401 });
  }

  // Cascades: deletes this user's posts, comments, reactions, and any
  // communities they created (along with that community's posts/comments).
  await prisma.user.delete({ where: { id: session.user.id } });

  return NextResponse.json({ success: true });
}

module.exports = { PATCH, DELETE };
