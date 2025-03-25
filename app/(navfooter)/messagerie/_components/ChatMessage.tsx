import getDonStatus from "@/actions/get-don-status";
import StoreMessage from "@/actions/store-message";
import updateAcceptedStatus from "@/actions/update-is-don-accepted";
import updateRejectedStatus from "@/actions/update-is-don-rejected";
import validateForm from "@/actions/validate-form";
import { socket } from "@/lib/socketClient";
import { ValidateSchemaType } from "@/types/forms";
import { DonStatus } from "@prisma/client";
import React, { useEffect, useState } from "react";

interface ChatMessageProps {
  sender: string;
  sentAt: string;
  message: string;
  isOwnMessage: boolean;
  donId?: number | null;
  isSystemMessage?: boolean;
  room: number;
  donneur_id: number;
  receveur_id: number;
  isAccepted?: boolean;
  isRefused?: boolean;
}

const ChatMessage = ({
  sender,
  message,
  sentAt,
  isOwnMessage,
  donId,
  isSystemMessage = false,
  room,
  donneur_id,
  receveur_id,
}: ChatMessageProps) => {
  let parsedMessage;
  try {
    parsedMessage = typeof message === "string" ? JSON.parse(message) : message;
  } catch {
    parsedMessage = message;
  }

  const [donStatus, setDonStatus] = useState<DonStatus | null>(null);

  const formatDate = (dateString: string) => {
    try {
      const dateObj = new Date(dateString);
      if (isNaN(dateObj.getTime())) {
        console.error("Invalid date:", dateString);
        return { date: "Date inconnue", time: "" };
      }
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const year = dateObj.getFullYear();
      const hours = String(dateObj.getHours()).padStart(2, "0");
      const minutes = String(dateObj.getMinutes()).padStart(2, "0");

      return {
        date: `${day}/${month}/${year}`,
        time: `${hours}:${minutes}`,
      };
    } catch (error) {
      console.error("Error formatting date:", error, dateString);
      return { date: "Date inconnue", time: "" };
    }
  };

  const formattedDate = formatDate(sentAt);

  const createSystemMessage = async (content: string) => {
    const messageData = {
      message: content,
      room: room,
      sender: "server",
      senderID: donneur_id,
      sentAt: new Date().toISOString(),
      isOwnMessage: true,
      isSystemMessage: true,
    };

    const messageDataDb = {
      content: content,
      chat_id: room,
      sentAt: new Date().toISOString(),
      isOwnMessage: true,
      isSystemMessage: true,
      author_id: donneur_id,
      receiver_id: receveur_id,
      status: true,
    };

    try {
      socket.emit("message", messageData);
      return await StoreMessage(messageDataDb);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      return null;
    }
  };

  useEffect(() => {
    if (!donId || !room) {
      return;
    }

    async function checkStatus() {
      try {
        const status = await getDonStatus(donId as number, room);
        setDonStatus(status);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération du statut du don:",
          error
        );
      }
    }

    checkStatus();
  }, [donId, room]);

  const handleAccept = async () => {
    if (!parsedMessage?.lieu || !parsedMessage?.heure) {
      console.error("Données incomplètes ou don déjà accepté");
      return;
    }

    try {
      const data: ValidateSchemaType = {
        id_don: donId ?? 0,
        lieu: parsedMessage.lieu,
        heure: parsedMessage.heure,
      };

      const response = await validateForm(data);

      if (response?.success) {
        await createSystemMessage(
          `Vous avez accepté le don le ${data.heure} à ${data.lieu}`
        );
        if (donId) {
          await updateAcceptedStatus(donId, room);
        }
      } else {
        await createSystemMessage(`Erreur lors de l'acceptation du don`);
      }
    } catch (error) {
      console.error("Erreur lors de l'acceptation:", error);
      await createSystemMessage(`Erreur lors de l'acceptation du don`);
    }
  };

  const handleReject = async () => {
    if (!parsedMessage?.lieu || !parsedMessage?.heure) {
      console.error("Données incomplètes ou don déjà traité");
      return;
    }

    try {
      const data: ValidateSchemaType = {
        id_don: donId ?? 0,
        lieu: parsedMessage.lieu,
        heure: parsedMessage.heure,
      };

      await createSystemMessage(
        `Vous avez refusé l'offre du ${data.heure} à ${data.lieu}`
      );

      if (donId) {
        await updateRejectedStatus(donId, room);
      }
    } catch (error) {
      console.error("Erreur lors du refus:", error);
      await createSystemMessage(`Erreur lors du refus du don`);
    }
  };

  const isDonationMessage =
    parsedMessage &&
    typeof parsedMessage === "object" &&
    parsedMessage.lieu &&
    parsedMessage.heure;

  const isAccepted = donStatus === DonStatus.ACCEPTED;
  const isRefused = donStatus === DonStatus.REFUSED;

  return (
    <div
      className={`flex ${
        isSystemMessage
          ? "justify-center"
          : isOwnMessage
          ? "justify-end"
          : "justify-start"
      } mb-3`}
    >
      <div
        className={`w-auto px-4 py-2 rounded-lg ${
          isSystemMessage
            ? "bg-gray-800 text-white text-center text-sm"
            : isOwnMessage
            ? "bg-base-green text-white"
            : "bg-white text-black"
        }`}
      >
        {isSystemMessage ? (
          <div className="flex items-center justify-center gap-2 mb-1">
            <p className="font-futuraPTMedium text-sm text-gray-300">Système</p>
            <p className="font-futuraPTBook text-xs text-gray-300">
              {formattedDate.date} {formattedDate.time}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p className="font-futuraPTMedium text-lg">{sender}</p>
            <p className="font-futuraPTBook text-xs">
              {formattedDate.date} {formattedDate.time}
            </p>
          </div>
        )}
        {isDonationMessage ? (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg my-2">
            <p>
              <strong>📍 Lieu :</strong> {parsedMessage.lieu}
            </p>
            <p>
              <strong>⏰ Heure :</strong> {parsedMessage.heure}
            </p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleAccept}
                className={`px-4 py-1 rounded-lg ${
                  isOwnMessage || isAccepted || isRefused
                    ? "bg-green-300 cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
                disabled={isOwnMessage || isAccepted || isRefused}
              >
                Accepter
              </button>
              <button
                onClick={handleReject}
                className={`px-4 py-1 rounded-lg ${
                  isOwnMessage || isRefused || isAccepted
                    ? "bg-red-300 cursor-not-allowed"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
                disabled={isOwnMessage || isAccepted || isRefused}
              >
                Refuser
              </button>
            </div>
          </div>
        ) : (
          <p
            className={`${
              isSystemMessage ? "text-base italic" : "text-lg font-futuraPTBook"
            }`}
          >
            {typeof message === "string" ? message : JSON.stringify(message)}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
