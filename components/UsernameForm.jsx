"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function UsernameForm({ currentUsername }) {
  const router = useRouter();
  const { update } = useSession();
  const [username, setUsername] = useState(currentUsername);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const res = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    setMessage("Username updated!");
    await update({ username: data.user.username });
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="flex-1 border rounded-xl p-2 text-sm"
      />
      <button
        type="submit"
        disabled={loading || username === currentUsername}
        className="gradient-btn text-white text-sm px-4 rounded-full font-medium disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save"}
      </button>
      {message && <p className="text-xs text-vybe-cyan self-center">{message}</p>}
      {error && <p className="text-xs text-red-400 self-center">{error}</p>}
    </form>
  );
}
