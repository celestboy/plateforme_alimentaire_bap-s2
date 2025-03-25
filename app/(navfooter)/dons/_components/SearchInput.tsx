"use client";

import React from "react";
import { Search, ArrowDown } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterClick: () => void;
  onSubmit: (event: React.FormEvent) => void;
}

const SearchInput = ({
  value,
  onChange,
  onFilterClick,
  onSubmit,
}: SearchInputProps) => {
  const router = useRouter();

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();
    // Preserve any existing category filter when searching
    const urlParams = new URLSearchParams(window.location.search);
    const currentCategory = urlParams.get("category");

    const params = new URLSearchParams();
    if (value) {
      params.set("q", value);
    }
    if (currentCategory) {
      params.set("category", currentCategory);
    }

    router.push(`/dons?${params.toString()}`);
  };

  return (
    <div className="relative z-20">
      <form onSubmit={onSubmit}>
        <span>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-600 cursor-pointer" />
        </span>
        <input
          type="text"
          value={value}
          onChange={onChange}
          className="w-[750px] h-12 rounded-full px-2 pl-12 pr-28 border border-gray-600 font-Montserrat"
          placeholder="Adresse, quartier, ..."
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-gray-600 cursor-pointer border-l border-gray-600 pl-4">
          <button
            type="button"
            className="flex gap-2 items-center"
            onClick={onFilterClick}
          >
            Filtrer <ArrowDown size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchInput;
