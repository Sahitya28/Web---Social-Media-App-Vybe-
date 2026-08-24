"use client";

import { useState, useRef, useEffect } from "react";

const EMOJI_GROUPS = [
  ["😀", "😂", "😅", "😍", "🥹", "😎", "🤔", "😴"],
  ["🔥", "💯", "✨", "🎉", "👀", "💀", "🙌", "👏"],
  ["❤️", "😢", "😮", "😭", "🤯", "😤", "🙄", "😬"],
  ["👍", "👎", "🤝", "🫡", "🤙", "✌️", "🤷", "🙏"],
];

export default function EmojiPickerButton({ onSelect }) {
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
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-lg px-2 py-1 rounded-full border border-vybe-border hover:bg-vybe-border"
        aria-label="Insert emoji"
      >
        😊
      </button>

      {open && (
        <div className="absolute bottom-full mb-2 left-0 card p-2 z-20 shadow-2xl w-56">
          {EMOJI_GROUPS.map((row, i) => (
            <div key={i} className="flex justify-between mb-1 last:mb-0">
              {row.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    onSelect(emoji);
                    setOpen(false);
                  }}
                  className="text-xl hover:scale-125 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
