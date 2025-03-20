import React from "react";

interface ChatMessageProps {
  sender: string;
  message: string;
  isOwnMessage: boolean;
}

const ChatMessage = ({ sender, message, isOwnMessage }: ChatMessageProps) => {
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
        className={`max-w-xs px-4 py-2 rounded-lg ${
          isSystemMessage
            ? "bg-gray-800 text-white text-center text-xs"
            : isOwnMessage
            ? "bg-blue-500 text-white"
            : "bg-white text-black"
        }`}
      >
        {!isSystemMessage && <p className="text-sm font-bold">{sender}</p>}

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
          <p>{message}</p>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
