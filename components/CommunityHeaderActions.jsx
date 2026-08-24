"use client";

import { useSession } from "next-auth/react";
import DeleteButton from "./DeleteButton";

export default function CommunityHeaderActions({ slug, creatorUsername }) {
  const { data: session } = useSession();
  if (!session || session.user.username !== creatorUsername) return null;

  return (
    <DeleteButton
      endpoint={`/api/communities/${slug}`}
      confirmMessage="Delete this community and all its posts"
      redirectTo="/communities"
      label="Delete community"
    />
  );
}
