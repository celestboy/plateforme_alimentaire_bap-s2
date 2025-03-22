"use client";

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";
import { socket } from "@/lib/socketClient";
import fetchUnreadMessages from "@/actions/fetchUnread";
import markMessagesAsRead from "@/actions/markAsRead";

interface JwtPayload {
	userId: number;
	email: string;
}

interface NotificationContextType {
	totalUnread: number;
	chatNotifications: Record<number, number>;
	markChatAsRead: (chatId: number) => void;
	incrementChatNotification: (chatId: number) => void;
	refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
	undefined
);

export const NotificationProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [userId, setUserId] = useState<number | null>(null);
	const [chatNotifications, setChatNotifications] = useState<
		Record<number, number>
	>({});

	const totalUnread = Object.values(chatNotifications).reduce(
		(sum, count) => sum + count,
		0
	);

	const refreshNotifications = useCallback(async () => {
		if (!userId) return;

		try {
			const result = await fetchUnreadMessages(userId);
			if (result.success) {
				setChatNotifications(result.unreadCounts);

				// Also save to localStorage as backup
				localStorage.setItem(
					"chatNotifications",
					JSON.stringify(result.unreadCounts)
				);
			} else {
				console.error("Failed to fetch notifications:", result.message);

				// If API fails, try to load from localStorage as fallback
				const savedNotifications = localStorage.getItem("chatNotifications");
				if (savedNotifications) {
					setChatNotifications(JSON.parse(savedNotifications));
				}
			}
		} catch (error) {
			console.error("Error refreshing notifications:", error);
		}
	}, [userId]);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			try {
				const decodedToken = jwtDecode<JwtPayload>(token);
				if (decodedToken?.userId) {
					setUserId(decodedToken.userId);
				}
			} catch (error) {
				console.error("Error decoding token:", error);
			}
		}

		const savedNotifications = localStorage.getItem("chatNotifications");
		if (savedNotifications) {
			setChatNotifications(JSON.parse(savedNotifications));
		}
	}, []);

	useEffect(() => {
		if (userId) {
			refreshNotifications();
		}
	}, [userId, refreshNotifications]);

	useEffect(() => {
		if (Object.keys(chatNotifications).length > 0) {
			localStorage.setItem(
				"chatNotifications",
				JSON.stringify(chatNotifications)
			);
		}
	}, [chatNotifications]);

	const markChatAsRead = async (chatId: number) => {
		if (!userId) return;

		// Update UI immediately for responsiveness
		setChatNotifications((prev) => {
			const updated = { ...prev };
			delete updated[chatId];
			return updated;
		});

		// Then update database in background
		try {
			await markMessagesAsRead(chatId, userId);
		} catch (error) {
			console.error("Error marking messages as read:", error);
			// On error, refresh notifications to stay in sync
			refreshNotifications();
		}
	};

	const incrementChatNotification = useCallback((chatId: number) => {
		if (!chatId || isNaN(chatId)) {
			console.error("Invalid chat ID:", chatId);
			return;
		}

		setChatNotifications((prev) => {
			const updated = {
				...prev,
				[chatId]: (prev[chatId] || 0) + 1,
			};

			// Save updated notifications to localStorage
			localStorage.setItem("chatNotifications", JSON.stringify(updated));

			return updated;
		});
	}, []);

	useEffect(() => {
		if (!userId) return;

		socket.on("message", (data) => {
			const roomId =
				typeof data.room === "string" ? parseInt(data.room) : data.room;

			if (roomId && data.senderID !== userId) {
				incrementChatNotification(data.room);
			}
		});

		return () => {
			socket.off("message");
		};
	}, [userId, incrementChatNotification]);

	return (
		<NotificationContext.Provider
			value={{
				totalUnread,
				chatNotifications,
				markChatAsRead,
				incrementChatNotification,
				refreshNotifications,
			}}>
			{children}
		</NotificationContext.Provider>
	);
};

export const useNotifications = () => {
	const context = useContext(NotificationContext);
	if (context === undefined) {
		throw new Error(
			"useNotifications must be used within a NotificationProvider"
		);
	}
	return context;
};
