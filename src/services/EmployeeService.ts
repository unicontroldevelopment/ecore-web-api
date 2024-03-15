import prisma from "../database/prisma";

class EmployeeService {
  async getById(id: number) {
    const user = await prisma.employees.findUnique({
      where: { id },
    });

    return user;
  }

  async create(
    role: string,
    name: string,
    password: string,
    passwordConfirmation: string,
    department: string,
    company: string,
    unit: string,
    networkUser: string,
    networkPassword: string,
    email: string,
    emailPassword: string,
    discordEmail: string,
    discordPassword: string,
    notebookBrand: string,
    notebookName: string,
    notebookProperty: string,
    coolerProperty: string,
    officeVersion: string,
    windowsVersion: string
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
        role,
        name,
        password,
        department,
        company,
        unit,
        networkUser,
        networkPassword,
        email,
        emailPassword,
        discordEmail,
        discordPassword,
        notebookBrand,
        notebookName,
        notebookProperty,
        coolerProperty,
        officeVersion,
        windowsVersion,      
      },
    });

    return user;
  }

  async deleteUser(id: number) {
    await prisma.employees.delete({
      where: { id },
    });
  }
}

export default new EmployeeService();
