"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useNotifications } from "../_context/NotificationContext";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useAuth } from "../_context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, checkAuth, logout } = useAuth();
  const { totalUnread, refreshNotifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const menuItems = [
    { href: "/", label: "Accueil" },
    { href: "/contact", label: "Contact" },
    { href: "/dons", label: "Annonces" },
    { href: isAuthenticated ? "/messagerie" : "/connexion", label: "Messagerie" },
    { href: isAuthenticated ? "/publier-don" : "/connexion", label: "Publier un don" },
  ];
  // Additional auth check on component mount and visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkAuth();
        if (isAuthenticated) {
          refreshNotifications();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [checkAuth, isAuthenticated, refreshNotifications]);

  // Check notifications periodically if authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const notificationInterval = setInterval(() => {
      refreshNotifications();
    }, 60000); // Check every minute

    return () => clearInterval(notificationInterval);
  }, [isAuthenticated, refreshNotifications]);

  return (
    <header className="fixed top-0 left-0 w-full h-20 bg-white text-black flex justify-between items-center px-6 md:px-12 py-5 z-50 shadow-md">
      <Link href="/">
        <div className="w-40 md:w-52">
          <Image
            width={512}
            height={512}
            src="/images/logo-sharefood-full-black.png"
            alt="Logo Gaspillage Alimentaire"
          />
        </div>
      </Link>

      {/* Menu burger (visible en mobile) */}
      <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Navigation Desktop */}
      <nav className="hidden md:flex">
        <ul className="flex space-x-8">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className="font-futuraPTBook text-black text-lg px-5 py-2 rounded-full transition duration-300 hover:bg-base-green hover:text-white"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Navigation Mobile */}
      {isOpen && (
        <motion.nav
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="absolute top-20 right-0 w-64 bg-white shadow-lg py-5 flex flex-col space-y-4 items-center md:hidden"
        >
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="font-futuraPTBook text-black text-lg px-5 py-2 rounded-full transition duration-300 hover:bg-base-green hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </motion.nav>
      )}

      {/* Bouton Connexion/Compte */}
      <div className="hidden md:flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <Link href="/moncompte">
              <button className="font-futuraPTBook bg-base-green text-white px-5 py-2 rounded-full text-sm font-semibold transition duration-300 hover:bg-[#084784] hover:text-white">
                Mon compte
              </button>
            </Link>
            <button
              onClick={logout}
              className="font-futuraPTBook bg-gray-200 text-gray-800 px-5 py-2 rounded-full text-sm font-semibold transition duration-300 hover:bg-gray-300"
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link href="/connexion">
              <button className="font-futuraPTBook bg-gray-200 text-gray-800 px-5 py-2 rounded-full text-sm font-semibold transition duration-300 hover:bg-gray-300">
                Connexion
              </button>
            </Link>
            <Link href="/register">
              <button className="font-futuraPTBook bg-base-green text-white px-5 py-2 rounded-full text-sm font-semibold transition duration-300 hover:bg-[#084784] hover:text-white">
                Créer un compte
              </button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};



export default Navbar;