"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import UserMenu from "./UserMenu";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="border-b border-vybe-border sticky top-0 z-30 bg-vybe-bg/80 backdrop-blur">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-5">
          <Link href="/" className="text-xl font-extrabold gradient-text tracking-tight">
            vybe ✨
          </Link>

          {/* Site navigation — not user-specific */}
          <div className="hidden sm:flex items-center gap-2">
            <Link
              href="/communities"
              className="text-sm px-3 py-1.5 rounded-full border border-vybe-border hover:bg-vybe-card"
            >
              Communities
            </Link>
            {session && (
              <Link
                href="/communities/new"
                className="text-sm px-3 py-1.5 rounded-full gradient-btn text-white font-medium"
              >
                + Create
              </Link>
            )}
          </div>
        </div>

        {/* User-specific area */}
        <div className="hidden sm:flex items-center gap-3">
          {status === "loading" ? (
            <div className="skeleton w-24 h-8 rounded-full" />
          ) : session ? (
            <UserMenu username={session.user.username} avatarUrl={session.user.avatarUrl} />
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm px-3 py-1.5 rounded-full border border-vybe-border hover:bg-vybe-card"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="text-sm px-3 py-1.5 rounded-full gradient-btn text-white font-medium"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden text-2xl leading-none"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu — grouped the same way */}
      {menuOpen && (
        <div className="sm:hidden border-t border-vybe-border px-4 py-3 flex flex-col gap-3">
          <div>
            <p className="text-xs font-semibold text-vybe-muted mb-1.5 uppercase tracking-wide">
              Explore
            </p>
            <Link href="/communities" onClick={() => setMenuOpen(false)} className="block text-sm py-1.5">
              Communities
            </Link>
            {session && (
              <Link href="/communities/new" onClick={() => setMenuOpen(false)} className="block text-sm py-1.5">
                + Create Community
              </Link>
            )}
          </div>

          <div className="border-t border-vybe-border pt-3">
            <p className="text-xs font-semibold text-vybe-muted mb-1.5 uppercase tracking-wide">
              Account
            </p>
            {status === "loading" ? null : session ? (
              <>
                <Link href="/profile" onClick={() => setMenuOpen(false)} className="block text-sm py-1.5">
                  👤 {session.user.username}
                </Link>
                <Link href="/settings" onClick={() => setMenuOpen(false)} className="block text-sm py-1.5">
                  ⚙️ Settings
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="text-sm py-1.5 text-left text-red-500"
                >
                  🚪 Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="block text-sm py-1.5">
                  Log in
                </Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="block text-sm py-1.5">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
