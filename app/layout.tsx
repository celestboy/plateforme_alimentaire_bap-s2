"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const navItems = [
  { name: "LOGO", href: "/" },
  { name: "Accueil", href: "/x" },
  { name: "Contact", href: "/y" },
  { name: "Annonces", href: "/z" },
  { name: "Je partage!", href: "/a" },
  { name: "LOGIN", href: "/b" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="fr">
      <head>
        {/* FontAwesome CDN */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col">
          <header className="fixed top-0 left-0 w-full bg-[#b0c482] flex justify-between items-center px-12 py-5 z-50">
            <a href="index.html">
              <div className="w-52">
                <img
                  src="images/logo-sharefood.png"
                  alt="Logo Gaspillage Alimentaire"
                  className="w-full h-auto"
                />
              </div>
            </a>

            <nav>
              <ul className="flex space-x-12">
                <li>
                  <a
                    href="#"
                    className="text-white text-lg px-5 py-2 rounded-full transition duration-300 hover:bg-white hover:text-black"
                  >
                    Accueil
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white text-lg px-5 py-2 rounded-full transition duration-300 hover:bg-white hover:text-black"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white text-lg px-5 py-2 rounded-full transition duration-300 hover:bg-white hover:text-black"
                  >
                    Annonces
                  </a>
                </li>
              </ul>
            </nav>

            <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold transition duration-300 hover:bg-[#084784] hover:text-white">
              Créer un compte
            </button>
          </header>

          <main className="flex-grow">{children}</main>

          <footer className="flex bottom-0 w-full bg-[#b0c482] p-8">
            <p className="mx-auto text-white">
              © 2025 Gaspillage Alimentaire - Tous droits réservés
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
