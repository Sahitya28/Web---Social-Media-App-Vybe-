"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Modal from "./Modal";

export default function DeleteAccountSection() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    setError("");

    const res = await fetch("/api/account", { method: "DELETE" });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong");
      setLoading(false);
      return;
    }

    await signOut({ callbackUrl: "/" });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-sm border border-red-500/50 text-red-400 px-3 py-1.5 rounded-full hover:bg-red-500/10"
      >
        Delete account
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Delete your account?">
        <p className="text-sm text-vybe-muted mb-4">
          This permanently deletes your account, posts, comments, and reactions — and any
          communities you created, along with everyone else&apos;s posts inside them. This
          can&apos;t be undone.
        </p>
        {error && <p className="text-sm text-red-400 mb-3">{error}</p>}
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setOpen(false)}
            className="text-sm px-3 py-1.5 rounded-full border border-vybe-border hover:bg-vybe-border"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="text-sm px-3 py-1.5 rounded-full bg-red-500 text-white font-medium disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Yes, delete my account"}
          </button>
        </div>
      </Modal>
    </>
  );
}
