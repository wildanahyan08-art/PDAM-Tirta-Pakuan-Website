"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface SearchProps {
  search?: string;
}

export default function Search({ search = "" }: SearchProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== search) {
        const params = new URLSearchParams();
        if (searchTerm) {
          params.set("search", searchTerm);
        }
        router.push(`/admin/customers?${params.toString()}`);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, router, search]);

  return (
    <div className="relative max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="input-field pl-9 pr-9"
        placeholder="Cari customer berdasarkan nama, email, telepon..."
      />
      {searchTerm && (
        <button
          onClick={() => {
            setSearchTerm("");
            router.push("/admin/customers");
          }}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      )}
    </div>
  );
}
