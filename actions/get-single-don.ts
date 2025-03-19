"use server";

import DonsController from "@/controllers/DonsController";

const displayUniqueDon = async (id_don: number) => {
  try {
    if (!id_don) throw new Error("ID du don manquant.");

    return await DonsController.show(id_don);
  } catch (error) {
    console.error("Erreur lors de la récupération du don :", error);
    return null;
  }
};

export default displayUniqueDon;
