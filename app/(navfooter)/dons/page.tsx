"use client";

import { useEffect, useState } from "react";
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

export default function HomePage() {
  const search = useSearchParams();
  const router = useRouter();
  const searchQuery = search ? search.get("q") || "" : "";
  const [dons, setDons] = useState<Don[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    async function fetchDons() {
      setIsLoading(true);

      const data: Don[] = await getDons(searchQuery || undefined);

      setDons(data);
      setIsLoading(false);
    }

    fetchDons();
  }, [searchQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const clearSearch = () => {
    setSearchValue("");
    router.push("/dons");
  };

  return (
    <div className="text-center bg-gray-100 h-full w-screen box-border">
      <div className="text-center  overflow-x-hidden">
        <div className="relative items-center justify-center mx-auto bg-[#B0C482] p-6 font-futuraPTMedium">
          <Link href="/" className="absolute top-6 left-6 text-white">
            Retour
          </Link>

          <div className="relative flex items-center justify-center">
            <SearchInput value={searchValue} onChange={handleSearchChange} />
          </div>

          <div>
            <button onClick={clearSearch}>Réinitialiser la recherche</button>
          </div>

          <p className="mt-2 text-white">
            Cherchez des annonces selon votre localisation
          </p>
        </div>

        <div className="relative w-3/4 mx-auto">
          <h2 className="text-[#B0C482] font-futuraPTBook text-[3.5rem] my-12">
            Annonces
          </h2>

          <div
            id="articlecontainerteaser"
            className="grid grid-cols-2 justify-items-center my-2 mx-5"
          >
            {isLoading ? (
              <div className="relative w-full h-64 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-t-[#B0C482] border-gray-300 rounded-full animate-spin"></div>
              </div>
            ) : dons.length === 0 ? (
              <p className="text-2xl font-semibold text-gray-600">
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
