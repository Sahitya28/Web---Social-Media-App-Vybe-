const { NextResponse } = require("next/server");
const { getServerSession } = require("next-auth");
const { authOptions } = require("../../../../lib/auth");
const prisma = require("../../../../lib/prisma");

async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "You must be logged in" }, { status: 401 });
  }

  const community = await prisma.community.findUnique({ where: { slug: params.slug } });
  if (!community) {
    return NextResponse.json({ error: "Community not found" }, { status: 404 });
  }
  if (community.creatorId !== session.user.id) {
    return NextResponse.json(
      { error: "Only the creator can delete this community" },
      { status: 403 }
    );
  }

  await prisma.community.delete({ where: { id: community.id } });
  return NextResponse.json({ success: true });
}

module.exports = { DELETE };
