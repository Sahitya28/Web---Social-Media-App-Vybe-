"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Avatar from "./Avatar";

export default function AvatarUpload() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setPreview(URL.createObjectURL(file));
    uploadFile(file);
  }

  async function uploadFile(file) {
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/account/avatar", { method: "POST", body: formData });
    const data = await res.json().catch(() => ({}));

    setUploading(false);

    if (!res.ok) {
      setError(data.error || "Upload failed");
      setPreview(null);
      return;
    }

    await update({ avatarUrl: data.user.avatarUrl });
    router.refresh();
  }

  async function handleRemove() {
    setUploading(true);
    setError("");

    const res = await fetch("/api/account/avatar", { method: "DELETE" });
    const data = await res.json().catch(() => ({}));

    setUploading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    setPreview(null);
    await update({ avatarUrl: null });
    router.refresh();
  }

  const currentSrc = preview || session?.user?.avatarUrl;

  return (
    <div className="flex items-center gap-4">
      <Avatar src={currentSrc} username={session?.user?.username} className="w-16 h-16 text-xl" />

      <div className="flex flex-col gap-1.5">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="text-sm gradient-btn text-white px-3 py-1.5 rounded-full font-medium disabled:opacity-50 w-fit"
        >
          {uploading ? "Uploading..." : "Upload photo"}
        </button>
        {currentSrc && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={uploading}
            className="text-xs text-vybe-muted hover:text-red-500 text-left"
          >
            Remove photo
          </button>
        )}
        <p className="text-xs text-vybe-muted">JPG, PNG, WEBP, or GIF. Max 3MB.</p>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
}
