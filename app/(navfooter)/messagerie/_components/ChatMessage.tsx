import getDonStatus from "@/actions/get-don-status";
import StoreMessage from "@/actions/store-message";
import updateAcceptedStatus from "@/actions/update-is-don-accepted";
import updateRejectedStatus from "@/actions/update-is-don-rejected";
import validateForm from "@/actions/validate-form";
import { socket } from "@/lib/socketClient";
import { ValidateSchemaType } from "@/types/forms";
import { DonStatus } from "@prisma/client";
import React, { useEffect, useState, useRef } from "react";
import deleteMessage from "@/actions/delete-message";
import MessageContextMenu from "./MessageContextMenu";
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
  messageId?: number;
  senderID: number;
  currentUserId: number;
  onStatusChange?: (status: DonStatus) => void;
  onMessageDelete?: (timestamp: string) => void;
}

interface LocationDataItem {
  type: string;
  value: string;
  name: string;
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
  currentUserId,
  senderID,
  onMessageDelete,
  onStatusChange,
}: ChatMessageProps) => {
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
  }>({
    visible: false,
    x: 0,
    y: 0,
  });

  // Add a ref to the message div
  const messageRef = useRef<HTMLDivElement>(null);

  // Handle right-click
  const handleContextMenu = (event: React.MouseEvent) => {
    // Only allow context menu for own messages
    if (!isOwnMessage) return;

    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
    });
  };

  // Handle message deletion
  // Update handleDeleteMessage function:

  const handleDeleteMessage = async () => {
    if (!isOwnMessage) return;

    try {
      console.log("Deleting message with timestamp:", sentAt);

      // First, emit socket event to immediately update all clients
      socket.emit("delete_message", {
        room: room,
        timestamp: sentAt, // Use timestamp instead of messageId
        chatId: room,
        authorId: senderID,
        deletedBy: currentUserId,
        deletedAt: new Date().toISOString(),
      });

      // Then, delete from database
      const result = await deleteMessage(room, sentAt, senderID, currentUserId);

      if (result.success) {
        console.log("Message deleted successfully");

        // Notify parent component
        if (onMessageDelete) {
          onMessageDelete(sentAt);
        }
      } else {
        console.error("Failed to delete message:", result.message);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

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
        if (status && onStatusChange) {
          onStatusChange(status);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération du statut du don:",
          error
        );
      }
    }

    checkStatus();
  }, [donId, room, onStatusChange]);

  // Listen for status updates via socket
  useEffect(() => {
    if (!donId || !room) return;

    const handleStatusUpdate = (data: {
      donId: number;
      room: number;
      status: DonStatus;
    }) => {
      if (data.donId === donId && data.room === room) {
        setDonStatus(data.status);
        if (onStatusChange) {
          onStatusChange(data.status);
        }
      }
    };

    socket.on("status_update", handleStatusUpdate);

    return () => {
      socket.off("status_update", handleStatusUpdate);
    };
  }, [donId, room, onStatusChange]);

  // Update only the handleAccept function in ChatMessage.tsx

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

      const formatDateTime = (dateTimeString: string) => {
        try {
          const dateObj = new Date(dateTimeString);
          if (isNaN(dateObj.getTime())) {
            console.error("Invalid date:", dateTimeString);
            return "Date/Heure inconnue";
          }
          const day = String(dateObj.getDate()).padStart(2, "0");
          const month = String(dateObj.getMonth() + 1).padStart(2, "0");
          const year = dateObj.getFullYear();
          const hours = String(dateObj.getHours()).padStart(2, "0");
          const minutes = String(dateObj.getMinutes()).padStart(2, "0");

          return `${day}/${month}/${year} à ${hours}:${minutes}`;
        } catch (error) {
          console.error("Error formatting date:", error, dateTimeString);
          return "Date/Heure inconnue";
        }
      };

      async function getLocationName(
        value: string,
        locationData: LocationDataItem[]
      ): Promise<string> {
        const location = locationData.find(
          (item) => item.type === "location" && item.value === value
        );

        return location ? location.name : value;
      }

      const locationResponse = await fetch("/data/filters.json");
      const locationData: LocationDataItem[] = await locationResponse.json();

      const response = await validateForm(data);

      const formattedLocation = await getLocationName(data.lieu, locationData);
      const formattedHeure = formatDateTime(data.heure);

      const systemMessage = `Le don a été accepté pour le ${formattedHeure} à : ${formattedLocation}`;

      if (response?.success) {
        // Create system message first so it appears in UI
        await createSystemMessage(systemMessage);

        // Add the system message to the UI immediately
        socket.emit("local-system-message", {
          message: systemMessage,
          room,
          sentAt: new Date().toISOString(),
          isSystemMessage: true,
        });

        if (donId) {
          // Pass the receveur_id from the component props
          const updateResult = await updateAcceptedStatus(
            donId,
            room,
            receveur_id
          );

          if (updateResult.success) {
            // Emit status update via socket
            socket.emit("status_update", {
              room: room,
              donId: donId,
              status: DonStatus.ACCEPTED,
              updatedAt: new Date().toISOString(),
              receiverId: receveur_id,
            });
            setDonStatus(DonStatus.ACCEPTED);
            if (onStatusChange) onStatusChange(DonStatus.ACCEPTED);
          }
        }
      } else {
        const errorMessage = `Erreur lors de l'acceptation du don`;
        await createSystemMessage(errorMessage);

        // Add the error message to UI immediately
        socket.emit("local-system-message", {
          message: errorMessage,
          room,
          sentAt: new Date().toISOString(),
          isSystemMessage: true,
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'acceptation:", error);
      const errorMessage = `Erreur lors de l'acceptation du don`;
      await createSystemMessage(errorMessage);

      // Add the error message to UI immediately
      socket.emit("local-system-message", {
        message: errorMessage,
        room,
        sentAt: new Date().toISOString(),
        isSystemMessage: true,
      });
    }
  };

  // Update the handleReject function:

  const handleReject = async () => {
    if (!parsedMessage?.lieu || !parsedMessage?.heure) {
      console.error("Données incomplètes ou don déjà traité");
      return;
    }

    try {
      // Format data for system message
      const formatDateTime = (dateTimeString: string) => {
        try {
          const dateObj = new Date(dateTimeString);
          if (isNaN(dateObj.getTime())) {
            console.error("Invalid date:", dateTimeString);
            return "Date/Heure inconnue";
          }
          const day = String(dateObj.getDate()).padStart(2, "0");
          const month = String(dateObj.getMonth() + 1).padStart(2, "0");
          const year = dateObj.getFullYear();
          const hours = String(dateObj.getHours()).padStart(2, "0");
          const minutes = String(dateObj.getMinutes()).padStart(2, "0");

          return `${day}/${month}/${year} à ${hours}:${minutes}`;
        } catch (error) {
          console.error("Error formatting date:", error, dateTimeString);
          return "Date/Heure inconnue";
        }
      };

      async function getLocationName(
        value: string,
        locationData: LocationDataItem[]
      ): Promise<string> {
        const location = locationData.find(
          (item) => item.type === "location" && item.value === value
        );
        return location ? location.name : value;
      }

      const locationResponse = await fetch("/data/filters.json");
      const locationData: LocationDataItem[] = await locationResponse.json();

      const formattedLocation = await getLocationName(
        parsedMessage.lieu,
        locationData
      );
      const formattedDateTime = formatDateTime(parsedMessage.heure);

      console.log(
        "Emitting delete_validation_form event for instant UI update"
      );
      const deleteData = {
        room: room,
        chatId: room,
        donId: donId,
        updatedAt: new Date().toISOString(),
        // Add a unique identifier to help with debugging
        eventId: Math.random().toString(36).substring(2, 9),
      };
      console.log("Emitting with data:", deleteData);

      // First emit it
      socket.emit("delete_validation_form", deleteData);

      const systemMessage = `L'offre du ${formattedDateTime} à : ${formattedLocation} a été refusée`;

      // Create and emit the system message
      await createSystemMessage(systemMessage);
      socket.emit("local-system-message", {
        message: systemMessage,
        room,
        sentAt: new Date().toISOString(),
        isSystemMessage: true,
      });

      if (donId) {
        // Update backend (which will also delete the messages from database)
        const updateResult = await updateRejectedStatus(donId, room);

        if (updateResult.success) {
          // Emit status update for form status tracking
          socket.emit("status_update", {
            room: room,
            donId: donId,
            status: DonStatus.REFUSED,
            updatedAt: new Date().toISOString(),
          });

          // Update local state
          setDonStatus(DonStatus.REFUSED);
          if (onStatusChange) onStatusChange(DonStatus.REFUSED);
        }
      }
    } catch (error) {
      console.error("Erreur lors du refus:", error);
      const errorMessage = `Erreur lors du refus du don`;
      await createSystemMessage(errorMessage);

      // Add the error message to UI immediately
      socket.emit("local-system-message", {
        message: errorMessage,
        room,
        sentAt: new Date().toISOString(),
        isSystemMessage: true,
      });
    }
  };
  const [locationData, setLocationData] = useState<LocationDataItem[]>([]);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const response = await fetch("/data/filters.json");
        const data: LocationDataItem[] = await response.json();
        setLocationData(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données de localisation:",
          error
        );
      }
    };

    fetchLocationData();
  }, []);

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
      ref={messageRef}
      onContextMenu={handleContextMenu} // Add this handler
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
            {(() => {
              const formatDateTime = (dateTimeString: string) => {
                try {
                  const dateObj = new Date(dateTimeString);
                  if (isNaN(dateObj.getTime())) {
                    console.error("Invalid date:", dateTimeString);
                    return "Date/Heure inconnue";
                  }
                  const day = String(dateObj.getDate()).padStart(2, "0");
                  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
                  const year = dateObj.getFullYear();
                  const hours = String(dateObj.getHours()).padStart(2, "0");
                  const minutes = String(dateObj.getMinutes()).padStart(2, "0");

                  return `${day}/${month}/${year} à ${hours}:${minutes}`;
                } catch (error) {
                  console.error(
                    "Error formatting date:",
                    error,
                    dateTimeString
                  );
                  return "Date/Heure inconnue";
                }
              };

              const getLocationName = (
                value: string,
                locationData: LocationDataItem[]
              ): string => {
                const location: LocationDataItem | undefined =
                  locationData.find(
                    (item: LocationDataItem) =>
                      item.type === "location" && item.value === value
                  );
                return location ? location.name : value;
              };

              const formattedLocation = getLocationName(
                parsedMessage.lieu,
                locationData
              );
              const formattedDateTime = formatDateTime(parsedMessage.heure);

              return (
                <>
                  <p>
                    <strong>📍 Lieu :</strong> {formattedLocation}
                  </p>
                  <p>
                    <strong>⏰ Heure :</strong> {formattedDateTime}
                  </p>
                </>
              );
            })()}
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
      {contextMenu.visible && isOwnMessage && (
        <MessageContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onDelete={handleDeleteMessage}
          onClose={() => setContextMenu({ ...contextMenu, visible: false })}
        />
      )}
    </div>
  );
};

export default ChatMessage;
