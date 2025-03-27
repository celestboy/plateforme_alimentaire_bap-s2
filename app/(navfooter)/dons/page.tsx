"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SearchInput from "./_components/SearchInput";
import { getDons } from "@/actions/fetch-don-by-keywords";
import { JsonValue } from "@prisma/client/runtime/library";
import { ChevronRight } from "lucide-react";

interface Don {
  don_id: number;
  title: string;
  description: string;
  category: string;
  rdv_pts: JsonValue;
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
  const rdvFilter = searchParams ? searchParams.get("rdv_pts") || "" : "";

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
          rdv_pts: rdvFilter || undefined,
        });
        setDons(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des dons :", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDons();
  }, [searchQuery, categoryFilter, rdvFilter]);

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
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);

    // Keep existing filters
    if (categoryFilter) {
      params.set("category", categoryFilter);
    }
    if (rdvFilter) {
      params.set("rdv_pts", rdvFilter);
    }

    // Update search query
    if (searchValue) {
      params.set("q", searchValue);
    } else {
      params.delete("q");
    }

    router.push(`/dons?${params.toString()}`);
  };

  const applyFilter = (filterType: string, value: string) => {
    const params = new URLSearchParams(window.location.search);

    // Keep existing search query if present
    if (searchQuery) {
      params.set("q", searchQuery);
    }

    // Update or add the new filter while keeping other filters
    if (filterType === "location") {
      params.set("rdv_pts", value);
    } else if (filterType === "produit") {
      params.set("category", value);
    }

    router.push(`/dons?${params.toString()}`);
    setIsFilterOpen(false);
  };

  return (
    <div className="text-center bg-gray-100 min-h-screen w-screen box-border pb-10">
      <div className="text-center overflow-x-hidden min-h-screen">
        <div className="relative items-center justify-center mx-auto bg-[#B0C482] p-8 font-futuraPTMedium">
          <Link href="/" className="absolute top-0 md:top-2 left-6 text-white">
            Retour
          </Link>

          <div className="relative flex items-center justify-center">
            <SearchInput
              value={searchValue}
              onChange={handleSearchChange}
              onFilterClick={toggleFilterMenu}
              onSubmit={handleSearch}
            />

            {/* Menu des filtres */}
            {isFilterOpen && (
              <div
                ref={filterRef}
                className="absolute z-10 mt-4 w-[748px] p-4 bg-white ring-1 ring-black ring-opacity-5 top-3 right-1/2 transform translate-x-1/2"
              >
                <div className="py-1">
                  <div className="grid md:grid-cols-2 gap-4 p-4">
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
                            onClick={() =>
                              applyFilter("location", filter.value)
                            }
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full md:text-left"
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
                            onClick={() => applyFilter("produit", filter.value)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full md:text-left"
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

        <div className="relative mx-12 mt-4">
          <h2 className="text-[#B0C482] font-futuraPTBook text-[3.5rem] my-12">
            Annonces
          </h2>

          {(searchQuery || categoryFilter || rdvFilter) && (
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
              {rdvFilter && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#B0C482] text-white">
                  Lieu:{" "}
                  {filters.find((f) => f.value === rdvFilter)?.name ||
                    rdvFilter}
                </span>
              )}
            </div>
          )}

          <div
            id="articlecontainerteaser"
            className="grid grid-cols-1 md:grid-cols-3 gap-10 justify-items-center my-2 mx-0 md:mx-5"
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
                  <div className=" rounded-xl">
                    <Image
                      className="w-full object-cover rounded-2xl aspect-video"
                      width={512}
                      height={512}
                      src={don.img_url}
                      alt={don.title}
                    />
                    <div className="flex items-center justify-between mt-2 mx-2">
                      <div className="flex items-center">
                        <h2 className="text-lg text-left font-futuraPTMedium mr-2">
                          {don.title}
                        </h2>
                        <ChevronRight size={20} />
                      </div>
                      <h2 className="text-base text-right font-futuraPTBook">
                        {don.limit_date.toLocaleDateString("fr-FR")}
                      </h2>
                    </div>
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
