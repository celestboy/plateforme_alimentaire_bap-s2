"use server";

import UserControllerInstance from "@/controllers/UserController";

const deleteAccount = async (id_user: number) => {
  try {
    return await UserControllerInstance.destroy(id_user);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    return [];
  }
};

export default deleteAccount;
