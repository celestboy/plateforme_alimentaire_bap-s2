import displayDons from "@/actions/displayDons";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";

interface Don {
  don_id: number;
  title: string;
  description: string;
  category: string;
  img_url: string;
}

export default function DisplayLastThree() {
  const [isLoading, setIsLoading] = useState(false);
  const [dons, setDons] = useState<Don[]>([]);

  const selectLastDons = (dons: Don[]) => {
    return dons.slice(-3).reverse(); // Prend les 3 derniers et les met dans l'ordre du plus récent au plus ancien
  };

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const fetchedDons = await displayDons();
      setDons(selectLastDons(fetchedDons));
    } catch (error) {
      console.error("Erreur lors de la récupération des articles :", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div>
      {isLoading ? (
        <p>Chargement...</p>
      ) : (
        <div className="flex gap-3">
          {dons.length === 0 ? (
            <p>Aucun article disponible.</p>
          ) : (
            dons.map((don) => (
              <Link href={`/dons/${don.don_id}`} key={don.don_id}>
                <div className="bg-white border border-stone-200 shadow-xl rounded-xl p-4 w-[400px]">
                  <Image
                    className="w-full object-cover rounded-md aspect-video"
                    width={512}
                    height={512}
                    src={don.img_url}
                    alt={don.title}
                  />
                  <h2 className="text-[0.7rem] font-Montserrat font-semibold mt-2">
                    {don.title}
                  </h2>
                  <p>{don.description}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
