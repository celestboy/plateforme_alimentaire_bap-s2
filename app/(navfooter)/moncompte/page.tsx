"use client";

"use client";

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import displayUserInfo from "@/actions/get-user-info";
import getUserCO2Stats from "@/actions/get-user-co2-stats";
import {
  Mail,
  Calendar1,
  LogOut,
  Trash,
  PenBox,
  Save,
  X,
  EyeOff,
  Eye,
} from "lucide-react";
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
import { toast } from "sonner";
import { UpdateParticulierSchemaType } from "@/types/forms";
import updateParticulierInfo from "@/actions/update-particulier-info";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateParticulierSchema } from "@/app/schema";

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

const fakeData = {
  totalWeightKg: 186,
  totalCO2Saved: 321,
  totalDonations: 24,
  history: [
    {
      date: "2024-11-03",
      weightKg: 12.5,
      co2Saved: 21.8,
    },
    {
      date: "2024-11-10",
      weightKg: 8.2,
      co2Saved: 14.3,
    },
    {
      date: "2024-11-17",
      weightKg: 15.7,
      co2Saved: 27.4,
    },
    {
      date: "2024-11-24",
      weightKg: 5.3,
      co2Saved: 9.2,
    },
    {
      date: "2024-12-01",
      weightKg: 10.1,
      co2Saved: 17.6,
    },
    {
      date: "2024-12-08",
      weightKg: 13.8,
      co2Saved: 24.0,
    },
    {
      date: "2024-12-15",
      weightKg: 7.9,
      co2Saved: 13.8,
    },
    {
      date: "2024-12-22",
      weightKg: 14.2,
      co2Saved: 24.7,
    },
    {
      date: "2024-12-29",
      weightKg: 9.5,
      co2Saved: 16.5,
    },
    {
      date: "2025-01-05",
      weightKg: 18.3,
      co2Saved: 31.8,
    },
    {
      date: "2025-01-12",
      weightKg: 11.2,
      co2Saved: 19.5,
    },
    {
      date: "2025-01-19",
      weightKg: 16.4,
      co2Saved: 28.5,
    },
    {
      date: "2025-01-26",
      weightKg: 9.8,
      co2Saved: 17.1,
    },
    {
      date: "2025-02-02",
      weightKg: 13.5,
      co2Saved: 23.5,
    },
    {
      date: "2025-02-09",
      weightKg: 6.8,
      co2Saved: 11.8,
    },
    {
      date: "2025-02-16",
      weightKg: 12.8,
      co2Saved: 22.3,
    },
    {
      date: "2025-02-23",
      weightKg: 8.4,
      co2Saved: 14.6,
    },
    {
      date: "2025-03-02",
      weightKg: 11.6,
      co2Saved: 20.2,
    },
  ],
};

export default function MonCompte(user: UserInfo) {
  const useFakeData = true; // Set this to true to use fake data
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
  const [formData, setFormData] = useState({ ...user });
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        // If useFakeData is true, set fake data and skip API calls

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
        if (useFakeData) {
          setCO2Stats(fakeData);
        } else {
          setCO2Stats(fetchedStats);
        }
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
  }, [user, useFakeData]);

  const handleUpdate = async (
    data: UpdateParticulierSchemaType,
    user_id: number
  ) => {
    if (!data.username || !data.email || !data.password) {
      return toast.error("Tous les champs doivent être remplis.");
    }

    try {
      setIsUpdating(false);
      const updateForm = await updateParticulierInfo(data, user_id);
      toast.success("Utilisateur modifié avec succès");
      return updateForm;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
      toast.error("Une erreur s'est produite lors de la mise à jour");
    }
  };

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

  const { handleSubmit, formState, register } =
    useForm<UpdateParticulierSchemaType>({
      resolver: zodResolver(UpdateParticulierSchema),
      defaultValues: {
        username: formData.username ?? "",
        email: formData.email,
        password: formData.password,
      },
    });

  useEffect(() => {
    setFormData({ ...user });
  }, [user]);

  useEffect(() => {
    Object.values(formState.errors).forEach((error) => {
      if (error && "message" in error) {
        toast.error(error.message as string, {
          icon: <X className="text-white" />,
          className:
            "bg-red-500 !important border border-red-200 text-white text-base",
        });
      }
    });
  }, [formState.errors]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="text-center min-h-screen flex flex-col justify-start items-center ">
        <h2 className="font-bold text-5xl text-[#B0C482] font-futuraPTBook mb-4 mt-10">
          Mon compte
        </h2>

        {/* User Info Display */}
        <div className=" w-[600px] gap-4 px-4 mt-10 flex justify-center text-xs md:text-xl">
          {isLoading ? (
            <p className="text-gray-600">Chargement des informations...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : userInfo ? (
            <>
              <div className="flex flex-col items-center gap-4 w-full">
                {isUpdating ? (
                  <div className="flex flex-col font-futuraPTBook font-extrabold text-xl uppercase">
                    <span className="ml-4">Pseudo :</span>
                    <input
                      type="text"
                      {...register("username")}
                      className="w-[600px] my-4 py-4 px-6 rounded-full border border-gray-600 text-sm"
                      required
                    />
                  </div>
                ) : (
                  <div className="text-center my-4">
                    <h3 className="font-futuraPTBold font-extrabold text-3xl uppercase">
                      {userInfo.username}
                    </h3>
                  </div>
                )}

                {isUpdating ? (
                  <div className="flex flex-col font-futuraPTBook font-extrabold text-xl uppercase">
                    <span className="ml-4">Email :</span>
                    <input
                      type="email"
                      {...register("email")}
                      className="w-[600px] my-4 py-4 px-6 rounded-full border border-gray-600 text-sm"
                      required
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 font-futuraPTMedium text-2xl">
                    <Mail width={20} height={20} />
                    <label className="">Email :</label>
                    <p className="text-gray-600">{userInfo.email}</p>
                  </div>
                )}

                {isUpdating ? (
                  <div className="flex flex-col font-futuraPTBook font-extrabold text-xl uppercase relative">
                    <span className="ml-4">Mot de passe :</span>
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      className="w-[600px] my-4 py-4 px-6 rounded-full border border-gray-600 text-sm"
                      required
                    />
                    <span
                      onClick={togglePasswordVisibility}
                      className="cursor-pointer absolute top-1/2 right-5"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </span>
                  </div>
                ) : null}

                <div className="flex-col md:flex-row flex items-center gap-2 font-futuraPTMedium text-2xl">
                  <Calendar1 width={20} height={20} />
                  <label className="font-medium">
                    Inscrit sur FoodShare depuis le :
                  </label>
                  <p className="text-gray-600">
                    {new Date(userInfo.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>

                <div>
                  {!isUpdating ? (
                    <button
                      onClick={() => setIsUpdating(true)}
                      className="mt-6 px-6 py-3 rounded-md text-white bg-base-green font-medium transition-colors flex items-center gap-2 hover:bg-[#a2b574]"
                    >
                      <PenBox />
                      Modifier le profil
                    </button>
                  ) : (
                    <form
                      onSubmit={handleSubmit((data) =>
                        handleUpdate(data, userInfo.user_id)
                      )}
                    >
                      <button className="mt-6 px-6 py-3 rounded-md text-white bg-base-green font-medium transition-colors flex items-center gap-2 hover:bg-[#a2b574]">
                        <Save />
                        Enregistrer les modifications
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-600">
              Aucune information utilisateur trouvée.
            </p>
          )}
        </div>

        <section className="relative w-screen font-futuraPTBold md:flex justify-center m-6 md:p-12">
          <article className="relative text-xl md:w-1/4 h-56 m-12 rounded-3xl bg-[#F5F5F5]">
            <h3 className="text-left absolute top-10 ml-12 md:ml-8 font-futuraPTBook text-[5rem]">
              {isLoading ? "..." : co2Stats.totalWeightKg}
            </h3>
            <p className="absolute bottom-4 right-6">Kg sauvés</p>
          </article>
          <article className="relative text-xl md:w-1/4 h-56 m-12 rounded-3xl bg-[#F5F5F5]">
            <h3 className="text-left absolute top-10 ml-12 md:ml-8 font-futuraPTBook text-[5rem]">
              {isLoading ? "..." : co2Stats.totalCO2Saved}
            </h3>
            <p className="absolute bottom-4 right-6">Kg CO2 équivalent</p>
          </article>
          <article className="relative text-xl md:w-1/4 h-56 m-12 rounded-3xl bg-[#F5F5F5]">
            <h3 className="text-left absolute top-10 ml-12 md:ml-8 font-futuraPTBook text-[5rem]">
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

        <div className="md:flex items-center justify-center gap-4 font-Montserrat my-10">
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
                    Cette action est irréversible. Êtes-vous sûr de vouloir
                    continuer ?
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
              className="w-full my-8 md:my-0 flex items-center gap-2 bg-red-600 px-6 py-2 rounded-full text-white transition-colors hover:bg-red-800"
            >
              <Trash />
              Supprimer ce compte
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
