import { Services } from "@prisma/client";
import prisma from "../database/prisma";

type ServicesUpdateInput = Partial<
  Omit<Services, "id" | "created" | "updated">
>;
class DocumentsService {
  async getServices(type?: string) {
    const users = await prisma.services.findMany({
      where: {
        AND: [
          {
            code: {
              contains: type ? type : "",
            },
          },
        ],
      },
      orderBy: {
        description: "asc",
      },
      select: {
        id: true,
        description: true,
        code: true,
      },
    });

    return users;
  }
  async createService(
    description: string,
    code: string,
  ) {
    const userAlreadyExists = await prisma.services.findFirst({
      where: { code },
    });

    if (userAlreadyExists) {
      throw new Error("Serviço já existe!");
    }

    const user = await prisma.services.create({
      data: {
        description,
        code
      },
    });

    return user;
  }
  async deleteService(id: number) {
    const user = await prisma.services.delete({
      where: { id },
    });

    return user;
  }
  async updateService(id: number, updateData: ServicesUpdateInput) {
    const user = await prisma.services.update({
      where: {
        id: id,
      },
      data: updateData,
    });

    return user;
  }
}

export default new DocumentsService();
