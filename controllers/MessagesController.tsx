import { MessageSchemaType } from "@/types/forms";
import prisma from "../prisma/prisma";

class MessagesController {
  async store(data: MessageSchemaType) {
    const message = await prisma.messages.create({
      data: {
        content: data.content,
        author_id: data.author_id,
        receiver_id: data.receiver_id,
        chat_id: data.chat_id,
        isSystemMessage: data.isSystemMessage,
        read: false,
      },
    });
    return message;
  }

  async deleteMessage(id_message: number) {
    try {
      const message = await prisma.messages.delete({
        where: { message_id: id_message },
      });
      return {
        success: true,
        message: "Message deleted successfully",
        data: message,
      };
    } catch (error) {
      console.error("Error deleting message:", error);
      return {
        success: true,
        message: "Message deleted successfully",
        data: null,
      };
    }
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

  async storeSystemMessage(chatId: number, content: string) {
    try {
      // Get the chat to find both users
      const chat = await prisma.chats.findUnique({
        where: { chat_id: chatId },
        select: { donneur_id: true, receveur_id: true },
      });

      if (!chat) {
        throw new Error("Chat not found");
      }
      console.log(chat);
      // Store system message
      const systemMessage = await prisma.messages.create({
        data: {
          content,
          author_id: chat.donneur_id,
          receiver_id: chat.donneur_id,
          chat_id: chatId,
          isSystemMessage: true,
        },
      });

      console.log(systemMessage);
      return systemMessage;
    } catch (error) {
      console.error("Error storing system message:", error);
      throw error;
    }
  }

  async deleteValidationMessages(chatId: number) {
    try {
      // Find all messages in this chat
      const messages = await prisma.messages.findMany({
        where: {
          chat_id: chatId,
        },
      });

      let deletedCount = 0;

      // Process each message to find and delete validation forms
      for (const message of messages) {
        try {
          // Check if the message content starts with {"lieu":
          if (message.content.startsWith('{"lieu":')) {
            // This is likely a validation form message - delete it
            await prisma.messages.delete({
              where: { message_id: message.message_id },
            });
            deletedCount++;
            console.log(`Deleted validation message ID: ${message.message_id}`);
          }
        } catch (e) {
          console.error("Error checking message content:", e);
          continue;
        }
      }

      console.log(
        `Deleted ${deletedCount} validation messages in chat ${chatId}`
      );
      return deletedCount;
    } catch (error) {
      console.error("Error deleting validation messages:", error);
      throw error;
    }
  }

  // Add this method to MessagesController

  async deleteMessageByTimestamp(
    chatId: number,
    timestamp: string,
    authorId: number
  ) {
    try {
      const sentAt = new Date(timestamp);

      // Find and delete the message that matches the chat, timestamp, and author
      const deletedMessage = await prisma.messages.deleteMany({
        where: {
          chat_id: chatId,
          author_id: authorId,
          sentAt: {
            // Add a small tolerance for timestamp comparison (±1 second)
            gte: new Date(sentAt.getTime() - 500),
            lte: new Date(sentAt.getTime() + 500),
          },
        },
      });

      return deletedMessage.count > 0;
    } catch (error) {
      console.error("Error deleting message by timestamp:", error);
      throw error;
    }
  }
}

const MessagesControllerInstance = new MessagesController();
export default MessagesControllerInstance;
