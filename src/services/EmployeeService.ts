import prisma from "../database/prisma";

class EmployeeService {
  async getById(id: number) {
    const user = await prisma.employees.findUnique({
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

    const userAlreadyExists = await prisma.employees.findUnique({
      where: { email },
    });

    if (userAlreadyExists) {
      throw new Error("Usuário já existe!");
    }

    const user = await prisma.employees.create({
      data: {
        name,
        email,
        password,
        role,
      },
    });

    return user;
  }
}

export default new EmployeeService();
