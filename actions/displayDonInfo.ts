"use server";

import DonsController from "@/controllers/DonsController";

const displayDonInfo = async (id_don: number | string) => {
  try {
    if (!id_don) throw new Error("ID don manquant.");

    const id = Number(id_don);
    if (isNaN(id)) throw new Error("L'ID du don n'est pas valide.");

    return await DonsController.getDonInfo(id);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'article :", error);
    return null;
  }
};

export default displayDonInfo;
