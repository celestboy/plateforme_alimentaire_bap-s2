import { RegisterCommercantSchemaType } from "@/types/forms";
import { RegisterParticulierSchemaType } from "@/types/forms";
import prisma from "../prisma/prisma";
import { hashPassword } from "@/utils/bcrypt";

class UserController {
  async getProfileInfo(id_user: number) {
    const user = await prisma.users.findUnique({
      where: { user_id: id_user },
    });
    return user;
  }

  async index() {
    const users = await prisma.users.findMany();
    return users;
  }

  async storeParticulier(data: RegisterParticulierSchemaType) {
    const username = data.username;
    const email = data.email;
    const hashedPassword = await hashPassword(data.password);
    const user_type = data.user_type;

    const user = await prisma.users.create({
      data: {
        username,
        email,
        password: hashedPassword,
        user_type,
      },
    });
    return user;
  }
  async storeCommercant(data: RegisterCommercantSchemaType) {
    const commerce_name = data.commerce_name;
    const adresse_commerce = data.adresse_commerce;
    const email = data.email;
    const hashedPassword = await hashPassword(data.password);
    const user_type = data.user_type;

    const user = await prisma.users.create({
      data: {
        commerce_name,
        adresse_commerce,
        email,
        password: hashedPassword,
        user_type,
      },
    });
    return user;
  }

  async show(id_user: number) {
    const result = await prisma.users.findUnique({
      where: {
        user_id: id_user,
      },
    });
    return result;
  }

  async update(
    id_user: number,
    username: string,
    commerce_name: string,
    adresse_commerce: string,
    email: string,
    password: string
  ) {
    const user = await prisma.users.update({
      where: { user_id: id_user },
      data: { username, commerce_name, adresse_commerce, email, password },
    });
    return user;
  }

  async destroy(id_user: number) {
    const user = await prisma.users.delete({
      where: { user_id: id_user },
    });
    return user;
  }
}

const UserControllerInstance = new UserController();
export default UserControllerInstance;
