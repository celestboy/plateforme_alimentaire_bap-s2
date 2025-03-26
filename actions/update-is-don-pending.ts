"use server";

import ChatControllerInstance from "@/controllers/MessagerieController";
import { FormResponse } from "@/types/forms";
import { DonStatus } from "@prisma/client";

const updatePendingStatus = async (
  id_don: number,
  id_chat: number
): Promise<FormResponse> => {
  try {
    const updateStatus = await ChatControllerInstance.pendingFormStatus(
      id_don,
      id_chat
    );
    console.log(updateStatus);
    return {
      success: true,
      message: "Formulaire soumis.",
      status: DonStatus.PENDING,
      chatId: id_chat,
      donId: id_don,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Erreur lors de la soumission du formulaire de rendez-vous.",
    };
  }
};

export default updatePendingStatus;
