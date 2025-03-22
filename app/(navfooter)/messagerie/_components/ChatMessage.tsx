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
              {new Date(sentAt).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}{" "}
              {new Date(sentAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
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
                className={`px-4 py-1 rounded-lg ${
                  isOwnMessage
                    ? "bg-green-300 cursor-not-allowed"
                    : "bg-green-500"
                }`}
                disabled={isOwnMessage}
              >
                Accepter
              </button>
              <button
                onClick={handleReject}
                className={`px-4 py-1 rounded-lg ${
                  isOwnMessage ? "bg-red-300 cursor-not-allowed" : "bg-red-500"
                }`}
                disabled={isOwnMessage}
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
