import Link from "next/link";
import { headers, cookies } from "next/headers";
import { notFound } from "next/navigation";
import PostCard from "../../../components/PostCard";
import SortTabs from "../../../components/SortTabs";
import CommunityHeaderActions from "../../../components/CommunityHeaderActions";
import prisma from "../../../lib/prisma";

async function getBaseUrl() {
  const h = headers();
  const host = h.get("host");
  const protocol = host.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

async function getPosts(slug, sort) {
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/api/posts?sort=${sort}&community=${slug}`, {
    cache: "no-store",
    headers: { cookie: cookies().toString() },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.posts;
}

export default async function CommunityPage({ params, searchParams }) {
  const community = await prisma.community.findUnique({
    where: { slug: params.slug },
    include: { creator: { select: { username: true } } },
  });
  if (!community) notFound();

  const sort = searchParams?.sort === "top" ? "top" : "new";
  const posts = await getPosts(params.slug, sort);

  return (
    <div>
      <div className="card p-4 mb-4">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <h1 className="text-xl font-bold gradient-text">
              {community.emoji} r/{community.name}
            </h1>
            {community.description && (
              <p className="text-sm text-vybe-muted mt-1">{community.description}</p>
            )}
            <p className="text-xs text-vybe-muted/70 mt-1">
              Created by u/{community.creator.username}
            </p>
          </div>
          <CommunityHeaderActions slug={community.slug} creatorUsername={community.creator.username} />
        </div>
        <Link
          href={`/r/${community.slug}/submit`}
          className="inline-block mt-3 text-sm gradient-btn text-white px-3 py-1.5 rounded-full font-medium"
        >
          + Create Post
        </Link>
      </div>

      <SortTabs />

      {posts.length === 0 ? (
        <div className="card p-8 text-center text-vybe-muted">
          No posts in r/{community.name} yet. Be the first to post!
        </div>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
}
