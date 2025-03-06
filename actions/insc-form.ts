"use server";

import { RegisterSchema } from "@/app/schema";
import UserController from "@/controllers/UserController";
import { FormResponse, RegisterSchemaType } from "@/types/forms";

const submitInscForm = async (
  data: RegisterSchemaType
): Promise<FormResponse> => {
  try {
    const parsedData = RegisterSchema.safeParse(data);
    console.log(parsedData);

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.errors };
    }

    const registerUser = await UserController.store(data);
    console.log(registerUser);
    if (!registerUser) {
      return {
        success: false,
        message: "Erreur lors de la création du compte",
      };
    }

    return { success: true, message: "Compte créé avec succès" };
  } catch (err) {
    console.log("Error while creating user:", err);
    return {
      success: false,
      message: "Erreur lors de la création du compte",
    };
  }
};

export default submitInscForm;
