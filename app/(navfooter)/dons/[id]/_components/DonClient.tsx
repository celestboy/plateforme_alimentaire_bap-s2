"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import displayUniqueDon from "@/actions/get-single-don";
import { JsonValue } from "@prisma/client/runtime/library";
import DonDisplay from "./DonDisplay";

interface Don {
  don_id: number;
  title: string;
  description: string;
  category: string;
  quantity: number;
  limit_date: Date;
  rdv_pts: JsonValue;
  publishedAt: Date;
  img_url: string;
  donneur_id: number;
}

interface Filter {
  id: number;
  type: string;
  name: string;
  value: string;
}

export default function DonClient() {
  const params = useParams();
  const [don, setDon] = useState<Don | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filter[]>([]);

  useEffect(() => {
    if (!params?.id) return;

    const fetchDon = async () => {
      setLoading(true);
      const id = Number(params.id);
      if (isNaN(id)) {
        setLoading(false);
        return;
      }
      const fetchedDon = await displayUniqueDon(id);
      setDon(fetchedDon);
      setLoading(false);
    };

    fetchDon();
  }, [params?.id]);

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

  // Convert rdv_pts values to human-readable names using filters
  const processedDon =
    don && filters.length > 0
      ? {
          ...don,
          rdv_pts: Array.isArray(don.rdv_pts)
            ? don.rdv_pts.map((point: JsonValue) => {
                const pointStr = String(point);
                const matchingFilter = filters.find(
                  (filter) => filter.value === pointStr
                );
                return matchingFilter ? matchingFilter.name : pointStr;
              })
            : don.rdv_pts,
        }
      : don;

  if (loading) return <p>Chargement...</p>;
  if (!processedDon) return <p>Aucun don trouvé.</p>;

  return <DonDisplay don={processedDon} />;
}
