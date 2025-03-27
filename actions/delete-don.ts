"use server";

import DonsControllerInstance from "@/controllers/DonsController";

const deleteDon = async (id_message: number) => {
  try {
    return await DonsControllerInstance.destroy(id_message);
  } catch (error) {
    console.error("Erreur lors de la suppression du don :", error);
    return [];
  }
};

export default deleteDon;
