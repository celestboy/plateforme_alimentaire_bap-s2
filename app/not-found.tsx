"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);
  return (
    <div className="flex flex-col h-screen w-screen justify-center items-center overflow-hidden">
      <Image
        className="absolute z-[-1] bottom-[-10rem] right-0"
        src="/images/404.png"
        alt="Page introuvable"
        width={1600}
        height={900}
      ></Image>
      <div className="mb-16 flex flex-col items-center">
        <div className="flex justify-center items-center text-center gap-16">
          <h1 className="text-[9rem] font-futuraPTLight font-bold">404</h1>
          <h2 className="text-3xl font-futuraPTMedium">
            La page que vous cherchez <br></br> n&apos;existe plus ou est
            erronée
          </h2>
        </div>

        <Link href="/">
          <button className="px-5 py-3 bg-base-green text-white rounded-full transition-colors hover:bg-dark-blue">
            Retour à la page d&apos;accueil
          </button>
        </Link>
      </div>
    </div>
  );
}
