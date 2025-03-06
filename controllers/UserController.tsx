import { RegisterSchemaType } from "@/types/forms";
import prisma from "../prisma/prisma";
import { UserStatus } from "@prisma/client";
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

  async store(data: RegisterSchemaType) {
    const user_type = data.user_type as UserStatus;
    const username = data.username;
    const commerce_name = data.commerce_name;
    const adresse_commerce = data.adresse_commerce;
    const email = data.email;
    const hashedPassword = await hashPassword(data.password);

    // console.log(
    //   user_type,
    //   username,
    //   commerce_name,
    //   adresse_commerce,
    //   email,
    //   hashedPassword
    // );

    const user = await prisma.users.create({
      data: {
        user_type,
        username,
        commerce_name,
        adresse_commerce,
        email,
        password: hashedPassword,
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
    let user = await prisma.users.update({
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

export default new UserController();
