"use server";

import { DonSchema } from "@/app/schema";
import DonsController from "@/controllers/DonsController";
import { FormResponse, DonSchemaType } from "@/types/forms";
import { calculateCO2Saved } from "@/utils/co2Calculator";

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

    // Calculate CO2
    try {
      const co2Result = calculateCO2Saved(
        data.title,
        data.description,
        data.category,
        data.quantity
      );

      // Add CO2 data
      const donDataWithCO2 = {
        ...data,
        weightKg: co2Result.weightKg,
        co2Saved: co2Result.co2Saved,
        identifiedProduct: co2Result.identifiedProduct || "none",
      };
      console.log(donDataWithCO2.co2Saved);
      console.log(donDataWithCO2.weightKg);
      console.log(donDataWithCO2.identifiedProduct);
      console.log(donDataWithCO2);

      // Pass the data to controller
      const registerDon = await DonsController.store(
        donDataWithCO2,
        donneur_id,
        file
      );

      if (!registerDon) {
        return {
          success: false,
          message: "Erreur lors de la création du don",
        };
      }
    } catch (co2Error) {
      console.error(
        "Error calculating CO2 (continuing with donation):",
        co2Error
      );
      // Continue with the original data if calculation fails
      const registerDon = await DonsController.store(data, donneur_id, file);

      if (!registerDon) {
        return {
          success: false,
          message: "Erreur lors de la création du don",
        };
      }
    }

    return {
      success: true,
      message: "Don créé avec succès",
    };
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
