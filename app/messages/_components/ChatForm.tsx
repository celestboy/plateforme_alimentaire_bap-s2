"use client";

import React, { useState } from "react";

const ChatForm = ({
  onSendMessage,
}: {
  onSendMessage: (message: string) => void;
}) => {
  const [message, setMessage] = useState("");

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
          className="px-4 py-2 text-white rounded-lg bg-blue-500"
        >
          Send
        </button>
        <button
          type="button"
          className="px-4 py-2 text-white rounded-lg bg-blue-500"
        >
          Valider le don
        </button>
      </form>
    </div>
  );
};

export default ChatForm;
