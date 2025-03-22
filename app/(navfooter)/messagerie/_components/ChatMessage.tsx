import validateForm from "@/actions/validate-form";
import { ValidateSchemaType } from "@/types/forms";
import React from "react";

interface ChatMessageProps {
	sender: string;
	sentAt: string;
	message: string;
	isOwnMessage: boolean;
	donId?: number | null;
	isSystemMessage?: boolean;
}

const ChatMessage = ({
	sender,
	message,
	sentAt,
	isOwnMessage,
	donId,
	isSystemMessage = false,
}: ChatMessageProps) => {
	let parsedMessage;
	try {
		parsedMessage = JSON.parse(message);
	} catch {
		parsedMessage = message;
	}

	console.log("isSystemMessage:", isSystemMessage);

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

	const handleAccept = async () => {
		console.log("hello");
		try {
			// Préparer les données à envoyer à validateForm
			const data: ValidateSchemaType = {
				id_don: donId !== null && donId !== undefined ? donId : 0,
				lieu: parsedMessage.lieu,
				heure: parsedMessage.heure,
			};

			const response = await validateForm(data);
			console.log("Response:", response);

			// Afficher une confirmation à l'utilisateur
			if (response?.success) {
				alert("Offre acceptée avec succès!");
			} else {
				alert(
					"Erreur lors de l'acceptation: " +
						(response?.message || "Erreur inconnue")
				);
			}
		} catch (error) {
			console.error("Erreur lors de l'acceptation:", error);
			alert("Une erreur s'est produite lors de l'acceptation de l'offre.");
		}
		console.log("adios");
	};

	const handleReject = () => {
		alert("Tu as refusé l'offre.");
	};

	// Update the return statement in ChatMessage

	return (
		<div
			className={`flex ${
				isSystemMessage
					? "justify-center"
					: isOwnMessage
					? "justify-end"
					: "justify-start"
			} mb-3`}>
			<div
				className={`w-auto px-4 py-2 rounded-lg ${
					isSystemMessage
						? "bg-gray-800 text-white text-center text-sm"
						: isOwnMessage
						? "bg-base-green text-white"
						: "bg-white text-black"
				}`}>
				{isSystemMessage ? (
					<div className="flex items-center justify-center gap-2 mb-1">
						<p className="font-futuraPTMedium text-sm text-gray-300">Système</p>
						<p className="font-futuraPTBook text-xs text-gray-300">
							{typeof formattedDate === "string"
								? formattedDate
								: `${formattedDate.date} ${formattedDate.time}`}
						</p>
					</div>
				) : (
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
								className={`px-4 py-1 rounded-lg ${
									isOwnMessage
										? "bg-green-300 cursor-not-allowed"
										: "bg-green-500 text-white hover:bg-green-600"
								}`}
								disabled={isOwnMessage}>
								Accepter
							</button>
							<button
								onClick={handleReject}
								className={`px-4 py-1 rounded-lg ${
									isOwnMessage
										? "bg-red-300 cursor-not-allowed"
										: "bg-red-500 text-white hover:bg-red-600"
								}`}
								disabled={isOwnMessage}>
								Refuser
							</button>
						</div>
					</div>
				) : (
					<p
						className={`${
							isSystemMessage ? "text-base italic" : "text-lg font-futuraPTBook"
						}`}>
						{message}
					</p>
				)}
			</div>
		</div>
	);
};

export default ChatMessage;
