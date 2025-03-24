"use server";

import ChatControllerInstance from "@/controllers/MessagerieController";
import { FormResponse } from "@/types/forms";

const updateFormStatus = async (
  id_don: number,
  id_chat: number
): Promise<FormResponse> => {
  try {
    const updateStatus = await ChatControllerInstance.updateFormStatus(
      id_don,
      id_chat
    );
    console.log(updateStatus);
    return { success: true, message: "Formulaire soumis." };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Erreur lors de la soumission du formulaire de rendez-vous.",
    };
  }
};

export default updateFormStatus;
