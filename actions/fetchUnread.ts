"use server";

import MessagesControllerInstance from "@/controllers/MessagesController";

export default async function fetchUnreadMessages(userId: number) {
	try {
		const unreadCounts = await MessagesControllerInstance.getUnreadCountsByUser(
			userId
		);
		return { success: true, unreadCounts };
	} catch (error) {
		console.error("Error fetching unread messages:", error);
		return {
			success: false,
			message: "Failed to fetch unread messages",
			unreadCounts: {},
		};
	}
}
