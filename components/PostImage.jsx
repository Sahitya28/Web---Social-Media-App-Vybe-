"use client";

import { useState } from "react";

export default function PostImage({ src, alt, className }) {
  const [failed, setFailed] = useState(false);

  if (!src) return null;

  if (failed) {
    return (
      <div className={`${className} flex flex-col items-center justify-center gap-1 bg-vybe-bg border border-dashed border-vybe-border text-vybe-muted text-xs p-4`}>
        <span>🖼️ Image couldn&apos;t load</span>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="underline break-all text-center"
          onClick={(e) => e.stopPropagation()}
        >
          {src}
        </a>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />
  );
}
