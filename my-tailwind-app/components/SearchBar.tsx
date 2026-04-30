"use client";

import { useRouter } from "next/navigation";
const Search = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);
import { useRef } from "react";

interface SearchBarProps {
  defaultValue?: string;
  placeholder?: string;
}

export default function SearchBar({
  defaultValue = "",
  placeholder = "Search…",
}: SearchBarProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = inputRef.current?.value.trim() || "";
    const qs = q ? `?q=${encodeURIComponent(q)}` : "";
    router.push(`/search${qs}`);
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
      <input
        ref={inputRef}
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
      >
        Search
      </button>
    </form>
  );
}
