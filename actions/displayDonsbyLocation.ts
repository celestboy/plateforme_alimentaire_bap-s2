"use server";

import DonsController from "@/controllers/DonsController";

const fetchDonsbyLocation = async (location: string) => {
  try {
    return await DonsController.filter(location);
  } catch (error) {
    console.error("Erreur lors de la récupération des dons :", error);
    return [];
  }
};

export default fetchDonsbyLocation;
