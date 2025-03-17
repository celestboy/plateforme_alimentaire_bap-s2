import { ValidateSchemaType } from "@/types/forms";
import prisma from "../prisma/prisma";

class MessagesController {
  async store(content: string, author_id: number, receiver_id: number) {
    const message = await prisma.messages.create({
      data: {
        content,
        author_id,
        receiver_id,
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
}

export default new MessagesController();
