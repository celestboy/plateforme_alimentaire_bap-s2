"use server";

import UserControllerInstance from "@/controllers/UserController";

const displayUserInfo = async (id_user: number | string) => {
  try {
    if (!id_user) throw new Error("ID article manquant.");

    const id = Number(id_user);
    if (isNaN(id)) throw new Error("L'ID de l'article n'est pas valide.");

    return await UserControllerInstance.getProfileInfo(id);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'article :", error);
    return null;
  }
};

export default displayUserInfo;
