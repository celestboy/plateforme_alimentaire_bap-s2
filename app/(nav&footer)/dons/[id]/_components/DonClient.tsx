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

export default function DonClient() {
  const params = useParams();
  const [don, setDon] = useState<Don | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p>Chargement...</p>;
  if (!don) return <p>Aucun don trouvé.</p>;

  return <DonDisplay don={don} />;
}
