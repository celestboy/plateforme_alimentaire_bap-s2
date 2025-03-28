"use server";

import { ValidateSchema } from "@/app/schema";
import DonsControllerInstance from "@/controllers/DonsController";

import { FormResponse, ValidateSchemaType } from "@/types/forms";

const validateForm = async (
  data: ValidateSchemaType
): Promise<FormResponse> => {
  try {
    const parsedData = ValidateSchema.safeParse(data);

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.errors };
    }

    const validatedRdv = await DonsControllerInstance.validateRDV(data);
    console.log(validatedRdv);
    if (!validatedRdv) {
      return {
        success: false,
        message: "Erreur lors de la soumission du formulaire de rendez-vous.",
      };
    }

    return { success: true, message: "Formulaire soumis." };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Erreur lors de la soumission du formulaire de rendez-vous.",
    };
  }
};

export default validateForm;
