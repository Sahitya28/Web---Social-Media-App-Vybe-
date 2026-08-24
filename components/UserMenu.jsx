"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import Avatar from "./Avatar";

export default function UserMenu({ username, avatarUrl }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-sm font-medium px-2 py-1 rounded-full hover:bg-vybe-border/40"
      >
        <Avatar src={avatarUrl} username={username} className="w-7 h-7 text-xs" />
        <span className="hidden md:inline">{username}</span>
        <span className="text-xs text-vybe-muted">▾</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 card p-1.5 shadow-lg z-20">
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="block text-sm px-3 py-2 rounded-lg hover:bg-vybe-border/40"
          >
            👤 Profile
          </Link>
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="block text-sm px-3 py-2 rounded-lg hover:bg-vybe-border/40"
          >
            ⚙️ Settings
          </Link>
          <div className="my-1 border-t border-vybe-border" />
          <button
            onClick={() => {
              setOpen(false);
              signOut({ callbackUrl: "/" });
            }}
            className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-vybe-border/40 text-red-500"
          >
            🚪 Log out
          </button>
        </div>
      )}
    </div>
  );
}
