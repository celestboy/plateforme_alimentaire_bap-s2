"use client";

import getDonStatus from "@/actions/get-don-status";
import { socket } from "@/lib/socketClient";
import { DonStatus } from "@prisma/client";
import React, { useEffect, useState } from "react";

const ChatForm = ({
  onSendMessage,
  onValidateDonation,
  donId,
  chatId,
  currentStatus, // Add this prop to receive status from parent
}: {
  onSendMessage: (message: string) => void;
  onValidateDonation: () => void;
  donId: number | null;
  chatId: number | null;
  currentStatus?: DonStatus | null;
}) => {
  const [message, setMessage] = useState("");
  const [donStatus, setDonStatus] = useState<DonStatus | null>(
    currentStatus || null
  );

  // Update when prop changes
  useEffect(() => {
    if (currentStatus) {
      setDonStatus(currentStatus);
    }
  }, [currentStatus]);

  // Initial status fetch
  useEffect(() => {
    if (!donId || !chatId) {
      return;
    }

    async function checkStatus() {
      try {
        const status = await getDonStatus(donId as number, chatId as number);
        setDonStatus(status);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération du statut du don:",
          error
        );
      }
    }

    checkStatus();
  }, [donId, chatId]);

  // Listen for status updates via socket
  useEffect(() => {
    if (!donId || !chatId) return;

    const handleStatusUpdate = (data: {
      donId: number;
      room: number;
      status: DonStatus;
    }) => {
      if (data.donId === donId && data.room === chatId) {
        console.log("ChatForm updating status to:", data.status);
        setDonStatus(data.status);
      }
    };

    socket.on("status_update", handleStatusUpdate);

    return () => {
      socket.off("status_update", handleStatusUpdate);
    };
  }, [donId, chatId]);

  const isPending = donStatus === DonStatus.PENDING;
  const isAccepted = donStatus === DonStatus.ACCEPTED;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() !== "") {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 px-4 border-2 py-2 rounded-lg focus:outline-none"
          placeholder="Type your text here..."
        />
        <button
          type="submit"
          className="px-4 py-2 text-white rounded-lg bg-base-green hover:bg-base-green"
        >
          Send
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            onValidateDonation();
          }}
          className={`px-4 py-2 rounded-lg ${
            isAccepted || isPending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-base-green text-white hover:bg-base-green"
          }`}
          disabled={isAccepted || isPending}
        >
          {isPending
            ? "Formulaire en cours"
            : isAccepted
            ? "Don validé"
            : "Valider le don"}
        </button>
      </form>
    </div>
  );
};

export default ChatForm;
