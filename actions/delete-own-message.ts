"use server";

import MessagesControllerInstance from "@/controllers/MessagesController";

// Define MessageResponse type locally if it's not available in forms
interface MessageResponse {
  success: boolean;
  message: string;
  messageId?: number;
}

const deleteMessage = async (
  messageId: number,
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

    // Delete the message from the database
    await MessagesControllerInstance.deleteMessage(messageId);

    return {
      success: true,
      message: "Message supprimé avec succès.",
      messageId,
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
