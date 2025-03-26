"use client";

"use client";

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import displayUserInfo from "@/actions/get-user-info";
import getUserCO2Stats from "@/actions/get-user-co2-stats";
import { Mail, Calendar1, LogOut, Trash } from "lucide-react";
import deleteAccount from "@/actions/delete-account";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

// Enregistrement des composants Chart.js nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);
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

interface CO2Stats {
  totalWeightKg: number;
  totalCO2Saved: number;
  totalDonations: number;
  history?: {
    date: string;
    weightKg: number;
    co2Saved: number;
  }[];
}

interface JwtPayload {
  userId: number;
  email: string;
  exp: number;
}

export default function MonCompte() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [co2Stats, setCO2Stats] = useState<CO2Stats>({
    totalWeightKg: 0,
    totalCO2Saved: 0,
    totalDonations: 0,
    history: [],
  });
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

        // Fetch user info and CO2 stats simultaneously
        const [fetchedInfos, fetchedStats] = await Promise.all([
          displayUserInfo(userId),
          getUserCO2Stats(userId),
        ]);

        setUserInfo(fetchedInfos);
        setCO2Stats(fetchedStats);
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
  }, []);

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
              {isLoading ? "..." : co2Stats.totalWeightKg}
            </h3>
            <p className="absolute bottom-4 right-6">Kg sauvés</p>
          </article>
          <article className="relative text-xl w-1/4 h-56 m-12 rounded-3xl bg-[#F5F5F5]">
            <h3 className="text-left ml-8 mt-20 font-futuraPTBook text-[5rem]">
              {isLoading ? "..." : co2Stats.totalCO2Saved}
            </h3>
            <p className="absolute bottom-4 right-6">Kg CO2 équivalent</p>
          </article>
          <article className="relative text-xl w-1/4 h-56 m-12 rounded-3xl bg-[#F5F5F5]">
            <h3 className="text-left ml-8 mt-20 font-futuraPTBook text-[5rem]">
              {isLoading ? "..." : co2Stats.totalDonations}
            </h3>
            <p className="absolute bottom-4 right-6">Nombre de dons</p>
          </article>
        </section>

        {/* Section des graphiques */}
        <section className="w-full px-10 mb-10">
          <h2 className="font-bold text-3xl text-[#B0C482] font-futuraPTBook mb-6">
            Évolution de votre impact
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Graphique linéaire */}
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-gray-700">
                Évolution à travers le temps
              </h3>
              {co2Stats.history && co2Stats.history.length > 0 ? (
                <Line
                  data={{
                    labels: co2Stats.history.map((item) =>
                      format(parseISO(item.date), "dd MMM yyyy", { locale: fr })
                    ),
                    datasets: [
                      {
                        label: "Poids sauvé (kg)",
                        data: co2Stats.history.map((item) => item.weightKg),
                        borderColor: "#B0C482",
                        backgroundColor: "rgba(176, 196, 130, 0.2)",
                        tension: 0.3,
                      },
                      {
                        label: "CO2 économisé (kg)",
                        data: co2Stats.history.map((item) => item.co2Saved),
                        borderColor: "#5C8D89",
                        backgroundColor: "rgba(92, 141, 137, 0.2)",
                        tension: 0.3,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        position: "top",
                      },
                      title: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: "Kilogrammes",
                        },
                      },
                      x: {
                        title: {
                          display: true,
                          text: "Date",
                        },
                      },
                    },
                  }}
                />
              ) : (
                <div className="flex justify-center items-center h-64 text-gray-500">
                  Pas assez de données pour afficher un graphique
                </div>
              )}
            </div>

            {/* Graphique circulaire */}
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-gray-700">
                Répartition de votre impact
              </h3>
              {co2Stats.totalWeightKg > 0 || co2Stats.totalCO2Saved > 0 ? (
                <div className="flex justify-center">
                  <div style={{ maxWidth: "400px" }}>
                    <Pie
                      data={{
                        labels: [
                          "Poids d'aliments sauvés (kg)",
                          "CO2 économisé (kg)",
                        ],
                        datasets: [
                          {
                            data: [
                              co2Stats.totalWeightKg,
                              co2Stats.totalCO2Saved,
                            ],
                            backgroundColor: [
                              "rgba(176, 196, 130, 0.8)",
                              "rgba(92, 141, 137, 0.8)",
                            ],
                            borderColor: ["#B0C482", "#5C8D89"],
                            borderWidth: 1,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: "bottom",
                          },
                          tooltip: {
                            callbacks: {
                              label: function (context) {
                                const label = context.label || "";
                                const value = context.parsed || 0;
                                return `${label}: ${value} kg`;
                              },
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center h-64 text-gray-500">
                  Pas assez de données pour afficher un graphique
                </div>
              )}
            </div>
          </div>
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
