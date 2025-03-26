"use server";

import { CreateChatSchema } from "@/app/schema";
import MessagerieController from "@/controllers/MessagerieController";
import MessagesController from "@/controllers/MessagesController";
import { CreateChatSchemaType, FormResponse } from "@/types/forms";

const CreateChat = async (
  data: CreateChatSchemaType
): Promise<FormResponse> => {
  try {
    const parsedData = CreateChatSchema.safeParse(data);

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.errors };
    }

    // Create the chat
    const chat = await MessagerieController.store(data);
    if (!chat) {
      return { success: false, message: "Impossible de créer le chat !" };
    }

    // Get the complete chat with user information
    const fullChat = await MessagerieController.show(chat.chat_id);
    const donneurId = fullChat?.donneur_id;
    const receveurId = fullChat?.receveur_id;

    try {
      // Get the don information to personalize the message
      const donInfo = await MessagerieController.getDonInfo(data.don_id);
      const donTitle = donInfo?.title || "don";

      // Create a welcome system message
      const welcomeMessage = `Une conversation a été créée concernant le don "${donTitle}". Vous pouvez maintenant échanger des messages pour organiser la remise.`;

      // Store the system message in the database
      await MessagesController.storeSystemMessage(chat.chat_id, welcomeMessage);

      console.log(`System message created for chat ${chat.chat_id}`);

      // Return the full chat data for the client to use with socket
      return {
        success: true,
        message: "Le chat a été créé avec succès !",
        donneurId: donneurId,
        receveurId: receveurId,
        chatId: chat.chat_id,
        donId: chat.don_id,
      };
    } catch (error) {
      console.error("Error creating system message:", error);
      // Continue execution even if system message fails - the chat is still created
      return {
        success: true,
        message: "Le chat a été créé avec succès !",
        donneurId: donneurId,
        receveurId: receveurId,
        chatId: chat.chat_id,
        donId: chat.don_id,
      };
    }
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Impossible de créer le chat, veuillez réessayer plus tard.",
    };
  }
};

export default CreateChat;
