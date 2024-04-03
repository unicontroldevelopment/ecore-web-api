import { Contracts, Services } from "@prisma/client";
import prisma from "../database/prisma";

type ServicesUpdateInput = Partial<
  Omit<Services, "id" | "created" | "updated">
>;

type ContractUpdateInput = Partial<
  Omit<Contracts, "id" | "created" | "updated">
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
  async getContracts(type?: string) {
    const users = await prisma.contracts.findMany({
      where: {
        AND: [
          {
            status: {
              contains: type ? type : "",
            },
          },
        ],
      },
      orderBy: {
        created: "asc",
      },
      select: {
        id: true,
        status: true,
        name: true,
        cpfcnpj: true,
        cep: true,
        road: true,
        number: true,
        complement: true,
        neighborhood: true,
        city: true,
        tecSignature: true,
        contractNumber: true,
        date: true,
        value: true,
        index: true,
      },
    });

    return users;
  }
  async createContract(
    status: string,
    name: string,
    cpfcnpj: string,
    cep: string,
    road: string,
    number: number,
    complement: string,
    neighborhood: string,
    city: string,
    tecSignature: string,
    contractNumber: number,
    dateString: string,
    value: string,
    index: string,
  ) {
    const userAlreadyExists = await prisma.contracts.findFirst({
      where: { contractNumber },
    });

    if (userAlreadyExists) {
      throw new Error("Contrato já existe!");
    }

    function stringToDate(str: string) {
      const year = str.substring(0, 4);
      const month = str.substring(4, 6);
      const day = str.substring(6, 8);
    
      return new Date(`${year}-${month}-${day}`);
    }

    const date = stringToDate(dateString);

    const user = await prisma.contracts.create({
      data: {
        status,
        name,
        cpfcnpj,
        cep,
        road,
        number,
        complement,
        neighborhood,
        city,
        tecSignature,
        contractNumber,
        date: date.toISOString(),
        value,
        index,
      },
    });

    return user;
  }
  async deleteContract(id: number) {
    const user = await prisma.contracts.delete({
      where: { id },
    });

    return user;
  }
  async updateContract(id: number, updateData: ContractUpdateInput) {
    const user = await prisma.contracts.update({
      where: {
        id: id,
      },
      data: updateData,
    });

    return user;
  }
}

export default new DocumentsService();
