"use server";

import { DonSchema } from "@/app/schema";
import DonsController from "@/controllers/DonsController";
import { FormResponse, DonSchemaType } from "@/types/forms";

const submitDonForm = async (
  data: DonSchemaType,
  donneur_id: number,
  file: File
): Promise<FormResponse> => {
  try {
    const parsedData = DonSchema.safeParse(data);

    console.log(parsedData);

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.errors };
    }

    const registerDon = await DonsController.store(data, donneur_id, file);

    if (!registerDon) {
      return {
        success: false,
        message: "Erreur lors de la création du don",
      };
    }

    return { success: true, message: "Don créé avec succès" };
  } catch (err: unknown) {
    const error = err as Error;
    console.error(error.stack);
    return {
      success: false,
      message: "Erreur lors de la création du don",
    };
  }
};

export default submitDonForm;
