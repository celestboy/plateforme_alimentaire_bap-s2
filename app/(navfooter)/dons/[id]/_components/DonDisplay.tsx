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
    <div className="flex h-[70vh]">
      <Image
        src={`${don.img_url}`}
        width={600}
        height={1024}
        alt="Image de bannière de l'article"
        className="aspect-video w-1/3 h-max object-cover object-top m-24 rounded-xl"
      />
      <div className="p-16 h-4/5 w-1/3 border-[3px] border-[#717171] rounded-xl absolute right-36">
        <h2 className="font-Montserrat font-extrabold text-3xl">{don.title}</h2>

        <p className="my-4">
          Date d'expiration : {don.limit_date.toLocaleDateString()}
        </p>
        <p className="my-4">Quantité : {don.quantity}</p>
        <p className="my-4">
          Lieux :{" "}
          {don.rdv_pts
            ? Array.isArray(don.rdv_pts)
              ? don.rdv_pts
                  .map((pt) =>
                    typeof pt === "object" && pt !== null
                      ? Object.values(pt).join(" ")
                      : String(pt)
                  )
                  .join(", ")
              : typeof don.rdv_pts === "object"
              ? Object.values(don.rdv_pts).join(", ")
              : String(don.rdv_pts)
            : "Non spécifié"}
        </p>

        <p className="my-4">
          Description : <br></br> {don.description}
        </p>
      </div>
    </div>
    // <div className="bg-gray-100 min-h-screen w-full p-0 m-0 box-border">
    //   <div className="flex justify-center gap-10">
    //     <div className="w-[975px]">
    //       <h2 className="font-Montserrat font-extrabold text-3xl">
    //         {don.title}
    //       </h2>
    //       <Image
    //         src={`${don.img_url}`}
    //         width={1024}
    //         height={1024}
    //         alt="Image de bannière de l'article"
    //         className="aspect-video w-full object-cover object-top mb-10 rounded-xl"
    //       />
    //     </div>
    //   </div>
    // </div>
  );
}
