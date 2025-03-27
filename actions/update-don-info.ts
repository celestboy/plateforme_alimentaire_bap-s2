"use server";

import { UpdateDonSchema } from "@/app/schema";
import DonsController from "@/controllers/DonsController";
import { FormResponse, UpdateDonSchemaType } from "@/types/forms";

const updateDonForm = async (
  data: UpdateDonSchemaType,
  don_id: number
): Promise<FormResponse> => {
  try {
    const parsedData = UpdateDonSchema.safeParse(data);

    console.log(parsedData);

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.errors };
    }

    // Pass the data to controller (without CO2 calculation)
    const registerDon = await DonsController.update(data, don_id);

    if (!registerDon) {
      return {
        success: false,
        message: "Erreur lors de la modification du don",
      };
    }

    return {
      success: true,
      message: "Don updaté avec succès",
    };
  } catch (err: unknown) {
    const error = err as Error;
    console.error(error.stack);
    return {
      success: false,
      message: "Erreur lors de la modification du don",
    };
  }
};

export default updateDonForm;
