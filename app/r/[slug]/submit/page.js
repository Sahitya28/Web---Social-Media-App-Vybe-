"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SubmitPostPage({ params }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const trimmedImageUrl = imageUrl.trim();

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        imageUrl: trimmedImageUrl || undefined,
        communitySlug: params.slug,
      }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    router.push(`/post/${data.post.id}`);
  }

  return (
    <div className="max-w-xl mx-auto card p-6 mt-4">
      <h1 className="text-xl font-bold mb-4 gradient-text">Post to r/{params.slug}</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-sm font-medium">Title</label>
          <input
            type="text"
            required
            maxLength={300}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-xl p-2 text-sm mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Text (optional)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border rounded-xl p-2 text-sm mt-1 min-h-[120px]"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Image URL (optional)</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full border rounded-xl p-2 text-sm mt-1"
          />
          <p className="text-xs text-vybe-muted mt-1">
            Use a direct link to the image file (ends in .jpg, .png, .gif, etc.) — not a link
            to a webpage that contains the image.
          </p>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="gradient-btn text-white px-4 py-2 rounded-full font-medium disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
}
