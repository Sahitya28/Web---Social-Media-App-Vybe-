"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import EmojiPickerButton from "./EmojiPickerButton";

export default function CommentForm({ postId }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef(null);

  if (!session) {
    return (
      <p className="text-sm text-vybe-muted mb-4">
        <a href="/login" className="text-vybe-cyan hover:underline">
          Log in
        </a>{" "}
        to drop a comment.
      </p>
    );
  }

  function insertEmoji(emoji) {
    const textarea = textareaRef.current;
    if (!textarea) {
      setContent((c) => c + emoji);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const next = content.slice(0, start) + emoji + content.slice(end);
    setContent(next);
    // restore focus + cursor position after the inserted emoji
    requestAnimationFrame(() => {
      textarea.focus();
      const pos = start + emoji.length;
      textarea.setSelectionRange(pos, pos);
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, postId }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    setContent("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What are your thoughts?"
        className="w-full border rounded-xl p-3 text-sm min-h-[80px]"
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      <div className="mt-2 flex items-center gap-2">
        <EmojiPickerButton onSelect={insertEmoji} />
        <button
          type="submit"
          disabled={loading}
          className="gradient-btn text-white text-sm px-4 py-1.5 rounded-full font-medium disabled:opacity-50"
        >
          {loading ? "Posting..." : "Comment"}
        </button>
      </div>
    </form>
  );
}
