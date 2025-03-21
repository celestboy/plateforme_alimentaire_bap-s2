"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full h-20 bg-white text-black flex justify-between items-center px-12 py-5 z-50">
      <Link href={"/"}>
        <div className="w-52">
          <Image
            width={512}
            height={512}
            src="/images/logo-sharefood-full-black.png"
            alt="Logo Gaspillage Alimentaire"
          />
        </div>
      </Link>

      <nav>
        <ul className="flex space-x-8">
          <li>
            <Link
              href={"/"}
              className="font-futuraPTBook text-black text-lg px-5 py-2 rounded-full transition duration-300 hover:bg-base-green hover:text-white"
            >
              Accueil
            </Link>
          </li>
          <li>
            <Link
              href={"/contact"}
              className="font-futuraPTBook text-black text-lg px-5 py-2 rounded-full transition duration-300 hover:bg-base-green hover:text-white"
            >
              Contact
            </Link>
          </li>
          <li>
            <Link
              href={"/dons"}
              className="font-futuraPTBook text-black text-lg px-5 py-2 rounded-full transition duration-300 hover:bg-base-green hover:text-white"
            >
              Annonces
            </Link>
          </li>
          <li>
            <Link
              href={"/messagerie"}
              className="font-futuraPTBook text-black text-lg px-5 py-2 rounded-full transition duration-300 hover:bg-base-green hover:text-white"
            >
              Messagerie
            </Link>
          </li>
          <li>
            <Link
              href={"/publier-don"}
              className="font-futuraPTBook text-black text-lg px-5 py-2 rounded-full transition duration-300 hover:bg-base-green hover:text-white"
            >
              Publier un don
            </Link>
          </li>
        </ul>
      </nav>

      {isAuthenticated ? (
        <Link href={"/moncompte"}>
          <button className="font-futuraPTBook bg-base-green text-white px-5 py-2 rounded-full text-sm font-semibold transition duration-300 hover:bg-[#084784] hover:text-white">
            Mon compte
          </button>
        </Link>
      ) : (
        <Link href={"/register"}>
          <button className="font-futuraPTBook bg-base-green text-white px-5 py-2 rounded-full text-sm font-semibold transition duration-300 hover:bg-[#084784] hover:text-white">
            Créer un compte
          </button>
        </Link>
      )}
    </header>
  );
};

export default Navbar;
