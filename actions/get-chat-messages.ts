// app/actions/get-chat-messages.ts
"use server";

import MessagesController from "@/controllers/MessagesController";

const GetChatMessages = async (chatId: number) => {
  try {
    const messages = await MessagesController.getByChatId(chatId);

    if (!messages) {
      return {
        success: false,
        message: "Impossible de récupérer les messages",
        messages: [],
      };
    }

    return {
      success: true,
      messages: messages.map((msg) => ({
        sender:
          msg.author?.username ||
          msg.author?.commerce_name ||
          "Utilisateur inconnu",
        message: msg.content,
        sentAt: msg.sentAt,
      })),
    };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return {
      success: false,
      message: "Impossible de récupérer les messages",
      messages: [],
    };
  }
};

export default GetChatMessages;
