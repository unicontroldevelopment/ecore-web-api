import { ServerAccess } from "@prisma/client";
import prisma from "../database/prisma";

type ServerAccessUpdateInput = Partial<
  Omit<ServerAccess, "id" | "created" | "updated">
>;
class ServerAccessService {
  async getById(id: number) {
    const user = await prisma.serverAccess.findUnique({
      where: { id },
    });

    return user;
  }
  async getAllUsers(name?: string) {
    const users = await prisma.employeesInfo.findMany({
      where: {
        AND: [
          {
            name: {
              contains: name ? name : "",
            },
          },
        ],
      },
      orderBy: {
        name: "asc",
      },
      select: {
        name: true,
        ServerAccess: {
          select: {
            id: true,
            fitolog: true,
            commercial: true,
            administrative: true,
            humanResources: true,
            technician: true,
            newsis: true,
            marketing: true,
            projects: true,
            managementControl: true,
            trainings: true,
            it: true,
            temp: true,
            franchises: true,
            employeeInfoId: true,
          },
        },
      },
    });

    const employeesWithAccess = users.filter(
      (employee) => employee.ServerAccess.length > 0
    );

    return employeesWithAccess;
  }
  async create(
    fitolog: boolean,
    commercial: boolean,
    administrative: boolean,
    humanResources: boolean,
    technician: boolean,
    newsis: boolean,
    marketing: boolean,
    projects: boolean,
    managementControl: boolean,
    trainings: boolean,
    it: boolean,
    temp: boolean,
    franchises: boolean,
    employeeInfoId: number
  ) {
    const userAlreadyExists = await prisma.serverAccess.findFirst({
      where: { employeeInfoId },
    });

    if (userAlreadyExists) {
      throw new Error("Usuário já existe!");
    }

    const user = await prisma.serverAccess.create({
      data: {
        fitolog,
        commercial,
        administrative,
        humanResources,
        technician,
        newsis,
        marketing,
        projects,
        managementControl,
        trainings,
        it,
        temp,
        franchises,
        employeeInfoId,
      },
    });

    return user;
  }
  async delete(id: number) {
    const user = await prisma.serverAccess.delete({
      where: { id },
    });

    return user;
  }
  async update(id: number, updateData: ServerAccessUpdateInput) {
    const user = await prisma.serverAccess.update({
      where: {
        id: id,
      },
      data: updateData,
    });

    return user;
  }
}

export default new ServerAccessService();
