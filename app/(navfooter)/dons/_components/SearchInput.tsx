"use client";

import React from "react";
import { Search, ArrowDown } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput = ({ value, onChange }: SearchInputProps) => {
  const router = useRouter();

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();
    router.push(`/dons?q=${encodeURIComponent(value)}`);
  };

  return (
    <div className="relative">
      <form onSubmit={onSearch}>
        <span>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-600 cursor-pointer" />
        </span>
        <input
          type="text"
          value={value} // 🔥 Utilise la valeur passée en prop
          onChange={onChange} // 🔥 Utilise la fonction passée en prop
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
