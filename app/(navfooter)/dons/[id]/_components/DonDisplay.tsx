"use client";

import Image from "next/image";
import { JsonValue } from "@prisma/client/runtime/library";
import { useAuth } from "@/app/_context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CreateChat from "@/actions/create-chat";
import { socket } from "@/lib/socketClient";
import { toast } from "sonner"; // You may need to install this package
import { Star, StarHalf } from "lucide-react";

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
          className="aspect-video w-2/5 h-max object-cover object-center m-24 rounded-xl"
        />
        <div className="p-8 w-1/3 border-[3px] border-[#BEBEBE] rounded-xl absolute right-36">
          <h2 className="ml-4 font-Montserrat font-extrabold text-3xl">
            {don.title}
          </h2>
          <p className="my-4">
            Date de publication :{" "}
            <span className="text-[#7F7F7F]">
              {don.publishedAt.toLocaleDateString()}
            </span>
          </p>
          <p className="my-4">
            Date d&apos;expiration :{" "}
            <span className="text-[#7F7F7F]">
              {don.limit_date.toLocaleDateString()}
            </span>
          </p>
          <p className="my-4">
            Quantité : <span className="text-[#7F7F7F]">{don.quantity}</span>
          </p>
          <p className="my-4">
            Lieux :{" "}
            <span className="text-[#7F7F7F]">
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
            </span>
          </p>

          <p className="my-4 h-36">
            Description : <br></br>{" "}
            <span className="text-[#7F7F7F]">{don.description}</span>
          </p>

          <div className="mt-8 flex items-center">
            <Image
              src={`${don.img_url}`}
              width={70}
              height={70}
              alt="photo de profil du donneur"
              className="rounded-full h-[70px] w-[70px] object-cover"
            ></Image>

            <div className="ml-4">
              <p>Rueillois925</p>
              <div className="flex items-center">
                <Star color="#f8bd00" fill="#f8bd00" size={20} />
                <Star color="#f8bd00" fill="#f8bd00" size={20} />
                <Star color="#f8bd00" fill="#f8bd00" size={20} />
                <Star color="#f8bd00" fill="#f8bd00" size={20} />
                <StarHalf color="#f8bd00" fill="#f8bd00" size={20} />
              </div>
              <p>
                Vu la dernière fois :{" "}
                <span className="text-[#7F7F7F]">il y a 2 heures</span>
              </p>
            </div>
          </div>

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
        </div>
      </div>
    </div>
  );
}
