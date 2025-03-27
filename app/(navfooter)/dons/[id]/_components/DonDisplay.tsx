"use client";

import Image from "next/image";
import { JsonValue } from "@prisma/client/runtime/library";
import { useAuth } from "@/app/_context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CreateChat from "@/actions/create-chat";
import { socket } from "@/lib/socketClient";
import { toast } from "sonner";
import { PenBox, Save, Trash2, X } from "lucide-react";
import deleteDon from "@/actions/delete-don";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateDonSchemaType } from "@/types/forms";
import { UpdateDonSchema } from "@/app/schema";
import updateDonForm from "@/actions/update-don-info";

interface LocationDataItem {
  type: string;
  value: string;
  name: string;
}

interface DonProps {
  don: {
    don_id: number;
    title: string;
    description: string;
    category: string;
    quantity: number;
    limit_date: Date;
    rdv_pts: JsonValue;
    publishedAt: Date;
    img_url: string;
    donneur_id: number;
    donneur: {
      pseudo: string;
    };
  };
}

interface RdvPts {
  id: number;
  type: string;
  name: string;
  value: string;
}

function useLieuxRendezVous(rdvPts: string[], initialCheckedPoints: string[]) {
  const [lieuxTraites, setLieuxTraites] = useState<string[]>([]);
  const [checkedPoints, setCheckedPoints] =
    useState<string[]>(initialCheckedPoints);

  useEffect(() => {
    async function fetchLieux() {
      try {
        const response = await fetch("/data/filters.json");
        const data: LocationDataItem[] = await response.json();

        const nomsResolus = rdvPts.map((point) => {
          const lieu = data.find((item) => item.value === point);
          return lieu ? lieu.name : `${point}`;
        });

        setLieuxTraites(nomsResolus);

        // Initialiser checkedPoints avec les points de rendez-vous passés
        setCheckedPoints(rdvPts);
      } catch (error) {
        console.error("Erreur lors du chargement des lieux :", error);
        setLieuxTraites(rdvPts); // En cas d'erreur, on garde les valeurs brutes
      }
    }

    fetchLieux();
  }, [rdvPts]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setCheckedPoints((prevCheckedPoints) => {
      if (checked) {
        return [...prevCheckedPoints, value]; // Ajoute le lieu aux checkedPoints
      } else {
        return prevCheckedPoints.filter((point) => point !== value); // Retire le lieu des checkedPoints
      }
    });
  };

  return { lieuxTraites, checkedPoints, handleCheckboxChange };
}

export default function DonDisplay({ don }: DonProps) {
  const { isAuthenticated, userId } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({ ...don });
  const [rdvpts, setRdvpts] = useState([]);

  const initialCheckedPoints = don.rdv_pts
    ? (don.rdv_pts as string[]).map((point) => point.toString()) // S'assurer que les points sont en format string
    : [];

  const { lieuxTraites, checkedPoints, handleCheckboxChange } =
    useLieuxRendezVous(don.rdv_pts as string[], initialCheckedPoints);

  const handleContactDonneur = async () => {
    if (!isAuthenticated) {
      toast.error("Vous devez être connecté pour contacter le donneur");
      router.push("/connexion");
      return;
    }

    if (userId === don.donneur_id) {
      toast.error("Vous ne pouvez pas vous contacter vous-même");
      return;
    }

    setIsLoading(true);

    try {
      const data = {
        donneur_id: don.donneur_id,
        receveur_id: userId!,
        don_id: don.don_id,
      };

      const result = await CreateChat(data);

      if (!result.success) {
        toast.error("Vous avez déjà une conversation pour ce don");
        router.push("/messagerie");
        return;
      }

      if (result.success && result.donneurId && result.receveurId) {
        socket.emit("new_chat_created", {
          donneur_id: data.donneur_id,
          receveur_id: data.receveur_id,
          chat_id: result.chatId,
          don_id: data.don_id,
        });

        toast.success("Conversation créée avec succès");
        router.push("/messagerie");
      } else {
        toast.error("Erreur lors de la création de la conversation");
      }
    } catch (error) {
      console.error("Erreur lors de la création du chat:", error);
      toast.error("Une erreur s'est produite");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data: UpdateDonSchemaType, don_id: number) => {
    if (
      !data.title ||
      !data.description ||
      !data.category ||
      !data.quantity ||
      !data.limit_date ||
      !data.rdv_pts
    ) {
      return toast.error("Tous les champs doivent être remplis.");
    }

    try {
      setIsUpdating(false);
      const updateForm = await updateDonForm(data, don_id);
      toast.success("Don modifié avec succès");
      return updateForm;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du don :", error);
      toast.error("Une erreur s'est produite lors de la mise à jour");
    }
  };

  const handleDeleteDon = async (don_id: number) => {
    try {
      const donDelete = await deleteDon(don_id);
      router.push("/");
      return donDelete;
    } catch (error) {
      console.error("Erreur lors de la suppression du don :", error);
      toast.error("Une erreur s'est produite lors de la suppression");
    }
  };

  useEffect(() => {
    setFormData({ ...don });
  }, [don]);

  const { handleSubmit, formState, register } = useForm<UpdateDonSchemaType>({
    resolver: zodResolver(UpdateDonSchema),
    defaultValues: {
      title: formData.title,
      description: formData.description,
      category: formData.category as
        | "produits-frais"
        | "produits-secs"
        | "conserves"
        | "produits-surgeles"
        | "produits-boulangerie"
        | "boissons"
        | "autres-produits"
        | undefined,
      quantity: formData.quantity,
      limit_date:
        formData.limit_date instanceof Date
          ? formData.limit_date.toISOString() // Keep the full ISO string
          : formData.limit_date,
      rdv_pts: Array.isArray(formData.rdv_pts)
        ? formData.rdv_pts.map((point) => point?.toString())
        : undefined,
    },
  });

  useEffect(() => {
    fetch("/data/filters.json")
      .then((response) => response.json())
      .then((data) => setRdvpts(data))
      .catch((error) =>
        console.error(
          "Erreur lors du chargement des points de rendez-vous :",
          error
        )
      );
  }, [formState.errors]);

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

  return (
    <div className="flex">
      <div className="flex flex-col justify-start items-center w-1/2 m-10">
        <Image
          src={`${don.img_url}`}
          width={512}
          height={512}
          alt="Image de bannière de l'article"
          className="aspect-video object-cover rounded-xl"
        />
      </div>
      <div className="flex flex-col w-1/2 m-10">
        <div className="p-8 border-[3px] border-[#BEBEBE] rounded-xl right-36 bg-white">
          {isUpdating ? (
            <div className="flex flex-col">
              <span className="ml-4">Nom du don :</span>
              <input
                type="text"
                {...register("title")}
                className="w-full my-4 py-4 px-6 rounded-full border border-gray-600 text-sm"
                required
              />
            </div>
          ) : (
            <h2 className="font-futuraPTBook font-extrabold text-3xl">
              {don.title}
            </h2>
          )}

          <p className={`my-4 ${isUpdating ? "ml-4" : ""}`}>
            Date de publication :{" "}
            <span className="text-[#7F7F7F] font-futuraPTMedium">
              {don.publishedAt.toLocaleDateString("fr-FR")}
            </span>
          </p>

          {isUpdating ? (
            <div className="flex flex-col">
              <span className="ml-4">Date d&apos;expiration :</span>
              <input
                type="date"
                {...register("limit_date", {
                  validate: (value) => {
                    const date = new Date(value);
                    return !isNaN(date.getTime()) && date > new Date()
                      ? true
                      : "Date invalide ou passée";
                  },
                })}
                className="w-full my-4 py-4 px-6 rounded-full border border-gray-600 text-sm"
                required
              />
            </div>
          ) : (
            <p className="my-4">
              Date d&apos;expiration :{" "}
              <span className="text-[#7F7F7F]">
                {new Date(don.limit_date).toLocaleDateString("fr-FR")}
              </span>
            </p>
          )}

          {isUpdating ? (
            <div className="flex flex-col">
              <span className="ml-4">Catégorie :</span>
              <select
                {...register("category")}
                className="w-full my-4 py-4 px-6 rounded-full border border-gray-600 text-sm"
                required
              >
                <option value="">
                  Veuillez séléctionner la catégorie du produit
                </option>
                <option value="produits-frais">Produits frais</option>
                <option value="produits-secs">Produits secs</option>
                <option value="conserves">Conserves</option>
                <option value="produits-surgeles">Produits surgelés</option>
                <option value="produits-boulangerie">
                  Produits de boulangerie
                </option>
                <option value="boissons">Boissons</option>
                <option value="autres-produits">Autres produits</option>
              </select>
            </div>
          ) : (
            <p className="my-4">
              Catégorie : <span className="text-[#7F7F7F]">{don.category}</span>
            </p>
          )}

          {isUpdating ? (
            <div className="flex flex-col">
              <span className="ml-4">Quantité :</span>
              <input
                type="number"
                {...register("quantity")}
                className="w-full my-4 py-4 px-6 rounded-full border border-gray-600 text-sm"
                required
              />
            </div>
          ) : (
            <p className="my-4">
              Quantité : <span className="text-[#7F7F7F]">{don.quantity}</span>
            </p>
          )}

          {isUpdating ? (
            <div>
              <span className="ml-4">Points de rendez-vous :</span>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                }}
                className="bg-white rounded-2xl border p-2 border-gray-600 my-4 text-xs md:text-sm"
              >
                {rdvpts
                  .filter((point: RdvPts) => point.type === "location")
                  .map((point: RdvPts) => (
                    <div
                      key={point.id}
                      className="relative pl-2 cursor-pointer flex items-center"
                    >
                      <input
                        type="checkbox"
                        value={point.value}
                        checked={checkedPoints.includes(point.value)}
                        {...register("rdv_pts", {
                          onChange: handleCheckboxChange,
                        })}
                        className="my-4 mx-2"
                        required
                      />
                      <label
                        htmlFor={`checkbox`}
                        className="cursor-pointer text-black"
                      >
                        {point.name}
                      </label>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <p className="my-4">
              Lieu(x) :{" "}
              <span className="text-[#7F7F7F]">{lieuxTraites.join(", ")}</span>
            </p>
          )}

          {isUpdating ? (
            <div className="flex flex-col">
              <span className="ml-4">Description :</span>
              <input
                type="text"
                {...register("description")}
                className="w-full my-4 py-4 px-6 rounded-full border border-gray-600 text-sm"
                required
              />
            </div>
          ) : (
            <p className="my-4">
              Description : <br></br>{" "}
              <span className="text-[#7F7F7F]">{don.description}</span>
            </p>
          )}

          <div className="mt-8 flex items-center">
            <Image
              src={`${don.img_url}`}
              width={128}
              height={128}
              alt="photo de profil du donneur"
              className="rounded-full h-14 w-14 object-cover"
            />

            <div className="ml-4">
              <p>{don.donneur.pseudo}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {!isUpdating ? (
              <button
                onClick={handleContactDonneur}
                disabled={isLoading || userId === don.donneur_id}
                className={`mt-6 px-6 py-3 rounded-md text-white font-medium transition-colors 
              ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : userId === don.donneur_id
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#B0C482] hover:bg-[#a2b574]"
              }`}
              >
                {isLoading
                  ? "En cours..."
                  : userId === don.donneur_id
                  ? "Votre propre don"
                  : "Contacter le donneur"}
              </button>
            ) : null}

            {userId === don.donneur_id && !isUpdating ? (
              <button
                onClick={() => setIsUpdating(true)}
                className="mt-6 px-6 py-3 rounded-md text-white bg-base-green font-medium transition-colors flex items-center gap-2 hover:bg-[#a2b574]"
              >
                <PenBox />
                Modifier le don
              </button>
            ) : userId === don.donneur_id ? (
              <form
                onSubmit={handleSubmit((data) =>
                  handleUpdate(data, don.don_id)
                )}
              >
                <button className="mt-6 px-6 py-3 rounded-md text-white bg-base-green font-medium transition-colors flex items-center gap-2 hover:bg-[#a2b574]">
                  <Save />
                  Enregistrer les modifications
                </button>
              </form>
            ) : null}

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
                        handleDeleteDon(don.don_id);
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

            {userId === don.donneur_id && !isUpdating ? (
              <button
                onClick={() => setIsPopupOpen(true)}
                className="mt-6 px-6 py-3 rounded-md text-white bg-red-600 font-medium transition-colors flex items-center gap-2 hover:bg-red-700"
              >
                <Trash2 />
                Supprimer ce don
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
