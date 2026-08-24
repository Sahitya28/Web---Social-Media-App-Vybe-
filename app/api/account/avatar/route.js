const { NextResponse } = require("next/server");
const fs = require("fs");
const path = require("path");
const { getServerSession } = require("next-auth");
const { authOptions } = require("../../../../lib/auth");
const prisma = require("../../../../lib/prisma");

const MAX_SIZE = 3 * 1024 * 1024; // 3MB
const ALLOWED_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const AVATAR_DIR = path.join(process.cwd(), "public", "uploads", "avatars");

function removeExistingAvatars(userId) {
  if (!fs.existsSync(AVATAR_DIR)) return;
  for (const file of fs.readdirSync(AVATAR_DIR)) {
    if (file.startsWith(`${userId}.`)) {
      fs.unlinkSync(path.join(AVATAR_DIR, file));
    }
  }
}

async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "You must be logged in" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES[file.type]) {
    return NextResponse.json(
      { error: "Only JPG, PNG, WEBP, or GIF images are allowed" },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Image must be under 3MB" }, { status: 400 });
  }

  fs.mkdirSync(AVATAR_DIR, { recursive: true });
  removeExistingAvatars(session.user.id);

  const ext = ALLOWED_TYPES[file.type];
  const filename = `${session.user.id}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(AVATAR_DIR, filename), buffer);

  // cache-bust so the browser picks up a replaced image immediately
  const avatarUrl = `/uploads/avatars/${filename}?v=${Date.now()}`;

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { avatarUrl },
    select: { avatarUrl: true },
  });

  return NextResponse.json({ user });
}

async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "You must be logged in" }, { status: 401 });
  }

  removeExistingAvatars(session.user.id);

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { avatarUrl: null },
    select: { avatarUrl: true },
  });

  return NextResponse.json({ user });
}

module.exports = { POST, DELETE };
