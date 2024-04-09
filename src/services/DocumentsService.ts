import { Clauses, Contract_Service, Contracts, Services } from "@prisma/client";
import prisma from "../database/prisma";

type ServicesUpdateInput = Partial<
  Omit<Services, "id" | "created" | "updated">
>;

type ContractUpdateInput = Partial<
  Omit<Contracts, "id" | "created" | "updated">
>;
type ClauseUpdateInput = Partial<
  Omit<Clauses, "id" | "created" | "updated">
>;

type ContractServiceUpdateInput = Partial<
  Omit<Contract_Service, "id" | "created" | "updated">
>;

interface ClauseInput {
  description: string;
}
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
  async createService(description: string, code: string) {
    const userAlreadyExists = await prisma.services.findFirst({
      where: { code },
    });

    if (userAlreadyExists) {
      throw new Error("Serviço já existe!");
    }

    const user = await prisma.services.create({
      data: {
        description,
        code,
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
            name: {
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
        state: true,
        tecSignature: true,
        contractNumber: true,
        date: true,
        value: true,
        index: true,
        contracts_Service: {
          select: {
            id: true,
            service_id: true,
          }
        },
        clauses: {
          select: {
            id: true,
            description: true,
          }
        }
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
    state: string,
    tecSignature: string,
    contractNumber: number,
    date: string,
    value: string,
    index: string,
    services: number[],
    clauses: ClauseInput[],
  ) {
    const userAlreadyExists = await prisma.contracts.findFirst({
      where: { contractNumber: contractNumber },
    });

    if (userAlreadyExists) {
      throw new Error("Contrato já existe!");
    }
    
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
        state,
        tecSignature,
        contractNumber,
        date,
        value,
        index,
        contracts_Service: {
          create: services.map(service => ({
            service_id: service
          }))
        },
        clauses: {
          create: clauses.map(({ description }) => ({
            description,
          })),
        },
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
  async updateContract(id: number, updateData: ContractUpdateInput, serviceData: ContractServiceUpdateInput[], clauseData: ClauseUpdateInput[]) {
    const result = await prisma.$transaction(async (prisma) => {
      // Atualiza o contrato
      const updatedContract = await prisma.contracts.update({
        where: { id: id },
        data: updateData,
      });
  
      // Atualizações para Contract_Service
      const serviceUpdates = serviceData.map((serviceData) => {
        return prisma.contract_Service.update({
          where: {
            id: serviceData.id
          },
          data: {
            service_id: serviceData.service_id
          },
        });
      });
  
      const clauseUpdates = clauseData.map((clauseData) => {
        return prisma.clauses.update({
          where: {
            id: clauseData.id
          },
          data: {
            // Os dados de atualização para Clauses
            description: clauseData.description,
          },
        });
      });
  
      // Executar todas as operações de atualização como parte da transação
      await Promise.all([...serviceUpdates, ...clauseUpdates]);
  
      return updatedContract;
    });
    return result;
  }
}

export default new DocumentsService();
