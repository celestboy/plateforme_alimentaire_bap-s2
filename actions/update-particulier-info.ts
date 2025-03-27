"use server";

import { UpdateParticulierSchema } from "@/app/schema";
import UserControllerInstance from "@/controllers/UserController";
import { FormResponse, UpdateParticulierSchemaType } from "@/types/forms";

const updateParticulierInfo = async (
  data: UpdateParticulierSchemaType,
  user_id: number
): Promise<FormResponse> => {
  try {
    const parsedData = UpdateParticulierSchema.safeParse(data);

    console.log(parsedData);

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.errors };
    }

    const updateUser = await UserControllerInstance.updateParticulier(
      data,
      user_id
    );

    if (!updateUser) {
      return {
        success: false,
        message: "Erreur lors de la modification de l'utilisateur",
      };
    }

    return {
      success: true,
      message: "Utilisateur updaté avec succès",
    };
  } catch (err: unknown) {
    const error = err as Error;
    console.error(error.stack);
    return {
      success: false,
      message: "Erreur lors de la modification de l'utilisateur",
    };
  }
};

export default updateParticulierInfo;
