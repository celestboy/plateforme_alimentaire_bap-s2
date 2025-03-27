"use server";

import ChatControllerInstance from "@/controllers/MessagerieController";
import MessagesControllerInstance from "@/controllers/MessagesController";
import { FormResponse } from "@/types/forms";
import { DonStatus } from "@prisma/client";

const updateRejectedStatus = async (
  id_don: number,
  id_chat: number
): Promise<FormResponse> => {
  try {
    // First delete all validation messages in this chat
    await MessagesControllerInstance.deleteValidationMessages(id_chat);

    // Then update the don status
    const updateStatus = await ChatControllerInstance.rejectedFormStatus(
      id_don,
      id_chat
    );

    console.log(
      "Don rejected and validation messages deleted, status updated:",
      {
        donId: id_don,
        chatId: id_chat,
        status: updateStatus,
      }
    );

    return {
      success: true,
      message: "Formulaire rejeté et supprimé.",
      status: DonStatus.REFUSED,
      chatId: id_chat,
      donId: id_don,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Erreur lors du rejet du formulaire de rendez-vous.",
    };
  }
};

export default updateRejectedStatus;
