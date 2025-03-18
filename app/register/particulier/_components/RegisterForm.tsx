"use client";

import React, { useEffect, useState } from "react";
import { User, Mail, KeyRound, Eye, EyeOff, X } from "lucide-react";
import { RegisterParticulierSchema } from "@/app/schema";
import { RegisterParticulierSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import submitInscForm from "@/actions/particulier-insc-form";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState } =
    useForm<RegisterParticulierSchemaType>({
      resolver: zodResolver(RegisterParticulierSchema),
    });

  const handleSubmitForm = async (data: RegisterParticulierSchemaType) => {
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

  useEffect(() => {
    Object.values(formState.errors).forEach((error) => {
      if (error && "message" in error) {
        toast.error(error.message as string, {
          icon: <X className="text-white" />,
          className: "bg-red-500 border border-red-200 text-white text-base",
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
        <div className="relative w-[600px]">
          <input
            type="hidden"
            {...register("user_type")}
            value={"particulier"}
          />
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center font-futuraPTMedium">
            <User className="mr-4" />
            Nom d&apos;utilisateur :
          </span>
          <input
            type="text"
            {...register("username")}
            className="w-[600px] my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm font-futuraPTBook"
            placeholder="Nom d'utilisateur"
          />
        </div>

        {/* Adresse Mail */}
        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center font-futuraPTMedium">
            <Mail className="mr-4" />
            Adresse Mail :
          </span>
          <input
            type="email"
            {...register("email")}
            className="w-[600px] my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm font-futuraPTBook"
            placeholder="Adresse Mail"
          />
        </div>

        {/* Mot de passe */}
        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center font-futuraPTMedium">
            <KeyRound className="mr-4" />
            Mot de passe :
          </span>
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            className="w-[600px] my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm font-futuraPTBook"
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
        <div className="flex justify-center items-center font-futuraPTMedium">
          <button type="submit">Je m&apos;inscris</button>
        </div>
      </form>
    </div>
  );
}
