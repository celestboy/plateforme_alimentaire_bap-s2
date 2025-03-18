"use client";

import Image from "next/image";
import { JsonValue } from "@prisma/client/runtime/library";

interface DonProps {
  don: {
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
  };
}

export default function DonDisplay({ don }: DonProps) {
  return (
    <div className="bg-gray-100 min-h-screen w-full p-0 m-0 box-border">
      <div className="flex justify-center gap-10">
        <div className="w-[975px]">
          <h2 className="font-Montserrat font-extrabold text-3xl">
            {don.title}
          </h2>
          <Image
            src={`${don.img_url}`}
            width={1024}
            height={1024}
            alt="Image de bannière de l'article"
            className="aspect-video w-full object-cover object-top mb-10 rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}
