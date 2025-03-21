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
    <header className="fixed top-0 left-0 w-full h-20 bg-[#b0c482] flex justify-between items-center px-12 py-5 z-50">
      <Link href={"/"}>
        <div className="w-52">
          <Image
            width={208}
            height={208}
            src="/images/logo-sharefood.png"
            alt="Logo Gaspillage Alimentaire"
          />
        </div>
      </Link>

      <nav>
        <ul className="flex space-x-12">
          <li>
            <Link
              href={"/"}
              className="text-white text-lg px-5 py-2 rounded-full transition duration-300 hover:bg-white hover:text-black"
            >
              Accueil
            </Link>
          </li>
          <li>
            <Link
              href={"/contact"}
              className="text-white text-lg px-5 py-2 rounded-full transition duration-300 hover:bg-white hover:text-black"
            >
              Contact
            </Link>
          </li>
          <li>
            <Link
              href={"/dons"}
              className="text-white text-lg px-5 py-2 rounded-full transition duration-300 hover:bg-white hover:text-black"
            >
              Annonces
            </Link>
          </li>
        </ul>
      </nav>

      {isAuthenticated ? (
        <Link href={"/moncompte"}>
          <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold transition duration-300 hover:bg-[#084784] hover:text-white">
            Mon compte
          </button>
        </Link>
      ) : (
        <Link href={"/register"}>
          <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold transition duration-300 hover:bg-[#084784] hover:text-white">
            Créer un compte
          </button>
        </Link>
      )}
    </header>
  );
};

export default Navbar;
