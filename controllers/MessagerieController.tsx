import { CreateChatSchemaType } from "@/types/forms";
import prisma from "../prisma/prisma";

class ChatController {
  async index() {
    const chats = await prisma.chats.findMany();
    return chats;
  }

  async store(data: CreateChatSchemaType) {
    const donneurId = data.donneur_id;
    const receveurId = data.receveur_id;
    const donId = data.don_id;

    const chat = await prisma.chats.create({
      data: {
        donneur_id: donneurId,
        receveur_id: receveurId,
        don_id: donId,
      },
    });
    return chat;
  }

  async show(id_chat: number) {
    const result = await prisma.chats.findUnique({
      where: {
        chat_id: id_chat,
      },
    });
    return result;
  }

  async destroy(id_chat: number) {
    const chat = await prisma.chats.delete({
      where: { chat_id: id_chat },
    });
    return chat;
  }

  async getSingleChat(id_chat: number) {
    const chat = await prisma.chats.findUnique({
      where: {
        chat_id: id_chat,
      },
      include: {
        donneur: {
          select: {
            user_id: true,
            username: true,
            commerce_name: true,
            user_type: true,
          },
        },
        receveur: {
          select: {
            user_id: true,
            username: true,
            commerce_name: true,
            user_type: true,
          },
        },
        don: {
          select: {
            title: true,
          },
        },
        messages: {
          select: {
            sentAt: true,
            content: true,
            author_id: true,
            isSystemMessage: true,
            message_id: true,
          },
          orderBy: {
            sentAt: "desc",
          },
          take: 1,
        },
      },
    });

    return chat;
  }

  async getUsersChats(id_user: number) {
    const chats = await prisma.chats.findMany({
      where: {
        OR: [{ donneur_id: id_user }, { receveur_id: id_user }],
      },
      include: {
        donneur: {
          select: {
            user_id: true,
            username: true,
            commerce_name: true,
            user_type: true,
          },
        },
        receveur: {
          select: {
            user_id: true,
            username: true,
            commerce_name: true,
            user_type: true,
          },
        },
        don: {
          select: {
            title: true,
          },
        },
        messages: {
          select: {
            sentAt: true,
            content: true,
            author_id: true,
            isSystemMessage: true,
            message_id: true,
          },
          orderBy: {
            sentAt: "desc",
          },
          take: 1,
        },
      },
    });

    return chats.sort((a, b) => {
      const dateA = a.messages[0]?.sentAt || new Date(0);
      const dateB = b.messages[0]?.sentAt || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
  }

  async getDonInfo(donId: number) {
    try {
      const don = await prisma.dons.findUnique({
        where: { don_id: donId },
        select: {
          don_id: true,
          title: true,
          description: true,
        },
      });
      return don;
    } catch (error) {
      console.error("Error getting don info:", error);
      return null;
    }
  }

  async getFormStatus(id_don: number, id_chat: number) {
    const chat = await prisma.chats.findUnique({
      where: {
        don_id: id_don,
        chat_id: id_chat,
      },
      select: {
        donStatus: true,
      },
    });
    return chat?.donStatus || null;
  }

  async acceptedFormStatus(id_don: number, id_chat: number) {
    await prisma.chats.update({
      where: {
        don_id: id_don,
        chat_id: id_chat,
      },
      data: {
        donStatus: "ACCEPTED",
      },
    });
  }

  async pendingFormStatus(id_don: number, id_chat: number) {
    await prisma.chats.update({
      where: {
        don_id: id_don,
        chat_id: id_chat,
      },
      data: {
        donStatus: "PENDING",
      },
    });
  }

  async rejectedFormStatus(id_don: number, id_chat: number) {
    await prisma.chats.update({
      where: {
        don_id: id_don,
        chat_id: id_chat,
      },
      data: {
        donStatus: "REFUSED",
      },
    });
  }
}
const ChatControllerInstance = new ChatController();
export default ChatControllerInstance;
