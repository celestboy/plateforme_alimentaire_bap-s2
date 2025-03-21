"use client";

import React, { useState } from "react";
import { Search, ArrowDown } from "lucide-react";
import { useRouter } from "next/navigation";

const SearchInput = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();
    router.push(`/dons?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="relative">
      <form onSubmit={onSearch}>
        <span>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-600 cursor-pointer" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="w-[600px] h-12 rounded-full px-2 pl-12 pr-28 border border-gray-600 font-Montserrat"
          placeholder="Adresse, quartier, ..."
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-gray-600 cursor-pointer border-l border-gray-600 pl-4">
          <button className="flex gap-2 items-center">
            Filtrer <ArrowDown size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchInput;
