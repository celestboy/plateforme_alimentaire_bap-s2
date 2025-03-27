"use server";

import DonsControllerInstance from "@/controllers/DonsController";

const displayUsersDons = async (id_user: number) => {
  try {
    if (!id_user) throw new Error("ID de l'utilisateur manquant.");

    return await DonsControllerInstance.getUsersDon(id_user);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    return null;
  }
};

export default displayUsersDons;
