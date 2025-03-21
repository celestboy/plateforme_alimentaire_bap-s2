"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SearchInput from "./_components/SearchInput";
import { getDons } from "@/actions/fetch-don-by-keywords";

interface Don {
  don_id: number;
  title: string;
  description: string;
  category: string;
  quantity: number;
  limit_date: Date;
  img_url: string;
}

interface Filter {
  id: number;
  type: string;
  name: string;
  value: string;
}

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams ? searchParams.get("q") || "" : "";
  const categoryFilter = searchParams ? searchParams.get("category") || "" : "";

  const [dons, setDons] = useState<Don[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState(searchQuery);
  const filterRef = useRef<HTMLDivElement>(null); // Référence pour la div des filtres

  // Fetch filters depuis le JSON
  useEffect(() => {
    async function fetchFilters() {
      try {
        const response = await fetch("/data/filters.json");
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const data: Filter[] = await response.json();
        setFilters(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des filtres :", error);
      }
    }

    fetchFilters();
  }, []);

  // Fetch dons en fonction des filtres
  useEffect(() => {
    async function fetchDons() {
      setIsLoading(true);
      try {
        const data: Don[] = await getDons({
          query: searchQuery || undefined,
          category: categoryFilter || undefined,
        });
        setDons(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des dons :", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDons();
  }, [searchQuery, categoryFilter]);

  // Gérer la fermeture du menu au clic en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    }

    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const clearFilters = () => {
    setSearchValue("");
    router.push("/dons");
  };

  const toggleFilterMenu = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const applyFilter = (category: string) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (category) params.set("category", category);
    router.push(`/dons?${params.toString()}`);
    setIsFilterOpen(false);
  };

  return (
    <div className="text-center bg-gray-100 h-full w-screen box-border">
      <div className="text-center overflow-x-hidden">
        <div className="relative items-center justify-center mx-auto bg-[#B0C482] p-6 font-futuraPTMedium">
          <Link href="/" className="absolute top-6 left-6 text-white">
            Retour
          </Link>

          <div className="relative flex items-center justify-center">
            <SearchInput
              value={searchValue}
              onChange={handleSearchChange}
              onFilterClick={toggleFilterMenu}
            />

            {/* Menu des filtres */}
            {isFilterOpen && (
              <div
                ref={filterRef}
                className="absolute z-10 mt-4 w-[748px] p-4 bg-white ring-1 ring-black ring-opacity-5 top-3 right-1/2 transform translate-x-1/2"
              >
                <div className="py-1">
                  <div className="grid grid-cols-2 gap-4 p-4">
                    {/* Localisation */}
                    <div>
                      <h3 className="text-lg font-semibold border-b pb-2 mb-2">
                        Localisation
                      </h3>
                      {filters
                        .filter((filter) => filter.type === "location")
                        .map((filter) => (
                          <button
                            key={filter.id}
                            onClick={() => applyFilter(filter.value)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            {filter.name}
                          </button>
                        ))}
                    </div>

                    {/* Produits */}
                    <div>
                      <h3 className="text-lg font-semibold border-b pb-2 mb-2">
                        Produits
                      </h3>
                      {filters
                        .filter((filter) => filter.type === "produit")
                        .map((filter) => (
                          <button
                            key={filter.id}
                            onClick={() => applyFilter(filter.value)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            {filter.name}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-white text-[#B0C482] rounded-full hover:bg-gray-100"
            >
              Réinitialiser la recherche
            </button>
          </div>
        </div>

        <div className="relative w-3/4 mx-auto">
          <h2 className="text-[#B0C482] font-futuraPTBook text-[3.5rem] my-12">
            Annonces
          </h2>

          {(searchQuery || categoryFilter) && (
            <div className="mb-6 flex flex-wrap gap-2 justify-center">
              {searchQuery && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#B0C482] text-white">
                  Recherche: {searchQuery}
                </span>
              )}
              {categoryFilter && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#B0C482] text-white">
                  Catégorie:{" "}
                  {filters.find((f) => f.value === categoryFilter)?.name ||
                    categoryFilter}
                </span>
              )}
            </div>
          )}

          <div
            id="articlecontainerteaser"
            className="grid grid-cols-2 justify-items-center my-2 mx-5"
          >
            {isLoading ? (
              <div className="relative w-full h-64 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-t-[#B0C482] border-gray-300 rounded-full animate-spin"></div>
              </div>
            ) : dons.length === 0 ? (
              <p className="text-2xl font-semibold text-gray-600 col-span-2 my-12">
                Aucun don trouvé.
              </p>
            ) : (
              dons.map((don) => (
                <Link href={`/dons/${don.don_id}`} key={don.don_id}>
                  <div className="my-4 mx-6 bg-white rounded text-center w-[90%]">
                    <Image
                      className="inline-block w-[90%] h-64 mx-auto my-2 rounded-sm object-cover aspect-video"
                      width={512}
                      height={512}
                      src={don.img_url}
                      alt={don.title}
                    />
                    <h2 className="text-justify text-black font-semibold font-Montserrat w-[90%] text-lg py-2 pr-2 mx-auto">
                      {don.title}
                    </h2>
                    <p className="w-[90%] text-black text-justify font-Montserrat mx-auto pb-4 text-sm leading-5">
                      {don.description}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
