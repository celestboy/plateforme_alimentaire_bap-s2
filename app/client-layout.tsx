"use client";

import Link from "next/link";
import Image from "next/image";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 w-full bg-[#b0c482] flex justify-between items-center px-12 py-5 z-50">
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

        <Link href={"/register"}>
          <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold transition duration-300 hover:bg-[#084784] hover:text-white">
            Créer un compte
          </button>
        </Link>
      </header>

      <main className="flex-grow">{children}</main>

      <footer className="flex bottom-0 w-full bg-[#b0c482] p-8">
        <p className="mx-auto text-white">
          © 2025 Gaspillage Alimentaire - Tous droits réservés
        </p>
      </footer>
    </div>
  );
}
