"use client";

import { jwtDecode } from "jwt-decode";
import {
  X,
  CaseSensitive,
  NotepadText,
  Folder,
  Layers,
  Calendar1,
  MapPin,
  ImageIcon,
} from "lucide-react";
import { DonSchema } from "@/app/schema";
import { DonSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import submitDonForm from "@/actions/publish-don-form";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import displayDonInfo from "@/actions/displayDonInfo";

interface JwtPayload {
  userId: number;
  email: string;
  exp: number;
}

interface RdvPts {
  id: number;
  lieu: string;
  value: string;
}

export default function PublishDonForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rdvpts, setRdvpts] = useState([]);

  const { register, handleSubmit, formState } = useForm<DonSchemaType>({
    resolver: zodResolver(DonSchema),
  });

  useEffect(() => {
    fetch("/data/rdv-pts.json")
      .then((response) => response.json())
      .then((data) => setRdvpts(data))
      .catch((error) =>
        console.error(
          "Erreur lors du chargement des points de rendez-vous :",
          error
        )
      );
  }, [formState.errors]);

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
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };
  const handleSubmitForm = async (data: DonSchemaType) => {
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

    const fetchedInfos = await displayDonInfo(userId);
    console.log(fetchedInfos);

    const formData = new FormData();

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    Object.entries(data).forEach(([key, value]) => {
      if (key === "rdv_pts") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });

    const response = await submitDonForm(
      data,
      userId,
      selectedFile ?? new File([], "")
    );

    if (response.success) {
      setTimeout(() => {
        redirect("/");
      }, 1000);
    } else {
      toast.error(response.message || response.errors?.[0]?.message, {
        icon: <X className="text-white" />,
        className: "bg-red-500 border border-red-200 text-white text-base",
      });
    }
  };

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
    <div className="w-[600px] mx-auto">
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        id="registerform"
        className="w-[600px]"
      >
        {/* Type de Client */}
        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center">
            <CaseSensitive className="mr-4" />
            Nom du produit <span>*</span>
          </span>
          <input
            type="text"
            {...register("title")}
            className="w-[600px] my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Nom du produit"
            required
          />
        </div>

        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center">
            <NotepadText className="mr-4" />
            Description du produit <span>*</span>
          </span>
          <input
            type="text"
            {...register("description")}
            className="w-[600px] my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Description du produit"
            required
          />
        </div>

        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center">
            <Folder className="mr-4" />
            Catégorie du produit <span>*</span>
          </span>
          <select
            {...register("category")}
            className="w-[600px] my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            required
          >
            <option value="">
              Veuillez séléctionner la catégorie du produit
            </option>
            <option value="feculents">Féculents</option>
            <option value="viande">Viande</option>
            <option value="boisson">Boisson</option>
            <option value="desserts">Desserts</option>
            <option value="produits-laiters">Produits Laitiers</option>
            <option value="autres">Autres</option>
          </select>
        </div>
        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center">
            <Layers className="mr-4" />
            Quantité <span>*</span>
          </span>
          <input
            type="number"
            step="0.1"
            {...register("quantity", { valueAsNumber: true })}
            className="w-[600px] my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Quantité"
            required
          />
        </div>

        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center">
            <Calendar1 className="mr-4" />
            Date Limite de Consommation<span>*</span>
          </span>
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
            className="w-[600px] my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Date Limite de consommation"
            required
          />
        </div>

        {/* Mot de passe */}
        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center">
            <MapPin className="mr-4" />
            Points de rendez-vous <span>*</span>
          </span>
          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}
            className="w-w-600 bg-white rounded-2xl border border-gray-600 my-4"
          >
            {rdvpts.map((point: RdvPts) => (
              <div
                key={point.id}
                className="relative pl-2 cursor-pointer flex items-center"
              >
                <input
                  type="checkbox"
                  {...register("rdv_pts")}
                  value={point.value}
                  className="my-4 mx-2"
                />

                <label htmlFor={`checkbox`} className="cursor-pointer">
                  {point.lieu}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat flex items-center text-gray-600">
            <ImageIcon className="mr-4" />
            Image <span>*</span>
          </span>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-w-600 my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            accept="image/*"
            required
          />
        </div>

        {/* Bouton de soumission */}
        <div className="flex justify-center items-center">
          <button type="submit">Je publie mon don</button>
        </div>
      </form>
    </div>
  );
}
