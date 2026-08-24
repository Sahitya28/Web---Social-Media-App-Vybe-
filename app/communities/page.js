import Link from "next/link";
import { headers, cookies } from "next/headers";
import CommunityCard from "../../components/CommunityCard";

async function getBaseUrl() {
  const h = headers();
  const host = h.get("host");
  const protocol = host.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

async function getCommunities() {
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/api/communities`, {
    cache: "no-store",
    headers: { cookie: cookies().toString() },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.communities;
}

export default async function CommunitiesPage() {
  const communities = await getCommunities();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold gradient-text">All Communities</h1>
        <Link
          href="/communities/new"
          className="text-sm px-3 py-1.5 rounded-full gradient-btn text-white font-medium"
        >
          + Create Community
        </Link>
      </div>

      {communities.length === 0 ? (
        <div className="card p-8 text-center text-vybe-muted">
          No communities yet. Be the first to create one!
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {communities.map((c) => (
            <CommunityCard key={c.id} community={c} />
          ))}
        </div>
      )}
    </div>
  );
}
