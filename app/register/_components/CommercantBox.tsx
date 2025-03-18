import React from "react";
import Link from "next/link";
import { ShoppingBasket } from "lucide-react";

export default function CommercantBox() {
  return (
    <Link href={"/register/commercant"}>
      <div className="w-[300px] h-[400px] bg-vivid-red border-4 border-white rounded-xl flex flex-col items-center p-6">
        <div className="border-4 w-[250px] h-[250px] border-white rounded-xl flex items-center justify-center">
          <ShoppingBasket width={200} height={200} className="text-white" />
        </div>
        <div className="my-4">
          <h2 className="text-center font-bold font-futuraPTBold uppercase text-xl text-white">
            Commerçant
          </h2>
          <p className="text-center font-medium font-futuraPTBook text-white text-lg">
            Je souhaite m&apos;inscrire en tant que commerçant.
          </p>
        </div>
      </div>
    </Link>
  );
}
