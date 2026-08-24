"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import DeleteButton from "./DeleteButton";

export default function PostActions({ postId, authorUsername }) {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session || session.user.username !== authorUsername) return null;

  const onPostDetailPage = pathname === `/post/${postId}`;

  return (
    <DeleteButton
      endpoint={`/api/posts/${postId}`}
      confirmMessage="Delete this post permanently"
      redirectTo={onPostDetailPage ? "/" : undefined}
      label="Delete post"
    />
  );
}
