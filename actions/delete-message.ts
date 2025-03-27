"use server";

import MessagesControllerInstance from "@/controllers/MessagesController";

interface MessageResponse {
  success: boolean;
  message: string;
  timestamp?: string;
}

const deleteMessage = async (
  chatId: number,
  timestamp: string,
  authorId: number,
  currentUserId: number
): Promise<MessageResponse> => {
  try {
    // Security check - only allow users to delete their own messages
    if (authorId !== currentUserId) {
      return {
        success: false,
        message: "Vous ne pouvez supprimer que vos propres messages.",
      };
    }

    // Delete the message using timestamp-based identification
    const result = await MessagesControllerInstance.deleteMessageByTimestamp(
      chatId,
      timestamp,
      authorId
    );

    if (!result) {
      return {
        success: false,
        message: "Message non trouvé ou déjà supprimé.",
      };
    }

    return {
      success: true,
      message: "Message supprimé avec succès.",
      timestamp: timestamp,
    };
  } catch (err) {
    console.error("Error deleting message:", err);
    return {
      success: false,
      message: "Erreur lors de la suppression du message.",
    };
  }
};

export default deleteMessage;
