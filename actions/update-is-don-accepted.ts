"use server";

import ChatControllerInstance from "@/controllers/MessagerieController";
import { FormResponse } from "@/types/forms";
import { DonStatus } from "@prisma/client";
import prisma from "@/prisma/prisma";

const updateAcceptedStatus = async (
  id_don: number,
  id_chat: number,
  receveur_id: number
): Promise<FormResponse> => {
  try {
    // Update the status in chat
    const updateStatus = await ChatControllerInstance.acceptedFormStatus(
      id_don,
      id_chat
    );

    // Update the don with the receiver ID
    await prisma.dons.update({
      where: { don_id: id_don },
      data: { receveur_id: receveur_id },
    });

    console.log("Don updated with receiver:", {
      donId: id_don,
      receiverId: receveur_id,
      status: updateStatus,
    });

    // Server actions can't directly emit socket events, we'll handle this on the client side
    return {
      success: true,
      message: "Formulaire soumis.",
      status: DonStatus.ACCEPTED,
      chatId: id_chat,
      donId: id_don,
      receveurId: receveur_id,
    };
  } catch (err) {
    console.error("Error updating donation status:", err);
    return {
      success: false,
      message: "Erreur lors de la soumission du formulaire de rendez-vous.",
    };
  }
};

export default updateAcceptedStatus;
