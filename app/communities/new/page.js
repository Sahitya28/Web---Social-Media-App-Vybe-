"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const EMOJI_CHOICES = ["✨", "🎮", "💻", "🎨", "🎵", "📚", "🍿", "⚽", "🐾", "🌱"];

export default function NewCommunityPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState("✨");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/communities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, emoji }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    router.push(`/r/${data.community.slug}`);
  }

  return (
    <div className="max-w-sm mx-auto card p-6 mt-8">
      <h1 className="text-xl font-bold mb-1 gradient-text">Start a community</h1>
      <p className="text-sm text-vybe-muted mb-4">
        Pick a vibe and a name — names can&apos;t be changed later.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-sm font-medium">Vibe emoji</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {EMOJI_CHOICES.map((e) => (
              <button
                type="button"
                key={e}
                onClick={() => setEmoji(e)}
                className={`text-lg w-9 h-9 rounded-full flex items-center justify-center border ${
                  emoji === e ? "border-vybe-purple bg-vybe-purple/20" : "border-vybe-border"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Name</label>
          <div className="flex items-center border rounded-xl mt-1 px-2 border-vybe-border">
            <span className="text-vybe-muted text-sm">r/</span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 text-sm border-none"
              placeholder="community_name"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-xl p-2 text-sm mt-1 min-h-[70px]"
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full gradient-btn text-white py-2 rounded-full font-medium disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Community"}
        </button>
      </form>
    </div>
  );
}
