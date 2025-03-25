"use server";

import MessagerieController from "@/controllers/MessagerieController";

const getSingleChat = async (chatId: number) => {
  try {
    const chat = await MessagerieController.getSingleChat(chatId);

    if (!chat) {
      return {
        success: false,
        message: "Chat introuvable",
      };
    }

    return {
      success: true,
      data: chat,
    };
  } catch (error) {
    console.error("Error fetching chat:", error);
    return {
      success: false,
      message: "Erreur lors de la récupération du chat",
    };
  }
};

export default getSingleChat;
