"use server";

import { MessageSchema } from "@/app/schema";
import MessagesController from "@/controllers/MessagesController";
import { FormResponse, MessageSchemaType } from "@/types/forms";

const StoreMessage = async (data: MessageSchemaType): Promise<FormResponse> => {
  try {
    const parsedData = MessageSchema.safeParse(data);

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.errors };
    }

    const user = await MessagesController.store(data);
    if (!user) {
      return { success: false, message: "Impossible de store le message !" };
    }

    return {
      success: true,
      message: "Le message a été enregistré avec succès.",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Impossible de store le message !",
    };
  }
};

export default StoreMessage;
