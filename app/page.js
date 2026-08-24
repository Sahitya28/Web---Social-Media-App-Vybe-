import { Suspense } from "react";
import { headers, cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import prisma from "../lib/prisma";
import PostCard from "../components/PostCard";
import SortTabs from "../components/SortTabs";
import Hero from "../components/Hero";

async function getBaseUrl() {
  const h = headers();
  const host = h.get("host");
  const protocol = host.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

async function getPosts(sort) {
  const baseUrl = await getBaseUrl();
  const cookieHeader = cookies().toString();
  const res = await fetch(`${baseUrl}/api/posts?sort=${sort}`, {
    cache: "no-store",
    headers: { cookie: cookieHeader },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.posts;
}

function FeedSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="card p-3 h-24 skeleton" />
      ))}
    </div>
  );
}

async function Feed({ sort }) {
  const posts = await getPosts(sort);

  if (posts.length === 0) {
    return (
      <div className="card p-8 text-center text-vybe-muted">
        <p className="mb-2">No vybes yet. 👀</p>
        <p className="text-sm">Join or create a community, then drop the first post!</p>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

async function getTopCommunities() {
  return prisma.community.findMany({
    orderBy: { posts: { _count: "desc" } },
    take: 3,
    include: {
      _count: { select: { posts: true } },
    },
  });
}

export default async function HomePage({ searchParams }) {
  const sort = searchParams?.sort === "top" ? "top" : "new";
  const session = await getServerSession(authOptions);

  if (!session) {
    const communities = await getTopCommunities();
    return (
      <div>
        <Hero communities={communities} />
        <SortTabs />
        <Suspense fallback={<FeedSkeleton />}>
          <Feed sort={sort} />
        </Suspense>
      </div>
    );
  }

  return (
    <div>
      <SortTabs />
      <Suspense fallback={<FeedSkeleton />}>
        <Feed sort={sort} />
      </Suspense>
    </div>
  );
}