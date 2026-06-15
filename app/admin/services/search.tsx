"use client";

import { useRouter } from "next/navigation";
import { KeyboardEvent, useState } from "react";

type Props = {
  search: string;
};

export default function Search({ search }: Props) {
  const [keyword, setKeyword] = useState<string>(search);
  const router = useRouter();

  function handleSearch(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const params = new URLSearchParams(window.location.search);

      if (keyword === "") {
        params.delete("search");
      } else {
        params.set("search", keyword);
      }

      router.push(`?${params.toString()}`);
    }
  }

  const handleButtonSearch = () => {
    const params = new URLSearchParams(window.location.search);

    if (keyword === "") {
      params.delete("search");
    } else {
      params.set("search", keyword);
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="relative max-w-md">
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        </div>
        <input
          type="text"
          id="search"
          className="input-field pl-9 pr-20"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyUp={handleSearch}
          placeholder="Cari layanan..."
        />
        <button
          onClick={handleButtonSearch}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3.5 py-1.5 bg-[#0077b6] text-white text-xs font-medium rounded-md hover:bg-[#00699e] transition-colors"
          type="button"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        </button>
      </div>
    </div>
  );
}
