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
    <div className="w-full">
      <div className="relative">
        <div className="relative flex items-center">
          <input
            type="text"
            id="search"
            className="w-full pl-4 pr-20 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyUp={handleSearch}
            placeholder="Cari layanan..."
          />
          <button
            onClick={handleButtonSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            type="button"
          >
            Cari
          </button>
        </div>
      </div>
    </div>
  );
}