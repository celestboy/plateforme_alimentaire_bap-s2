"use server";

import MessagerieController from "@/controllers/MessagerieController";

const displayUserChats = async (id_user: number | null) => {
  try {
    if (!id_user) throw new Error("ID de l'utilisateur manquant.");

    return await MessagerieController.getUsersChats(id_user);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    return null;
  }
};

export default displayUserChats;
