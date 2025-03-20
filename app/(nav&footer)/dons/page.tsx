"use client";

import displayDons from "@/actions/displayDons";
import fetchDonsbyLocation from "@/actions/displayDonsbyLocation";
import { JsonValue } from "@prisma/client/runtime/library";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Filter, ListRestart } from "lucide-react";

interface Don {
  don_id: number;
  title: string;
  description: string;
  category: string;
  quantity: number;
  limit_date: Date;
  rdv_pts: JsonValue;
  img_url: string;
}

interface Lieu {
  id: number;
  lieu: string;
  value: string;
}

export default function HomePage() {
  const [dons, setDons] = useState<Don[]>([]);
  const [filters, setFilters] = useState<Lieu[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAndDisplayDons = async (lieu?: string) => {
    try {
      setIsLoading(true);
      const dons = lieu ? await fetchDonsbyLocation(lieu) : await displayDons();
      setDons(dons);
    } catch (error) {
      console.error("Erreur lors de la récupération des dons :", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await fetch("/data/rdv-pts.json");
      console.log(response);
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const data: Lieu[] = await response.json();
      console.log(data);
      setFilters(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des lieux :", error);
    }
  };

  useEffect(() => {
    fetchLocations();
    const queryParams = new URLSearchParams(window.location.search);
    const filterfromURL = queryParams.get("lieu");
    fetchAndDisplayDons(filterfromURL || undefined);
  }, []);

  const handleFilterClick = (lieu: string) => {
    window.location.href = `/dons?lieu=${encodeURIComponent(lieu)}`;
  };

  const resetFilters = () => {
    fetchAndDisplayDons();
    window.location.href = "/dons";
  };

  return (
    <div className="text-center bg-gray-100 h-full w-screen box-border">
      <div className="text-center">
        <div className="relative items-center justify-center mx-auto bg-[#B0C482] p-12 font-futuraPTMedium">

          <Link href="/" className="absolute top-6 left-6 text-white">
            Retour
          </Link>

          <div className="relative flex items-center justify-center">
            <input
              type="text"
              id="mainsearchbox"
              className="w-1/2 h-12 rounded-full py-2 pl-16 pr-12 border border-gray-600 font-Montserrat"
              placeholder="Adresse, quartier, ..."
            />
            <span>
              <Search className="absolute left-[27%] top-1/2 -translate-y-1/2 text-lg text-gray-600 cursor-pointer" />
            </span>
          </div>

          <button className="absolute top-[33%] right-[22%]">
            Filtres
          </button>

          <p className="mt-2 text-white">
            Cherchez des annonces selon votre localisation
          </p>
        </div>

        <div className="relative w-3/4 mx-auto">
          <h2 className="text-[#B0C482] font-futuraPTBook text-[3.5rem] my-12">Annonces</h2>
          {/* <div className="text-left relative">
            <div
              className="inline-flex items-center ml-12 transition-all cursor-pointer"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <p className="text-base font-Montserrat hover:underline">
                Filtrer les résultats
              </p>
              <Filter size={32} className="pt-1 px-2" />
            </div>
            <div
              className="inline-flex items-center ml-12 transition-all bg-aja-blue text-white py-2 px-4 rounded-2xl hover:cursor-pointer hover:bg-white hover:text-aja-blue hover:border hover:border-aja-blue"
              onClick={resetFilters}
            >
              <p className="text-base font-Montserrat">
                Réinitialiser les filtres
              </p>
              <ListRestart size={32} className="pt-1 px-2" />
            </div>

            {isFilterOpen && (
              <div
                className="bg-white my-4 w-full rounded-2xl text-center grid grid-cols-4"
                id="filteroptions"
              >
                {filters.map((filter) => (
                  <div
                    key={filter.value}
                    className="py-4 w-[95%] mx-auto my-2 rounded-lg cursor-pointer bg-white justify-self-center transition-all hover:bg-aja-blue hover:text-white"
                    onClick={() => handleFilterClick(filter.value)}
                  >
                    <p className="option font-Montserrat">{filter.lieu}</p>
                  </div>
                ))}
              </div>
            )}
          </div> */}

          <div
            id="articlecontainerteaser"
            className="grid grid-cols-2 justify-items-center my-2 mx-5"
          >
            {isLoading ? (
              <div className="relative w-full h-64 flex items-center justify-center">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-8 rounded-full border-t-8 border-white border-t-aja-blue animate-spin"></div>
              </div>
            ) : dons.length === 0 ? (
              <div id="nodonfound" className="w-screen">
                <p className="flex items-center justify-center text-5xl font-bold text-center">
                  Aucun don trouvé.
                </p>
              </div>
            ) : (
              dons.map((don, index) => (
                <Link href={`/dons/${don.don_id}`} key={index}>
                  <div className="my-4 mx-6 bg-white rounded text-center w-[90%]">
                    <Image
                      className="inline-block w-[90%] h-64 mx-auto my-2 rounded-sm object-cover aspect-video"
                      width={512}
                      height={512}
                      src={`${don.img_url}`}
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
