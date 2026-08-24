const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 10);

  const alice = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: { email: "alice@example.com", username: "alice", password },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: { email: "bob@example.com", username: "bob", password },
  });

  const webdev = await prisma.community.upsert({
    where: { slug: "webdev" },
    update: {},
    create: {
      name: "webdev",
      slug: "webdev",
      description: "For devs building cool stuff on the web.",
      emoji: "💻",
      creatorId: alice.id,
    },
  });

  const gaming = await prisma.community.upsert({
    where: { slug: "gaming" },
    update: {},
    create: {
      name: "gaming",
      slug: "gaming",
      description: "Everything about video games.",
      emoji: "🎮",
      creatorId: bob.id,
    },
  });

  const post1 = await prisma.post.create({
    data: {
      title: "Welcome to Vybe! 🎉",
      content: "This is the first post in this community. Drop a reaction and say hi!",
      communityId: webdev.id,
      authorId: alice.id,
    },
  });

  await prisma.post.create({
    data: {
      title: "What's your favorite game of 2026?",
      content: "Curious what everyone has been playing lately.",
      communityId: gaming.id,
      authorId: bob.id,
    },
  });

  const comment1 = await prisma.comment.create({
    data: {
      content: "Great to be here!",
      postId: post1.id,
      authorId: bob.id,
    },
  });

  await prisma.reaction.create({
    data: { emoji: "🔥", userId: bob.id, postId: post1.id },
  });

  await prisma.commentReaction.create({
    data: { emoji: "❤️", userId: alice.id, commentId: comment1.id },
  });

  console.log("Seed data created.");
  console.log("Test accounts: alice@example.com / bob@example.com, password: password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
