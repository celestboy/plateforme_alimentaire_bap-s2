"use server";

import DonsController from "@/controllers/DonsController";

const displayDons = async () => {
  try {
    return await DonsController.index();
  } catch (error) {
    console.error("Erreur lors de la récupération des dons :", error);
    return [];
  }
};

export default displayDons;
