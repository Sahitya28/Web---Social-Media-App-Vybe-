"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function SortTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") || "new";

  function setSort(value) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`);
  }

  const tabs = [
    { key: "new", label: "🕒 New" },
    { key: "top", label: "🔥 Top" },
  ];

  return (
    <div className="card flex gap-1 p-1 mb-3 w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setSort(tab.key)}
          className={`text-sm px-3 py-1.5 rounded-full font-medium transition-colors ${
            sort === tab.key ? "gradient-btn text-white" : "text-vybe-muted hover:bg-vybe-border"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
