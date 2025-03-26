"use server";

import MessagesControllerInstance from "@/controllers/MessagesController";

const deleteMessageAction = async (id_message: number) => {
  try {
    return await MessagesControllerInstance.deleteMessage(id_message);
  } catch (error) {
    console.error("Erreur lors de la suppression du message :", error);
    return [];
  }
};

export default deleteMessageAction;
