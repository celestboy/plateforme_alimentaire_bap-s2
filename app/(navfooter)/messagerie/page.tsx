"use client";

import displayUserChats from "@/actions/get-user-chats";
import { useState, useEffect, useRef, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import ChatMessage from "./_components/ChatMessage";
import ChatForm from "./_components/ChatForm";
import { socket } from "@/lib/socketClient";
import StoreMessage from "@/actions/store-message";
import GetChatMessages from "@/actions/get-chat-messages";
import ValidationForm from "./_components/NewValidationForm";
import { useNotifications } from "@/app/_context/NotificationContext";
import getDonStatus from "@/actions/get-don-status";
import getSingleChat from "@/actions/get-single-chat";
import { DonStatus } from "@prisma/client";

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
  messages: {
    sentAt: Date;
    content: string;
    author_id: number;
    isSystemMessage: boolean;
  }[];
  unreadCount?: number;
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
  const [status, setStatus] = useState({
    isAccepted: false,
    isPending: false,
    isRefused: false,
  });
  const [messages, setMessages] = useState<
    {
      sender: string;
      message: string;
      sentAt: Date;
      isSystemMessage?: boolean;
    }[]
  >([]);
  const [showValidationForm, setShowValidationForm] = useState(false);
  const { chatNotifications, markChatAsRead, incrementChatNotification } =
    useNotifications();

  // Add this state to track chats that need fetching
  const [pendingNewChats, setPendingNewChats] = useState<number[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  useEffect(() => {
    if (!idUser) return;

    // Join user-specific notification room
    socket.emit("join_user_room", idUser);

    // Clean up on component unmount
    return () => {
      socket.off("new_chat");
    };
  }, [idUser]);

  useEffect(() => {
    async function fetchStatus() {
      if (donId !== null && room !== undefined) {
        const newStatus = (await getDonStatus(donId, room)) as unknown as {
          isAccepted: boolean;
          isPending: boolean;
          isRefused: boolean;
        };
        setStatus(newStatus);
      }
    }

    fetchStatus();
  }, [donId, room]);

  useEffect(() => {
    if (!idUser || groupChats.length === 0) return;

    // Join all rooms on component mount to receive messages for all rooms
    console.log("Joining all chat rooms for notifications");
    groupChats.forEach((chat) => {
      console.log(`Joining room ${chat.chat_id}`);
      socket.emit("join-room", {
        room: chat.chat_id,
        username,
        userId: idUser,
      });
    });

    return () => {
      // Leave rooms when component unmounts
      groupChats.forEach((chat) => {
        socket.emit("leave-room", {
          room: chat.chat_id,
          userId: idUser,
        });
      });
    };
  }, [idUser, groupChats, username]);

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
          // Format dates in chat messages
          const formattedChats = chats.map((chat) => ({
            ...chat,
            messages: chat.messages.map((msg) => ({
              ...msg,
              sentAt: msg.sentAt, // We'll format this when displaying
            })),
          }));
          setGroupChats(formattedChats);
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

  // New effect to handle pending chat fetches
  useEffect(() => {
    // Skip if no pending chats or user not authenticated
    if (pendingNewChats.length === 0 || !idUser) {
      return;
    }

    console.log("Processing pending chats:", pendingNewChats);

    // Create a copy of pending chats
    const chatsToFetch = [...pendingNewChats];

    // Clear the pending list immediately
    setPendingNewChats([]);

    // Process each chat ID
    const fetchChats = async () => {
      for (const chatId of chatsToFetch) {
        // Double-check chat doesn't already exist in state
        if (groupChats.some((chat) => chat.chat_id === chatId)) {
          console.log(
            `Chat ${chatId} already exists in state - skipping fetch`
          );
          continue;
        }

        try {
          console.log(`Fetching details for chat ${chatId}`);
          const result = await getSingleChat(chatId);

          if (result.success && result.data) {
            // Format dates in messages
            const formattedChat = {
              ...result.data,
              messages: Array.isArray(result.data.messages)
                ? result.data.messages.map((msg) => ({
                    ...msg,
                    sentAt: new Date(msg.sentAt || new Date()),
                  }))
                : [],
            };

            // Add to state
            setGroupChats((currentChats) => {
              // Final check for duplicates
              if (currentChats.some((chat) => chat.chat_id === chatId)) {
                return currentChats;
              }
              return [...currentChats, formattedChat];
            });
          }
        } catch (error) {
          console.error(`Error fetching chat ${chatId}:`, error);
        }
      }
    };

    fetchChats();
  }, [pendingNewChats, idUser, groupChats]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    socket.off("message");
    socket.off("user_joined");
    socket.off("local-system-message");
    socket.off("new_chat");
    socket.off("status_update");

    socket.on("message", (data) => {
      console.log("Message reçu via socket:", data);

      const roomId =
        typeof data.room === "string" ? parseInt(data.room) : data.room;
      const senderID =
        data.senderID ||
        data.senderId ||
        (data.sender === username ? idUser : null);

      console.log({
        roomId,
        senderID,
        currentRoom: room,
        currentUser: idUser,
      });

      if (roomId === room) {
        setMessages((prev) => {
          if (
            prev.some(
              (msg) =>
                msg.sentAt.getTime() ===
                  new Date(data.sentAt || new Date()).getTime() &&
                msg.message === data.message &&
                msg.sender === data.sender
            )
          ) {
            return prev;
          }

          return [
            ...prev,
            {
              ...data,
              senderID: senderID,
              sentAt: new Date(data.sentAt || new Date()),
            },
          ];
        });

        if (senderID !== idUser) {
          markChatAsRead(roomId);
          console.log("Marking chat as read:", roomId);
        }
      } else if (senderID !== idUser) {
        // If message is for another room and not from the current user, increment notification
        console.log("Incrementing chat notification for room", roomId);
        incrementChatNotification(roomId);
      }

      setGroupChats((prevChats) => {
        return prevChats.map((chat) => {
          if (chat.chat_id === roomId) {
            const newMessage = {
              sentAt: new Date(data.sentAt || new Date()),
              content: data.message,
              author_id: senderID,
              isSystemMessage: !!data.isSystemMessage,
            };

            const messageExists = chat.messages.some(
              (msg) =>
                new Date(msg.sentAt).getTime() ===
                  newMessage.sentAt.getTime() &&
                msg.content === newMessage.content &&
                msg.author_id === newMessage.author_id
            );

            if (messageExists) {
              return chat;
            }

            return {
              ...chat,
              messages: [newMessage, ...chat.messages],
            };
          }
          return chat;
        });
      });
    });

    socket.on("status_update", (data) => {
      console.log("Status update received:", data);

      // Get the room and donId as numbers for reliable comparison
      const updateRoomId =
        typeof data.room === "string" ? parseInt(data.room) : data.room;
      const updateDonId =
        typeof data.donId === "string" ? parseInt(data.donId) : data.donId;

      console.log(
        `Status update for room ${updateRoomId}, donId ${updateDonId}, status: ${data.status}`
      );

      // Update the local state immediately if it's the current chat
      if (updateRoomId === room && updateDonId === donId) {
        console.log("Updating current chat status to:", data.status);
        // Update the status state based on the status value
        setStatus({
          isAccepted: data.status === DonStatus.ACCEPTED,
          isPending: data.status === DonStatus.PENDING,
          isRefused: data.status === DonStatus.REFUSED,
        });

        // Also mark as read if we're viewing this chat
        markChatAsRead(updateRoomId);
      } else {
        // If it's for another room, increment notification count
        incrementChatNotification(updateRoomId);
      }
    });

    socket.on("user_joined", (message) => {
      console.log("Notification de connexion reçue:", message);
      setMessages((prev) => [
        ...prev,
        { sender: "system", message, sentAt: new Date() },
      ]);
    });

    socket.on("local-system-message", (data) => {
      console.log("Local system message:", data);

      // Ensure room is a number
      const roomId =
        typeof data.room === "string" ? parseInt(data.room) : data.room;

      // If system message is for current active chat and we're viewing this chat, mark as read
      if (roomId === room) {
        console.log("System message received in active room - marking as read");
        markChatAsRead(roomId);
      } else {
        // If it's for another room, increment notification count
        incrementChatNotification(roomId);
      }
      if (roomId === room) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "Système",
            message: data.message,
            sentAt: new Date(data.sentAt || new Date()),
            isSystemMessage: true,
          },
        ]);
      }

      // Also update the groupChats state to include this system message
      setGroupChats((prevChats) => {
        return prevChats.map((chat) => {
          if (chat.chat_id === roomId) {
            const newMessage = {
              sentAt: new Date(data.sentAt || new Date()),
              content: data.message,
              author_id: 0, // System message from system
              isSystemMessage: true,
            };

            // Check if this message already exists in the chat messages
            const messageExists = chat.messages.some(
              (msg) =>
                new Date(msg.sentAt).getTime() ===
                  newMessage.sentAt.getTime() &&
                msg.content === newMessage.content &&
                msg.isSystemMessage === true
            );

            if (messageExists) {
              return chat; // Don't add duplicate messages
            }

            // Put the new message at the beginning of the messages array
            return {
              ...chat,
              messages: [newMessage, ...chat.messages],
            };
          }
          return chat;
        });
      });
    });

    // Updated new_chat handler that doesn't cause React errors
    socket.on("new_chat", (chatData) => {
      console.log("New chat notification received:", chatData);

      // Only proceed if this chat is relevant to the current user
      if (chatData.donneur_id !== idUser && chatData.receveur_id !== idUser) {
        console.log("Chat not relevant to current user");
        return;
      }

      // Check if the chat already exists in state
      const chatExists = groupChats.some(
        (chat) => chat.chat_id === chatData.chat_id
      );

      if (chatExists) {
        console.log("Chat already exists in state - not adding it again");
        return;
      }

      // Add to pending chats for processing in useEffect
      setPendingNewChats((prev) => {
        // Avoid duplicates
        if (prev.includes(chatData.chat_id)) {
          return prev;
        }
        return [...prev, chatData.chat_id];
      });
      incrementChatNotification(chatData.chat_id);
    });

    return () => {
      socket.off("message");
      socket.off("user_joined");
      socket.off("local-system-message");
      socket.off("new_chat");
      socket.off("status_update");
    };
  }, [
    room,
    username,
    idUser,
    incrementChatNotification,
    markChatAsRead,
    groupChats,
    donId,
  ]);

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
    if (idUser) {
      markChatAsRead(chat.chat_id);
      console.log("Marking chat as read:", chat.chat_id);
    }
    socket.emit("join-room", { room: chat.chat_id, username, userId: idUser });

    try {
      const result = await GetChatMessages(chat.chat_id);
      if (result.success) {
        setMessages(
          result.messages.map((msg) => ({
            sender: msg.sender,
            message: msg.message,
            sentAt: new Date(msg.sentAt),
            senderID: msg.sender,
            isSystemMessage: msg.isSystemMessage || false,
          }))
        );
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

    const currentTime = new Date();

    const socketData = {
      room: room,
      message: message,
      sender: username,
      senderID: idUser,
      receiverId: receiverId,
      sentAt: currentTime.toISOString(),
    };

    console.log("Envoi du message via socket:", socketData);
    socket.emit("message", socketData);

    setMessages((prev) => [
      ...prev,
      {
        sender: username,
        message,
        sentAt: currentTime,
        senderID: idUser,
      },
    ]);

    setGroupChats((prevChats) => {
      return prevChats.map((chat) => {
        if (chat.chat_id === room) {
          const newMessage = {
            sentAt: currentTime,
            content: message,
            author_id: idUser,
            isSystemMessage: false,
          };

          return {
            ...chat,
            messages: [newMessage, ...chat.messages],
          };
        }
        return chat;
      });
    });

    const messageData = {
      content: message,
      author_id: idUser,
      receiver_id: receiverId,
      chat_id: parseInt(room.toString()),
      sentAt: currentTime.toISOString(),
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
    if (!idUser || !room || !donId) return;
    const validationStr = JSON.stringify(validationMessage);

    const currentChat = groupChats.find((chat) => chat.chat_id === room);
    if (!currentChat) return;

    const receiverId =
      idUser === currentChat.donneur_id
        ? currentChat.receveur_id
        : currentChat.donneur_id;

    const currentTime = new Date();

    const data = {
      room: room,
      message: validationStr,
      sender: username,
      senderID: idUser,
      receiverId: receiverId,
      sentAt: currentTime.toISOString(),
      isSystemMessage: false,
    };

    setMessages((prev) => [
      ...prev,
      {
        sender: username,
        message: validationStr,
        sentAt: currentTime,
        senderID: idUser,
        isSystemMessage: false,
      },
    ]);

    setGroupChats((prevChats) => {
      return prevChats.map((chat) => {
        if (chat.chat_id === room) {
          const newMessage = {
            sentAt: currentTime,
            content: validationStr,
            author_id: idUser,
            isSystemMessage: false,
          };

          return {
            ...chat,
            messages: [newMessage, ...chat.messages],
          };
        }
        return chat;
      });
    });

    socket.emit("message", data);

    // Also store this validation message in the database
    const messageData = {
      content: validationStr,
      author_id: idUser,
      receiver_id: receiverId,
      chat_id: parseInt(room.toString()),
      sentAt: currentTime.toISOString(),
    };

    try {
      StoreMessage(messageData);
    } catch (error) {
      console.error("Erreur lors du stockage du message de validation:", error);
    }
  };

  const sortChatsByLatestMessage = (chats: Chat[]): Chat[] => {
    return [...chats].sort((a, b) => {
      // Get the most recent message timestamp for each chat (or use epoch start if no messages)
      const aLatest =
        a.messages.length > 0 ? new Date(a.messages[0].sentAt).getTime() : 0;

      const bLatest =
        b.messages.length > 0 ? new Date(b.messages[0].sentAt).getTime() : 0;

      // Sort in descending order (newest first)
      return bLatest - aLatest;
    });
  };

  // Apply sorting when displaying chats
  const sortedGroupChats = useMemo(() => {
    return sortChatsByLatestMessage(groupChats);
  }, [groupChats]);

  if (loading)
    return <div className="p-4">Chargement des conversations...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="mt-4 p-4">
      <div className="flex items-center justify-center">
        {groupChats.length === 0 ? (
          <p>Aucune conversation trouvée.</p>
        ) : (
          <ul className="space-y-4 bg-gray-100 p-4 flex flex-col items-center justify-start w-[350px] h-[550px] overflow-y-auto">
            {sortedGroupChats.map((chat) => (
              <li
                key={chat.chat_id}
                className={`border p-4 rounded-lg shadow-sm hover:bg-gray-50 w-full relative transition-all duration-200 ${
                  chatNotifications[chat.chat_id] > 0
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200"
                }`}
                onClick={() => handleJoinRoom(chat)}
              >
                {chatNotifications[chat.chat_id] > 0 && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
                    {chatNotifications[chat.chat_id] > 9
                      ? "9+"
                      : chatNotifications[chat.chat_id]}
                  </span>
                )}
                <div className="flex justify-between mb-2">
                  <div className="">
                    {idUser === chat.donneur_id ? (
                      <div>
                        <span className="font-futuraPTBold text-xl">
                          {chat.receveur.username}
                        </span>
                        {chat.receveur.commerce_name && (
                          <span className="font-futuraPTBold text-xl">
                            ({chat.receveur.commerce_name})
                          </span>
                        )}
                      </div>
                    ) : (
                      <div>
                        <span className="font-futuraPTBold text-xl">
                          {chat.donneur.username}
                        </span>
                        {chat.donneur.commerce_name && (
                          <span className="font-futuraPTBold text-xl">
                            {chat.donneur.commerce_name}
                          </span>
                        )}
                      </div>
                    )}
                    <span className="text-sm font-futuraPTBook text-base-green">
                      Produit concerné : {chat.don.title}
                    </span>
                    {chat.messages.length > 0 ? (
                      <p className="text-base font-futuraPTBook text-gray-500 truncate max-w-[260px]">
                        <strong className="text-base font-futuraPTBook mr-2 text-black">
                          {/* Handle system messages differently */}
                          {chat.messages[0].isSystemMessage
                            ? "Système"
                            : chat.messages[0].author_id === idUser
                            ? "Vous"
                            : "Reçu"}{" "}
                          :
                        </strong>
                        {chat.messages[0].content}
                      </p>
                    ) : (
                      <p className="text-base font-futuraPTBook text-gray-500">
                        Aucun message
                      </p>
                    )}
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
                  {messages.map((msg, index) => {
                    const currentChat = groupChats.find(
                      (chat) => chat.chat_id === room
                    );
                    const donneurId = currentChat
                      ? currentChat.donneur_id
                      : null;
                    const receveurId = currentChat
                      ? currentChat.receveur_id
                      : null;
                    return (
                      <ChatMessage
                        key={index}
                        sender={msg.sender}
                        donneur_id={donneurId ?? 0}
                        receveur_id={receveurId ?? 0}
                        message={msg.message}
                        sentAt={
                          msg.sentAt instanceof Date
                            ? msg.sentAt.toISOString()
                            : typeof msg.sentAt === "string"
                            ? msg.sentAt
                            : new Date().toISOString()
                        }
                        isOwnMessage={msg.sender === username}
                        donId={donId}
                        isSystemMessage={msg.isSystemMessage}
                        room={room}
                        isAccepted={status.isAccepted}
                        isRefused={status.isRefused}
                      />
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
                {showValidationForm && (
                  <ValidationForm
                    onSendForm={handleSendValidation}
                    donId={donId}
                    chatId={room}
                    onClose={() => setShowValidationForm(false)}
                  />
                )}
                <ChatForm
                  onSendMessage={handleSendMessage}
                  onValidateDonation={() => setShowValidationForm(true)}
                  donId={donId}
                  chatId={room || null}
                  currentStatus={
                    status.isAccepted
                      ? DonStatus.ACCEPTED
                      : status.isPending
                      ? DonStatus.PENDING
                      : status.isRefused
                      ? DonStatus.REFUSED
                      : null
                  }
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
