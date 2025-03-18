"use server";

import { RegisterCommercantSchema } from "@/app/schema";
import UserController from "@/controllers/UserController";
import { FormResponse, RegisterCommercantSchemaType } from "@/types/forms";

const submitInscForm = async (
  data: RegisterCommercantSchemaType
): Promise<FormResponse> => {
  try {
    const parsedData = RegisterCommercantSchema.safeParse(data);
    console.log(parsedData);

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.errors };
    }

    const registerUser = await UserController.storeCommercant(data);
    console.log(registerUser);
    if (!registerUser) {
      return {
        success: false,
        message: "Erreur lors de la création du compte",
      };
    }

    return { success: true, message: "Compte créé avec succès" };
  } catch (err: unknown) {
    const error = err as Error;
    console.error(error.stack);
    return {
      success: false,
      message: "Erreur lors de la création du compte",
    };
  }
};

export default submitInscForm;
