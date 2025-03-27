import React from "react";
import Link from "next/link";
import { UserCircle2 } from "lucide-react";

export default function ParticulierBox() {
  return (
    <Link href={"/register/particulier"}>
      <div className="w-[300px] h-[400px] bg-dark-blue border-4 border-white rounded-xl flex flex-col items-center p-6 transition-colors hover:border-[#082f84] hover:scale-105">
        <div className="border-4 w-[250px] h-[250px] border-white rounded-xl flex items-center justify-center">
          <UserCircle2 width={200} height={200} className="text-white" />
        </div>
        <div className="my-4">
          <h2 className="text-center font-bold font-futuraPTBold uppercase text-xl text-white">
            Particulier
          </h2>
          <p className="text-center font-medium font-futuraPTBook text-white text-lg">
            Je souhaite m&apos;inscrire en tant que particulier.
          </p>
        </div>
      </div>
    </Link>
  );
}
