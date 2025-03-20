"use client";

import displayUserChats from "@/actions/get-user-chats";
import { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import ChatMessage from "./_components/ChatMessage";
import ChatForm from "./_components/ChatForm";
import { socket } from "@/lib/socketClient";
import StoreMessage from "@/actions/store-message";
import GetChatMessages from "@/actions/get-chat-messages";
import ValidationForm from "./_components/NewValidationForm";

interface JwtPayload {
  userId: number;
  email: string;
}

interface Chat {
  chat_id: number;
  donneur_id: number;
  receveur_id: number;
  don_id: number;
  don: {
    title: string;
  };
  donneur: {
    user_id: number;
    username?: string | null;
    commerce_name?: string | null;
    user_type: string;
  };
  receveur: {
    user_id: number;
    username?: string | null;
    commerce_name?: string | null;
    user_type: string;
  };
}

export default function MessageriePage() {
  const [idUser, setIdUser] = useState<number | null>(null);
  const [donId, setDonId] = useState<number | null>(null);
  const [room, setRoom] = useState<number>();
  const [username, setUsername] = useState("");
  const [groupChats, setGroupChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isConvOpen, setIsConvOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<
    { sender: string; message: string }[]
  >([]);
  const [showValidationForm, setShowValidationForm] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        if (decodedToken?.userId) {
          setIdUser(decodedToken.userId);
        }
      } catch (error) {
        console.error("Erreur lors du décodage du token:", error);
        setError("Impossible de vous identifier. Veuillez vous reconnecter.");
      }
    } else {
      setError("Veuillez vous connecter pour accéder à la messagerie.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!idUser) return;

    const fetchChats = async () => {
      setLoading(true);
      try {
        const chats = await displayUserChats(idUser);
        if (Array.isArray(chats)) {
          setGroupChats(chats);
        } else {
          console.error("Données invalides reçues:", chats);
          setError("Format de données incorrect");
          setGroupChats([]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des chats:", error);
        setError("Impossible de récupérer vos conversations");
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [idUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    socket.off("message");
    socket.off("user_joined");

    socket.on("message", (data) => {
      console.log("Message reçu via socket:", data);
      setMessages((prev) => [...prev, data]);
    });

    socket.on("user_joined", (message) => {
      console.log("Notification de connexion reçue:", message);
      setMessages((prev) => [...prev, { sender: "system", message }]);
    });

    return () => {
      socket.off("message");
      socket.off("user_joined");
    };
  }, [room]);

  useEffect(() => {
    if (showValidationForm) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [showValidationForm]);

  const handleJoinRoom = async (chat: Chat) => {
    setMessages([]);
    setRoom(chat.chat_id);
    setDonId(chat.don_id);

    setUsername(
      idUser === chat.donneur_id
        ? chat.donneur.username ||
            chat.donneur.commerce_name ||
            "Utilisateur inconnu"
        : chat.receveur.username ||
            chat.receveur.commerce_name ||
            "Utilisateur inconnu"
    );

    socket.emit("join-room", { room: chat.chat_id, username });

    try {
      const result = await GetChatMessages(chat.chat_id);
      if (result.success) {
        setMessages(result.messages);
      } else {
        console.error("Failed to load messages:", result.message);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }

    setIsConvOpen(true);
  };

  const handleSendMessage = async (message: string) => {
    if (!idUser || !room) return;

    const currentChat = groupChats.find((chat) => chat.chat_id === room);
    if (!currentChat) return;

    const receiverId =
      idUser === currentChat.donneur_id
        ? currentChat.receveur_id
        : currentChat.donneur_id;

    const socketData = {
      room: room,
      message: message,
      sender: username,
    };

    console.log("Envoi du message via socket:", socketData);
    socket.emit("message", socketData);

    setMessages((prev) => [...prev, { sender: username, message }]);

    const messageData = {
      content: message,
      author_id: idUser,
      receiver_id: receiverId,
      chat_id: parseInt(room.toString()),
    };

    try {
      const result = await StoreMessage(messageData);
      if (!result.success) {
        console.error("Échec du stockage du message:", result.message);
      }
    } catch (error) {
      console.error("Erreur lors du stockage du message:", error);
    }
  };

  const handleSendValidation = (validationMessage: {
    lieu: string;
    heure: string;
  }) => {
    const data = {
      room,
      message: JSON.stringify(validationMessage),
      sender: username,
    };

    setMessages((prev) => [
      ...prev,
      { sender: username, message: JSON.stringify(validationMessage) },
    ]);

    socket.emit("message", data);
  };

  if (loading)
    return <div className="p-4">Chargement des conversations...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="mt-4 p-4">
      <h1 className="font-bold mb-4 text-center font-futuraPTBold uppercase text-3xl">
        Messagerie
      </h1>
      <div className="flex items-center justify-center">
        {groupChats.length === 0 ? (
          <p>Aucune conversation trouvée.</p>
        ) : (
          <ul className="space-y-4 bg-gray-100 p-4 flex flex-col items-center justify-start w-[350px] h-[550px]">
            {groupChats.map((chat) => (
              <li
                key={chat.chat_id}
                className="border p-4 rounded-lg shadow-sm hover:bg-gray-50 w-full"
                onClick={() => handleJoinRoom(chat)}
              >
                <div className="flex justify-between mb-2">
                  <div className="font-medium">
                    {idUser === chat.donneur_id ? (
                      <div>
                        <span className="text-gray-500">
                          Conversation avec:
                        </span>{" "}
                        <span className="font-semibold">
                          {chat.receveur.username}
                        </span>
                        {chat.receveur.commerce_name && (
                          <span className="ml-2 text-sm text-gray-600">
                            ({chat.receveur.commerce_name})
                          </span>
                        )}
                      </div>
                    ) : (
                      <div>
                        <span className="text-gray-500">
                          Conversation avec:
                        </span>{" "}
                        <span className="font-semibold">
                          {chat.donneur.username}
                        </span>
                        {chat.donneur.commerce_name && (
                          <span className="font-semibold">
                            {chat.donneur.commerce_name}
                          </span>
                        )}
                      </div>
                    )}
                    <span className="text-sm text-blue-500">
                      Produit concerné : {chat.don.title}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        {!isConvOpen ? (
          <div className="w-[800px] h-[550px] bg-gray-200 flex items-center justify-center">
            <p className="font-extrabold font-futuraPTHeavy text-4xl">
              Aucune conversation cliquée
            </p>
          </div>
        ) : (
          <div className="w-[800px] h-[550px] bg-gray-200 flex items-center justify-center">
            {room && (
              <div className="w-full max-w-3xl mx-auto">
                <div className="overflow-y-auto p-4 mb-4 bg-gray-200 border-2 rounded-lg h-[475px]">
                  {messages.map((msg, index) => (
                    <ChatMessage
                      key={index}
                      sender={msg.sender}
                      message={msg.message}
                      isOwnMessage={msg.sender === username}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                {showValidationForm && (
                  <ValidationForm
                    onSendForm={handleSendValidation}
                    donId={donId}
                    onClose={() => setShowValidationForm(false)}
                  />
                )}
                <ChatForm
                  onSendMessage={handleSendMessage}
                  onValidateDonation={() => setShowValidationForm(true)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
