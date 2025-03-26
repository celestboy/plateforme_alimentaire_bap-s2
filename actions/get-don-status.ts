"use server";

import ChatControllerInstance from "@/controllers/MessagerieController";
import { DonStatus } from "@prisma/client";

const getDonStatus = async (
  id_don: number,
  id_chat: number
): Promise<DonStatus | null> => {
  try {
    const result = await ChatControllerInstance.getFormStatus(id_don, id_chat);
    return result || null;
  } catch (err) {
    console.error("Error retrieving donation status:", err);
    return null;
  }
};

export default getDonStatus;
