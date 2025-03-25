"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // ✅ Importation du router
import { jwtDecode } from "jwt-decode";
import displayUniqueDon from "@/actions/get-single-don";
import DonClient from "./_components/DonClient";
import CreateChat from "@/actions/create-chat";
import { JsonValue } from "@prisma/client/runtime/library";
import { socket } from "@/lib/socketClient";

interface JwtPayload {
  userId: number;
  email: string;
}

export default function SingleDonPage() {
  const params = useParams();
  const router = useRouter(); // ✅ Initialisation du router
  const [don, setDon] = useState<{
    don_id: number;
    donneur_id: number;
    rdv_pts: JsonValue;
  } | null>(null);
  const [receveurId, setReceveurId] = useState<number | null>(null);

  // 🔹 Récupération des infos du don
  useEffect(() => {
    const fetchDon = async () => {
      if (!params?.id) return;

      try {
        const id_don = Number(params.id);
        if (isNaN(id_don)) return;

        const fetchedDon = await displayUniqueDon(id_don);
        setDon(fetchedDon);
      } catch (error) {
        console.error("Erreur lors de la récupération du don:", error);
      }
    };

    fetchDon();
  }, [params?.id]);

  // 🔹 Récupération du receveur_id via le token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        if (decodedToken?.userId) {
          setReceveurId(decodedToken.userId);
        } else {
          console.error("Le token ne contient pas 'userId'");
        }
      } catch (error) {
        console.error("Erreur lors du décodage du token:", error);
      }
    }
  }, []);

  const handleCreateChat = async () => {
    if (!don || receveurId === null) {
      console.error("Données insuffisantes pour créer le chat");
      return;
    }

    try {
      const data = {
        donneur_id: don.donneur_id,
        receveur_id: receveurId,
        don_id: don.don_id,
      };

      const result = await CreateChat(data);

      if (result.success && result.donneurId && result.receveurId) {
        socket.emit("new_chat_created", {
          donneur_id: data.donneur_id,
          receveur_id: data.receveur_id,
          chat_id: result.chatId,
          don_id: data.don_id,
        });
      }

      router.push("/messagerie");
    } catch (error) {
      console.error("Erreur lors de la création du chat:", error);
    }
  };

  return (
    <div className="flex flex-col">
      <div>
        <DonClient />
      </div>
      <div className="mt-4 p-4 border rounded-md bg-gray-100">
        <p>{JSON.stringify(don?.rdv_pts) ?? "Chargement..."}</p>
        <p>
          <strong>Don ID :</strong> {don?.don_id ?? "Chargement..."}
        </p>
        <p>
          <strong>Donneur ID :</strong> {don?.donneur_id ?? "Chargement..."}
        </p>
        <p>
          <strong>Receveur ID :</strong> {receveurId ?? "Chargement..."}
        </p>
      </div>
      <div>
        <button
          onClick={handleCreateChat}
          className="mt-4 p-2 bg-blue-500 text-white rounded-md"
        >
          Contacter le donneur
        </button>
      </div>
    </div>
  );
}
