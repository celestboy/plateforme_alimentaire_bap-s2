"use client";

import React, { useState } from "react";
import {
  UserPlus,
  User,
  ShoppingBasket,
  Pin,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import { RegisterSchema } from "@/app/schema";
import { RegisterSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import submitInscForm from "@/actions/insc-form";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/utils/cn";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<string>("");

  const { register, handleSubmit, formState } = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
  });

  const handleSubmitForm = async (data: RegisterSchemaType) => {
    const response = await submitInscForm(data);
    if (response.success) {
      setTimeout(() => {
        redirect("/connexion");
      }, 1000);
    } else {
      toast.error(
        response.message ? response.message : response.errors?.[0].message,
        {
          icon: <X className="text-white" />,
          className: "bg-red-500 border border-red-200 text-white text-base",
        }
      );
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
            <UserPlus className="mr-4" />
            Type de client :
          </span>
          <select
            {...register("user_type")}
            onChange={(e) => setSelectedUserType(e.target.value)} // Mettre à jour l'état
            className="w-[600px] my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
          >
            <option value="">Veuillez sélectionner votre statut</option>
            <option value="particulier">Particulier</option>
            <option value="commercant">Commerçant</option>
          </select>
        </div>

        {/* Champ Nom d'utilisateur (affiché uniquement si particulier) */}
        {selectedUserType === "particulier" && (
          <div className="relative w-[600px]">
            <span className="font-semibold font-Montserrat text-gray-600 flex items-center">
              <User className="mr-4" />
              Nom d&apos;utilisateur :
            </span>
            <input
              type="text"
              {...register("username")}
              className="w-[600px] my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
              placeholder="Nom d'utilisateur"
            />
          </div>
        )}

        {/* Champs Nom du commerce et Adresse (affichés uniquement si commerçant) */}
        {selectedUserType === "commercant" && (
          <>
            <div className="relative w-[600px]">
              <span className="font-semibold font-Montserrat text-gray-600 flex items-center">
                <ShoppingBasket className="mr-4" />
                Nom du commerce :
              </span>
              <input
                type="text"
                {...register("commerce_name")}
                className="w-[600px] my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
                placeholder="Nom du commerce"
              />
            </div>
            <div className="relative w-[600px]">
              <span className="font-semibold font-Montserrat text-gray-600 flex items-center">
                <Pin className="mr-4" />
                Adresse du commerce :
              </span>
              <input
                type="text"
                {...register("adresse_commerce")}
                className="w-[600px] my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
                placeholder="Adresse du commerce"
              />
            </div>
          </>
        )}

        {/* Adresse Mail */}
        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center">
            <Mail className="mr-4" />
            Adresse Mail :
          </span>
          <input
            type="email"
            {...register("email")}
            className="w-[600px] my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Adresse Mail"
          />
        </div>

        {/* Mot de passe */}
        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center">
            <KeyRound className="mr-4" />
            Mot de passe :
          </span>
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            className="w-[600px] my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Mot de passe"
          />
          <span
            className="text-gray-600 absolute top-14 right-5 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        {/* Bouton de soumission */}
        <div className="flex justify-center items-center">
          <button
            type="submit"
            className={cn(
              (formState.isSubmitting || !formState.isValid) &&
                "!cursor-not-allowed opacity-40"
            )}
            disabled={formState.isSubmitting || !formState.isValid}
          >
            Je m&apos;inscris
          </button>
        </div>
      </form>
    </div>
  );
}
