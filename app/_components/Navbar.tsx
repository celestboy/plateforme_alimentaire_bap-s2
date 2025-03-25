"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useNotifications } from "../_context/NotificationContext";
import { useAuth } from "../_context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, checkAuth, logout } = useAuth();
  const { totalUnread, refreshNotifications } = useNotifications();

  useEffect(() => {
    if (isAuthenticated) {
      refreshNotifications();
    }
  }, [isAuthenticated, refreshNotifications]);

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
              href={isAuthenticated ? "/messagerie" : "/connexion"}
              className="font-futuraPTBook text-black text-lg px-5 py-2 rounded-full transition duration-300 hover:bg-base-green hover:text-white relative"
            >
              Messagerie
              {isAuthenticated && totalUnread > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalUnread > 9 ? "9+" : totalUnread}
                </span>
              )}
            </Link>
          </li>
          <li>
            <Link
              href={isAuthenticated ? "/publier-don" : "/connexion"}
              className="font-futuraPTBook text-black text-lg px-5 py-2 rounded-full transition duration-300 hover:bg-base-green hover:text-white"
            >
              Publier un don
            </Link>
          </li>
        </ul>
      </nav>

      {isAuthenticated ? (
        <div className="flex gap-3">
          <Link href={"/moncompte"}>
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
        </div>
      ) : (
        <div className="flex gap-3">
          <Link href={"/connexion"}>
            <button className="font-futuraPTBook bg-gray-200 text-gray-800 px-5 py-2 rounded-full text-sm font-semibold transition duration-300 hover:bg-gray-300">
              Connexion
            </button>
          </Link>
          <Link href={"/register"}>
            <button className="font-futuraPTBook bg-base-green text-white px-5 py-2 rounded-full text-sm font-semibold transition duration-300 hover:bg-[#084784] hover:text-white">
              Créer un compte
            </button>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
