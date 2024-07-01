import { Uniform } from "@prisma/client";
import prisma from "../database/prisma";

type UniformUpdateInput = Partial<Omit<Uniform, "id" | "created" | "updated">>;
class UniformService {
  async getById(id: number) {
    const uniform = await prisma.uniform.findUnique({
      where: { id },
    });

    return uniform;
  }
  async getAllUsers(name?: string) {
    {
      const uniformList = await prisma.uniform.findMany({
        orderBy: {
          created: "asc",
        },
      });

      return uniformList;
    }
  }
  async create(
    name: string,
    size: string,
    unit: string,
    quantity: number,
    quantityMinimum: number,
    numberNF: string,
    baseValue: number,
    barCode: string
  ) {
    const uniformAlreadyExists = await prisma.uniform.findFirst({
      where: { name },
    });

    if (uniformAlreadyExists) {
      throw new Error("Usuário já existe!");
    }

    const uniform = await prisma.uniform.create({
      data: {
        name,
        size,
        unit,
        quantity,
        quantityMinimum,
        numberNF,
        baseValue,
        barCode,
      },

      
    });

    return uniform;
  }
  async delete(id: number) {
    const uniform = await prisma.uniform.delete({
      where: { id },
    });

    return uniform;
  }
  async update(id: number, updateData: UniformUpdateInput) {
    const uniform = await prisma.uniform.update({
      where: {
        id: id,
      },
      data: updateData,
    });

    return uniform;
  }
}

export default new UniformService();
