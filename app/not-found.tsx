"use client"

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
    <div className="flex flex-col h-screen justify-center items-center pr-44 pb-44">
      <Image
        className="absolute z-[-1] bottom-[-5rem] right-0"
        src="/images/404.png"
        alt="Page introuvable"
        width={1600}
        height={900}
      ></Image>
      <div className="flex justify-center items-center text-center">
        <h1 className="text-[9rem] mr-16 font-futuraPTLight font-bold">404</h1>
        <h2 className="text-3xl font-futuraPTMedium mt-4">
          La page que vous cherchez <br></br> n’existe plus ou est erronée
        </h2>
      </div>

      <Link href="/">
        <button className="mt-6 ml-72 px-6 py-3 bg-[#B0C482] text-white rounded-full hover:bg-[#bad086]">
          Retour à la page d'accueil
        </button>
      </Link>
    </div>
  );
}
