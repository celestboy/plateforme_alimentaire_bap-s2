import { MessageSchemaType, ValidateSchemaType } from "@/types/forms";
import prisma from "../prisma/prisma";

class MessagesController {
	async store(data: MessageSchemaType) {
		const message = await prisma.messages.create({
			data: {
				content: data.content,
				author_id: data.author_id,
				receiver_id: data.receiver_id,
				chat_id: data.chat_id,
				read: false,
			},
		});
		return message;
	}

	async validatedRDV(info: ValidateSchemaType, id_don: number) {
		const parsedHeureValid = new Date(info.heure);
		if (isNaN(parsedHeureValid.getTime())) {
			throw new Error(
				"Date invalide, assurez-vous qu'elle est au format ISO-8601."
			);
		}

		const changeStatus = await prisma.dons.update({
			where: {
				don_id: id_don,
			},
			data: {
				status: true,
				lieu: info.lieu,
				Heure: parsedHeureValid,
			},
		});

		return [changeStatus];
	}

	async deleteRDV(id_don: number) {
		const supp = await prisma.dons.delete({
			where: {
				don_id: id_don,
			},
		});
		return supp;
	}

	async getByChatId(chatId: number) {
		try {
			const messages = await prisma.messages.findMany({
				where: { chat_id: chatId },
				orderBy: { sentAt: "asc" },
				include: {
					author: {
						select: {
							user_id: true,
							username: true,
							commerce_name: true,
						},
					},
				},
			});

			return messages;
		} catch (error) {
			console.error("Error getting messages by chat ID:", error);
			return null;
		}
	}

	async getUnreadCountsByUser(userId: number) {
		try {
			// Get all chats where the user is a participant
			const chats = await prisma.chats.findMany({
				where: {
					OR: [{ donneur_id: userId }, { receveur_id: userId }],
				},
				select: {
					chat_id: true,
					messages: {
						where: {
							receiver_id: userId,
							read: false,
						},
						select: {
							message_id: true,
						},
					},
				},
			});

			// Format the counts by chat_id for easy consumption
			const unreadCounts: Record<number, number> = {};

			chats.forEach((chat) => {
				if (chat.messages.length > 0) {
					unreadCounts[chat.chat_id] = chat.messages.length;
				}
			});

			return unreadCounts;
		} catch (error) {
			console.error("Error getting unread counts:", error);
			throw error;
		}
	}

	async markAsRead(chatId: number, userId: number) {
		try {
			await prisma.messages.updateMany({
				where: {
					chat_id: chatId,
					receiver_id: userId,
					read: false,
				},
				data: {
					read: true,
				},
			});

			return true;
		} catch (error) {
			console.error("Error marking messages as read:", error);
			throw error;
		}
	}
}

const MessagesControllerInstance = new MessagesController();
export default MessagesControllerInstance;
