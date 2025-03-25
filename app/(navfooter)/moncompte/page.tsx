"use client";

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import displayUserInfo from "@/actions/get-user-info";
import { Mail, Calendar1, LogOut, Trash } from "lucide-react";
import deleteAccount from "@/actions/delete-account";

interface UserInfo {
  user_id: number;
  user_type: string;
  username: string | null;
  commerce_name: string | null;
  adresse_commerce: string | null;
  email: string;
  password: string;
  createdAt: Date;
}

interface JwtPayload {
  userId: number;
  email: string;
  exp: number;
}

export default function MonCompte() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const isTokenExpired = (token: string): boolean => {
    try {
      const decodedToken = jwtDecode<JwtPayload>(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken.exp < currentTime;
    } catch (error) {
      console.log(error);
      return true;
    }
  };

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          window.location.href = "/connexion";
          throw new Error("Aucun token d'authentification trouvé");
        }

        if (isTokenExpired(token)) {
          window.location.href = "/connexion";
          throw new Error("Le token a expiré");
        }

        const decodedToken = jwtDecode<JwtPayload>(token);
        const userId = decodedToken.userId;

        setIsLoading(true);
        const fetchedInfos = await displayUserInfo(userId);
        setUserInfo(fetchedInfos);
        setIsLoading(false);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur de récupération des informations";

        setError(errorMessage);
        setIsLoading(false);
        console.error(err);
      }
    };

    fetchInfo();
  }, []); // Pas de dépendance car on veut charger une seule fois

  const deleteAccountFunction = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/connexion";
        throw new Error("Aucun token d'authentification trouvé");
      }

      if (isTokenExpired(token)) {
        window.location.href = "/connexion";
        throw new Error("Le token a expiré");
      }

      const decodedToken = jwtDecode<JwtPayload>(token);
      const userId = decodedToken.userId;

      await deleteAccount(userId);
      localStorage.removeItem("token");
      window.location.href = "/register";
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors de la suppression de compte";
      setError(errorMessage);
      setIsLoading(false);
      console.error(err);
    }
  };

  const logOutFunction = async () => {
    try {
      localStorage.removeItem("token");
      window.location.href = "/connexion";
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors de la déconnexion";
      setError(errorMessage);
      setIsLoading(false);
      console.error(err);
    }
  };

  return (
    <>
      <div className="text-center h-screen flex flex-col justify-start items-center">
        <h2 className="font-bold text-5xl text-[#B0C482] font-futuraPTBook mb-4 mt-10">
          Mon compte
        </h2>

        <section className="relative w-screen font-futuraPTBold flex justify-center m-6 p-12">
          <article className="relative text-xl w-1/4 h-56 m-12 rounded-3xl bg-[#F5F5F5]">
            <h3 className="text-left ml-8 mt-20 font-futuraPTBook text-[5rem]">
              00
            </h3>
            <p className="absolute bottom-4 right-6">Kg sauvés</p>
          </article>
          <article className="relative text-xl w-1/4 h-56 m-12 rounded-3xl bg-[#F5F5F5]">
            <h3 className="text-left ml-8 mt-20 font-futuraPTBook text-[5rem]">
              00
            </h3>
            <p className="absolute bottom-4 right-6">Kg CO2 équivalent</p>
          </article>
          <article className="relative text-xl w-1/4 h-56 m-12 rounded-3xl bg-[#F5F5F5]">
            <h3 className="text-left ml-8 mt-20 font-futuraPTBook text-[5rem]">
              00
            </h3>
            <p className="absolute bottom-4 right-6">Nombre de dons</p>
          </article>
        </section>

        {/* User Info Display */}
        <div className="w-full gap-4 px-4 my-10">
          {isLoading ? (
            <p className="text-gray-600">Chargement des informations...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : userInfo ? (
            <>
              <div className="flex gap-4">
                <div className="flex flex-col items-center justify-center gap-2 font-Montserrat p-4 bg-white rounded-xl shadow-xl">
                  <div className="text-center my-4">
                    <h3 className="uppercase font-Montserrat font-bold text-2xl">
                      {userInfo.username}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail width={20} height={20} />
                    <label className="font-medium">Email :</label>
                    <p>{userInfo.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar1 width={20} height={20} />
                    <label className="font-medium">
                      Inscrit sur FoodShare depuis le :
                    </label>
                    <p>
                      {new Date(userInfo.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>

                  <div>
                    <button type="button">Modifier ce profil</button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 font-Montserrat my-10">
                <div className="bg-white text-red-600 border-2 border-red-600 px-6 py-2 rounded-full flex items-center gap-2 transition-colors hover:bg-gray-100">
                  <LogOut className="" />
                  <button type="button" onClick={logOutFunction} className="">
                    Se déconnecter
                  </button>
                </div>
                <div className="">
                  {isPopupOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                      <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                          Supprimer le compte ?
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Cette action est irréversible. Êtes-vous sûr de
                          vouloir continuer ?
                        </p>
                        <div className="flex justify-center gap-4">
                          <button
                            onClick={() => setIsPopupOpen(false)}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg transition-colors hover:bg-gray-500 hover:text-white"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={() => {
                              deleteAccountFunction();
                              setIsPopupOpen(false);
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg transition-colors hover:bg-red-800"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsPopupOpen(true)}
                    className="flex items-center gap-2 bg-red-600 px-6 py-2 rounded-full text-white transition-colors hover:bg-red-800"
                  >
                    <Trash />
                    Supprimer ce compte
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-600">
              Aucune information utilisateur trouvée.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
