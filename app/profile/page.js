import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "../../lib/prisma";
import ProfilePostGrid from "../../components/ProfilePostGrid";
import Avatar from "../../components/Avatar";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      posts: {
        include: {
          reactions: true,
          _count: { select: { comments: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      comments: { select: { id: true } },
      createdCommunities: { select: { id: true, name: true, slug: true, emoji: true } },
    },
  });

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card p-5 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <Avatar src={user.avatarUrl} username={user.username} className="w-16 h-16 text-2xl" />
          <div className="flex-1 min-w-[160px]">
            <h1 className="text-xl font-bold">u/{user.username}</h1>
            <p className="text-sm text-vybe-muted">{user.email}</p>
          </div>
          <Link
            href="/settings"
            className="text-sm px-3 py-1.5 rounded-full border border-vybe-border hover:bg-vybe-border"
          >
            ⚙️ Settings
          </Link>
        </div>

        <div className="flex gap-6 mt-4 pt-4 border-t border-vybe-border text-sm">
          <div>
            <span className="font-bold">{user.posts.length}</span>{" "}
            <span className="text-vybe-muted">posts</span>
          </div>
          <div>
            <span className="font-bold">{user.comments.length}</span>{" "}
            <span className="text-vybe-muted">comments</span>
          </div>
          <div>
            <span className="font-bold">{user.createdCommunities.length}</span>{" "}
            <span className="text-vybe-muted">communities started</span>
          </div>
        </div>

        {user.createdCommunities.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {user.createdCommunities.map((c) => (
              <Link
                key={c.id}
                href={`/r/${c.slug}`}
                className="text-xs px-2.5 py-1 rounded-full border border-vybe-border hover:bg-vybe-border"
              >
                {c.emoji} r/{c.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      <h2 className="font-bold mb-3">Your Posts</h2>
      <ProfilePostGrid posts={user.posts} />
    </div>
  );
}
