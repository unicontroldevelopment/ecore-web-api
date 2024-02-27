import { hash } from "bcryptjs";
import prisma from "../database/prisma";

class UserService {
  async getById(id: number) {
    const user = await prisma.users.findUnique({
      where: { id },
    });

    return user;
  }
  async create(
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
    role: string
  ) {
    if (password !== passwordConfirmation) {
      throw new Error("Senhas não conferem!");
    }

    const userAlreadyExists = await prisma.users.findUnique({
      where: { email },
    });

    if (userAlreadyExists) {
      throw new Error("Usuário já existe!");
    }

    const passwordHash = await hash(password, 8);

    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: passwordHash,
        role,
      },
    });

    return user;
  }
}

export default new UserService();
