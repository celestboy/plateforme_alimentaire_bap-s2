"use server";

import { RegisterParticulierSchema } from "@/app/schema";
import UserController from "@/controllers/UserController";
import { FormResponse, RegisterParticulierSchemaType } from "@/types/forms";

const submitInscForm = async (
  data: RegisterParticulierSchemaType
): Promise<FormResponse> => {
  try {
    const parsedData = RegisterParticulierSchema.safeParse(data);
    console.log(parsedData);

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.errors };
    }

    const registerUser = await UserController.storeParticulier(data);
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
