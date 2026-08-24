"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";

export default function DeleteButton({ endpoint, confirmMessage, redirectTo, label = "Delete" }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setLoading(true);
    setError("");

    const res = await fetch(endpoint, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));

    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    setOpen(false);
    if (redirectTo) {
      router.push(redirectTo);
    }
    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-vybe-muted hover:text-red-400"
      >
        🗑 {label}
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Are you sure?">
        <p className="text-sm text-vybe-muted mb-4">
          {confirmMessage || "This action can't be undone."}
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
            {loading ? "Deleting..." : "Yes, delete"}
          </button>
        </div>
      </Modal>
    </>
  );
}
