"use server";

import { CreateChatSchema } from "@/app/schema";
import MessagerieController from "@/controllers/MessagerieController";
import { CreateChatSchemaType, FormResponse } from "@/types/forms";

const CreateChat = async (
  data: CreateChatSchemaType
): Promise<FormResponse> => {
  try {
    const parsedData = CreateChatSchema.safeParse(data);

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.errors };
    }

    const user = await MessagerieController.store(data);
    if (!user) {
      return { success: false, message: "Impossible de créer le chat !" };
    }

    return {
      success: true,
      message: "Le chat a été crée avec succès !",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Impossible de créer le chat, veuillez réessayer plus tard.",
    };
  }
};

export default CreateChat;
