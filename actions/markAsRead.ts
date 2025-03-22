"use server";

import MessagesControllerInstance from "@/controllers/MessagesController";

export default async function markMessagesAsRead(
	chatId: number,
	userId: number
) {
	try {
		await MessagesControllerInstance.markAsRead(chatId, userId);
		return { success: true };
	} catch (error) {
		console.error("Error marking messages as read:", error);
		return { success: false, message: "Failed to mark messages as read" };
	}
}
