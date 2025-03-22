import React from "react";

interface ChatMessageProps {
  sender: string;
  sentAt: string;
  message: string;
  isOwnMessage: boolean;
}

const ChatMessage = ({
  sender,
  message,
  sentAt,
  isOwnMessage,
}: ChatMessageProps) => {
  const isSystemMessage = sender === "system";

  let parsedMessage;
  try {
    parsedMessage = JSON.parse(message);
  } catch {
    parsedMessage = message;
  }

  const formatDate = () => {
    try {
      // First try to parse the date from ISO string
      const dateObj = new Date(sentAt);

      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        console.error("Invalid date:", sentAt);
        return "Date inconnue";
      }

      return {
        date: dateObj.toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        time: dateObj.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      };
    } catch (error) {
      console.error("Error formatting date:", error, sentAt);
      return { date: "Date inconnue", time: "" };
    }
  };

  const formattedDate = formatDate();

  const handleAccept = () => {
    alert(
      `Tu as accepté le rendez-vous à ${parsedMessage.lieu} à ${parsedMessage.heure}`
    );
  };

  const handleReject = () => {
    alert("Tu as refusé l'offre.");
  };

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
            ? "bg-gray-800 text-white text-center text-xs"
            : isOwnMessage
            ? "bg-base-green text-white"
            : "bg-white text-black"
        }`}
      >
        {!isSystemMessage && (
          <div className="flex items-center gap-2">
            <p className="font-futuraPTMedium text-lg">{sender}</p>
            <p className="font-futuraPTBook text-xs">
              {typeof formattedDate === "string"
                ? formattedDate
                : `${formattedDate.date} ${formattedDate.time}`}
            </p>
          </div>
        )}

        {parsedMessage && parsedMessage.lieu && parsedMessage.heure ? (
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
                className="px-4 py-1 bg-green-500 text-white rounded-lg"
              >
                Accepter
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-1 bg-red-500 text-white rounded-lg"
              >
                Refuser
              </button>
            </div>
          </div>
        ) : (
          <p className="text-lg font-futuraPTBook">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
