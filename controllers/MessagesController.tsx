import { MessageSchemaType, ValidateSchemaType } from "@/types/forms";
import prisma from "../prisma/prisma";

class MessagesController {
  async store(data: MessageSchemaType) {
    const message = await prisma.messages.create({
      data: {
        content: data.content,
        author_id: data.author_id,
        receiver_id: data.receiver_id,
        chat_id: data.chat_id,
      },
    });
    return message;
  }

  async validatedRDV(info: ValidateSchemaType, id_don: number) {
    const changeStatus = await prisma.dons.update({
      where: {
        don_id: id_don,
      },
      data: {
        status: true,
        lieu: info.lieu,
        Heure: info.heure,
      },
    });

    return [changeStatus];
  }

  async deleteRDV(id_don: number) {
    const supp = await prisma.dons.delete({
      where: {
        don_id: id_don,
      },
    });
    return supp;
  }

  async getByChatId(chatId: number) {
    try {
      const messages = await prisma.messages.findMany({
        where: { chat_id: chatId },
        orderBy: { sentAt: "asc" },
        include: {
          author: {
            select: {
              user_id: true,
              username: true,
              commerce_name: true,
            },
          },
        },
      });

      return messages;
    } catch (error) {
      console.error("Error getting messages by chat ID:", error);
      return null;
    }
  }
}

export default new MessagesController();
