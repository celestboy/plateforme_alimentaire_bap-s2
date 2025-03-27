"use client";

import { Mail, MessageSquareMore, Tag, User, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { ContactSchemaType } from "@/types/forms";
import { ContactSchema } from "@/app/schema";
import { toast } from "sonner";
import { sendContactEmail } from "@/actions/send-mail-contact";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactSchemaType>({
    resolver: zodResolver(ContactSchema),
  });

  const handleSubmitForm = async (data: ContactSchemaType) => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("firstname", data.firstname);
    formData.append("sujet", data.sujet);
    formData.append("email", data.email);
    formData.append("content", data.content);

    try {
      const response = await sendContactEmail(formData);

      if (response.success) {
        toast.success("Message envoyé avec succès !", {
          className:
            "bg-green-500 border border-green-200 text-white text-base",
        });
        reset();
      } else {
        toast.error(response.error || "Une erreur est survenue", {
          icon: <X className="text-white" />,
          className: "bg-red-500 border border-red-200 text-white text-base",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message", error);
      toast.error("Erreur lors de l'envoi du message", {
        icon: <X className="text-white" />,
        className: "bg-red-500 border border-red-200 text-white text-base",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    Object.values(errors).forEach((error) => {
      if (error && "message" in error) {
        toast.error(error.message as string, {
          icon: <X className="text-white" />,
          className: "bg-red-500 border border-red-200 text-white text-base",
        });
      }
    });
  }, [errors]);

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)}>
      <div className="md:w-[800px] flex flex-col justify-center gap-6">
        <div className="md:flex justify-center items-center gap-10 w-full">
          <div className="md:flex flex-col gap-2 w-1/2">
            <span className="ml-4 flex items-center gap-2 font-futuraPTBook font-semibold text-gray-600">
              <User />
              Nom*
            </span>
            <input
              type="text"
              placeholder="Nom"
              {...register("name")}
              className="border border-gray-600 py-3 px-6 rounded-full mb-4 md:mb-0"
            />
          </div>
          <div className="md:flex flex-col gap-2 w-1/2">
            <span className="ml-4 flex items-center gap-2 font-futuraPTBook font-semibold text-gray-600">
              <User />
              Prénom*
            </span>
            <input
              type="text"
              placeholder="Prénom"
              {...register("firstname")}
              className="border border-gray-600 py-3 px-6 rounded-full"
            />
          </div>
        </div>
        <div className="md:flex justify-center items-center gap-10 w-full">
          <div className="md:flex flex-col gap-2 w-1/2">
            <span className="ml-4 flex items-center gap-2 font-futuraPTBook font-semibold text-gray-600">
              <Mail />
              Email*
            </span>
            <input
              type="text"
              placeholder="Adresse Mail"
              {...register("email")}
              className="border border-gray-600 py-3 px-6 rounded-full mb-4 md:mb-0"
            />
          </div>
          <div className="flex flex-col md:gap-2 md:w-1/2">
            <span className="ml-4 flex items-center gap-2 font-futuraPTBook font-semibold text-gray-600">
              <Tag />
              Sujet*
            </span>
            <input
              type="text"
              placeholder="Sujet du message"
              {...register("sujet")}
              className="border border-gray-600 py-3 px-6 rounded-full"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <span className="ml-4 flex items-center gap-2 font-futuraPTBook font-semibold text-gray-600">
            <MessageSquareMore />
            Contenu du message*
          </span>
          <textarea
            placeholder="Votre message"
            {...register("content")}
            className="w-full h-[300px] border border-gray-600 py-3 px-6 rounded-xl"
          ></textarea>
        </div>
      </div>

      <div className="flex items-center justify-center mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="text-white bg-base-green px-6 py-3 rounded-full transition-colors hover:bg-dark-blue disabled:opacity-50"
        >
          {isSubmitting ? "Envoi en cours..." : "J'envoie mon message"}
        </button>
      </div>
    </form>
  );
}
