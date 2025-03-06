import prisma from "../prisma/prisma";

class AuthentificationController {
  async login(email: string) {
    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  }
}

export default new AuthentificationController();
