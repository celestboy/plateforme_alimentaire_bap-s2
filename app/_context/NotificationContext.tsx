"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { socket } from "@/lib/socketClient";
import fetchUnreadMessages from "@/actions/fetchUnread";
import markMessagesAsRead from "@/actions/markAsRead";
import { useAuth } from "./AuthContext";

interface NotificationContextType {
  totalUnread: number;
  chatNotifications: Record<number, number>;
  markChatAsRead: (chatId: number) => void;
  incrementChatNotification: (chatId: number) => void;
  refreshNotifications: () => Promise<void>;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { userId: authUserId, isAuthenticated } = useAuth();
  const [chatNotifications, setChatNotifications] = useState<
    Record<number, number>
  >({});

  const totalUnread = Object.values(chatNotifications).reduce(
    (sum, count) => sum + count,
    0
  );

  const refreshNotifications = useCallback(async () => {
    if (!authUserId || !isAuthenticated) {
      setChatNotifications({});
      return;
    }

    try {
      const result = await fetchUnreadMessages(authUserId);
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
  }, [authUserId, isAuthenticated]);

  const clearAllNotifications = useCallback(() => {
    setChatNotifications({});
    localStorage.removeItem("chatNotifications");
  }, []);

  // Load notifications from localStorage on mount
  useEffect(() => {
    if (isAuthenticated) {
      const savedNotifications = localStorage.getItem("chatNotifications");
      if (savedNotifications) {
        setChatNotifications(JSON.parse(savedNotifications));
      }

      // Also refresh from server
      refreshNotifications();
    } else {
      clearAllNotifications();
    }
  }, [isAuthenticated, refreshNotifications, clearAllNotifications]);

  // Save notifications to localStorage when they change
  useEffect(() => {
    if (Object.keys(chatNotifications).length > 0) {
      localStorage.setItem(
        "chatNotifications",
        JSON.stringify(chatNotifications)
      );
    }
  }, [chatNotifications]);

  const markChatAsRead = async (chatId: number) => {
    if (!authUserId) return;

    // Update UI immediately for responsiveness
    setChatNotifications((prev) => {
      const updated = { ...prev };
      delete updated[chatId];
      return updated;
    });

    // Then update database in background
    try {
      await markMessagesAsRead(chatId, authUserId);
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
    if (!authUserId) return;

    socket.on("message", (data) => {
      const roomId =
        typeof data.room === "string" ? parseInt(data.room) : data.room;

      if (roomId && data.senderID !== authUserId) {
        incrementChatNotification(data.room);
      }
    });

    return () => {
      socket.off("message");
    };
  }, [authUserId, incrementChatNotification]);

  return (
    <NotificationContext.Provider
      value={{
        totalUnread,
        chatNotifications,
        markChatAsRead,
        incrementChatNotification,
        refreshNotifications,
        clearAllNotifications,
      }}
    >
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
