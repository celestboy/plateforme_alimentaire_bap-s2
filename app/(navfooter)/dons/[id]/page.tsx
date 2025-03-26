"use client";

import React from "react";
import DonClient from "./_components/DonClient";
import Link from "next/link";

export default function SingleDonPage() {
  return (
    <div className="flex flex-col font-futuraPTMedium">
      <div>
        <Link href="/dons">
          <button className="ml-12">Retour</button>
        </Link>
        <DonClient />
      </div>
    </div>
  );
}
