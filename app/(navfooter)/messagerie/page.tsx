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
import { useNotifications } from "@/app/_context/NotificationContext";

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
	const [messages, setMessages] = useState<
		{ sender: string; message: string; sentAt: Date }[]
	>([]);
	const [showValidationForm, setShowValidationForm] = useState(false);
	const { chatNotifications, markChatAsRead, incrementChatNotification } =
		useNotifications();

	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "nearest",
			inline: "start",
		});
	};
	// Add this effect to join all rooms when the component mounts
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

			// Ensure room is a number and rename senderId to be consistent
			const roomId =
				typeof data.room === "string" ? parseInt(data.room) : data.room;
			const senderID =
				data.senderID ||
				data.senderId ||
				(data.sender === username ? idUser : null);

			// Debug log to verify data
			console.log({
				roomId,
				senderID,
				currentRoom: room,
				currentUser: idUser,
			});

			if (roomId === room) {
				// Message is for the current active chat room
				setMessages((prev) => [
					...prev,
					{
						...data,
						senderID: senderID, // Ensure consistent naming
					},
				]);
			}

			// Update groupChats regardless of whether the chat is active or not
			setGroupChats((prevChats) => {
				return prevChats.map((chat) => {
					if (chat.chat_id === roomId) {
						const newMessage = {
							sentAt: new Date(),
							content: data.message,
							author_id: senderID,
						};

						// Put the new message at the beginning of the messages array
						return {
							...chat,
							messages: [newMessage, ...chat.messages],
						};
					}
					return chat;
				});
			});

			if (roomId !== room && senderID !== idUser) {
				console.log("Incrementing chat notification for room", roomId);
				incrementChatNotification(roomId);
			}
		});

		socket.on("user_joined", (message) => {
			console.log("Notification de connexion reçue:", message);
			setMessages((prev) => [
				...prev,
				{ sender: "system", message, sentAt: new Date() },
			]);
		});

		return () => {
			socket.off("message");
			socket.off("user_joined");
		};
	}, [room, username, idUser, incrementChatNotification]);

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
		}
		socket.emit("join-room", { room: chat.chat_id, username, userId: idUser });

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
			senderID: idUser,
			receiverId: receiverId,
		};

		console.log("Envoi du message via socket:", socketData);
		socket.emit("message", socketData);

		setMessages((prev) => [
			...prev,
			{
				sender: username,
				message,
				sentAt: new Date(),
				senderID: idUser,
			},
		]);

		setGroupChats((prevChats) => {
			return prevChats.map((chat) => {
				if (chat.chat_id === room) {
					// Create a new message object that matches the structure in groupChats
					const newMessage = {
						sentAt: new Date(),
						content: message,
						author_id: idUser || 0,
					};

					// Put the new message at the beginning of the messages array
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

		const data = {
			room: room,
			message: validationStr,
			sender: username,
			senderID: idUser,
			receiverId: receiverId,
		};

		setMessages((prev) => [
			...prev,
			{
				sender: username,
				message: validationStr,
				sentAt: new Date(),
				senderID: idUser,
			},
		]);

		setGroupChats((prevChats) => {
			return prevChats.map((chat) => {
				if (chat.chat_id === room) {
					const newMessage = {
						sentAt: new Date(),
						content: validationStr,
						author_id: idUser || 0,
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
		};

		try {
			StoreMessage(messageData);
		} catch (error) {
			console.error("Erreur lors du stockage du message de validation:", error);
		}
	};

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
						{groupChats.map((chat) => (
							<li
								key={chat.chat_id}
								className={`border p-4 rounded-lg shadow-sm hover:bg-gray-50 w-full relative transition-all duration-200 ${
									chatNotifications[chat.chat_id] > 0
										? "border-red-400 bg-red-50"
										: "border-gray-200"
								}`}
								onClick={() => handleJoinRoom(chat)}>
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
													{chat.messages[0].author_id === idUser
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
										return (
											<ChatMessage
												key={index}
												sender={msg.sender}
												message={msg.message}
												sentAt={
													msg.sentAt instanceof Date
														? msg.sentAt.toISOString()
														: typeof msg.sentAt === "string"
														? msg.sentAt
														: new Date().toISOString()
												}
												isOwnMessage={msg.sender === username}
											/>
										);
									})}
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
