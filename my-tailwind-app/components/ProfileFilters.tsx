"use client";

import { useRouter, usePathname } from "next/navigation";

interface Props {
  currentParams: Record<string, string | undefined>;
}

export default function ProfileFilters({ currentParams }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  function handleChange(key: string, value: string) {
    const params = new URLSearchParams();
    const merged = { ...currentParams, [key]: value, page: "1" };
    for (const [k, v] of Object.entries(merged)) {
      if (v) params.set(k, v);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearFilters() {
    router.push(pathname);
  }

  const hasFilters =
    currentParams.gender ||
    currentParams.nationality ||
    currentParams.country ||
    currentParams.search;

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <input
        type="search"
        placeholder="Search name…"
        defaultValue={currentParams.search || ""}
        onChange={(e) => handleChange("search", e.target.value)}
        className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm w-48"
      />
      <select
        value={currentParams.gender || ""}
        onChange={(e) => handleChange("gender", e.target.value)}
        className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 text-sm"
      >
        <option value="">All genders</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <input
        type="text"
        placeholder="Nationality…"
        defaultValue={currentParams.nationality || ""}
        onBlur={(e) => handleChange("nationality", e.target.value)}
        className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm w-36"
      />
      <input
        type="text"
        placeholder="Country…"
        defaultValue={currentParams.country || ""}
        onBlur={(e) => handleChange("country", e.target.value)}
        className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm w-36"
      />
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  );
}
