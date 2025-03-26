"use client";

import Image from "next/image";
import { JsonValue } from "@prisma/client/runtime/library";
import { useAuth } from "@/app/_context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CreateChat from "@/actions/create-chat";
import { socket } from "@/lib/socketClient";
import { toast } from "sonner"; // You may need to install this package

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
  };
}

export default function DonDisplay({ don }: DonProps) {
  const { isAuthenticated, userId } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleContactDonneur = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error("Vous devez être connecté pour contacter le donneur");
      router.push("/connexion");
      return;
    }

    // Prevent receiver from contacting themselves
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

  return (
    <div className="flex flex-col h-[70vh]">
      <div className="flex relative">
        <Image
          src={`${don.img_url}`}
          width={600}
          height={1024}
          alt="Image de bannière de l'article"
          className="aspect-video w-1/3 h-max object-cover object-top m-24 rounded-xl"
        />
        <div className="p-16 h-4/5 w-1/3 border-[3px] border-[#717171] rounded-xl absolute right-36">
          <h2 className="font-Montserrat font-extrabold text-3xl">
            {don.title}
          </h2>

          <p className="my-4">
            Date d&apos;expiration : {don.limit_date.toLocaleDateString()}
          </p>
          <p className="my-4">Quantité : {don.quantity}</p>
          <p className="my-4">
            Lieux :{" "}
            {don.rdv_pts
              ? Array.isArray(don.rdv_pts)
                ? don.rdv_pts
                    .map((pt) =>
                      typeof pt === "object" && pt !== null
                        ? Object.values(pt).join(" ")
                        : String(pt)
                    )
                    .join(", ")
                : typeof don.rdv_pts === "object"
                ? Object.values(don.rdv_pts).join(", ")
                : String(don.rdv_pts)
              : "Non spécifié"}
          </p>

          <p className="my-4">
            Description : <br></br> {don.description}
          </p>

          <button
            onClick={handleContactDonneur}
            disabled={isLoading || userId === don.donneur_id}
            className={`mt-6 px-6 py-3 rounded-md text-white font-medium transition-colors 
              ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : userId === don.donneur_id
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
          >
            {isLoading
              ? "En cours..."
              : userId === don.donneur_id
              ? "Votre propre don"
              : "Contacter le donneur"}
          </button>
        </div>
      </div>
    </div>
  );
}
