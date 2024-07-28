import { Contracts, Services } from "@prisma/client";
import prisma from "../database/prisma";

type ServicesUpdateInput = Partial<
  Omit<Services, "id" | "created" | "updated">
>;

type ContractUpdateInput = Partial<
  Omit<Contracts, "id" | "created" | "updated">
>;

interface ClauseInput {
  id: number;
  contract_id: number;
  description: string;
}

interface SignInput {
  id: number;
  contract_id: number;
  sign_id: number;
}

interface ContractServiceInput {
  id: number;
  service_id: number;
  contract_id: number;
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
        d4sign: true,
        name: true,
        cpfcnpj: true,
        cep: true,
        road: true,
        number: true,
        complement: true,
        neighborhood: true,
        city: true,
        state: true,
        signOnContract: {
          select: {
            id: true,
            contract_id: true,
            sign_id: true,
            Contract_Signature: true,
          }
        },
        contractNumber: true,
        date: true,
        value: true,
        index: true,
        contracts_Service: {
          select: {
            id: true,
            contract_id: true,
            service_id: true,
            Services: {
              select: {
                id: true,
                description: true,
              },
            },
          },
        },
        clauses: {
          select: {
            id: true,
            contract_id: true,
            description: true,
          },
        },
        propouse: {
          select: {
            id: true,
            file: true,
            fileName: true,
            contract_id: true,
          }
        },
        additive: {
          select: {
            id: true,
            contract_id: true,
            newValue: true,
            oldValue: true,
            additive_Clauses: {
              select: {
                id: true,
                description: true,
                additive_id: true,
              }
            }
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
    contractNumber: number,
    date: string,
    value: string,
    index: string,
    signNumber: number,
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
        contractNumber,
        date,
        value,
        index,
        signOnContract: {
          create: {
            sign_id: signNumber
          }
        },
        contracts_Service: {
          create: services.map((service) => ({
            service_id: service,
          })),
        },
        clauses: {
          create: clauses.map(( {description} ) => ({
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
  async updateContract(id: number, updateData: ContractUpdateInput, newServiceData: ContractServiceInput[], newClauseData: ClauseInput[], newSignData: SignInput[]) {
    const result = await prisma.$transaction(async (prisma) => {
      const updatedContract = await prisma.contracts.update({
        where: { id: id },
        data: updateData,
      });

      const existingSign = await prisma.signOnContract.findMany({
        where: { contract_id: id }
      })
  
      const existingServices = await prisma.contract_Service.findMany({
        where: { contract_id: id },
      });
      const existingClauses = await prisma.clauses.findMany({
        where: { contract_id: id },
      });

      const SignToDelete = existingSign.filter(ec => !newSignData.some(nc => nc.id === ec.id));
      const SignDeletePromises = SignToDelete.map(sign => prisma.signOnContract.delete({ where: { id: sign.id } }));
  
      const signCreateOrUpdatePromises = newSignData.map(signInput => {
        if (existingClauses.some(ec => ec.id === signInput.id)) {
          return prisma.signOnContract.update({
            where: { id: signInput.id },
            data: { sign_id: signInput.sign_id },
          });
        } else {
          return prisma.signOnContract.create({
            data: {
              contract_id: id,
              sign_id: signInput.sign_id,
            },
          });
        }
      })
  
      const servicesToDelete = existingServices.filter(es => !newServiceData.some(ns => ns.contract_id === es.contract_id));
      const serviceDeletePromises = servicesToDelete.map(service => prisma.contract_Service.delete({ where: { id: service.id } }));
  
      const serviceCreateOrUpdatePromises = newServiceData.map(async serviceInput => {

        const existingService = existingServices.find(es => es.id === serviceInput.id);
        if (existingService) {
          return prisma.contract_Service.update({
            where: { id: serviceInput.id },
            data: { service_id: serviceInput.service_id },
          });
        } else {
          return prisma.contract_Service.create({
            data: {
              contract_id: serviceInput.contract_id,
              service_id: serviceInput.service_id,
            },
          });
        }
      });
  
      const clausesToDelete = existingClauses.filter(ec => !newClauseData.some(nc => nc.id === ec.id));
      const clauseDeletePromises = clausesToDelete.map(clause => prisma.clauses.delete({ where: { id: clause.id } }));
  
      const clauseCreateOrUpdatePromises = newClauseData.map(clauseInput => {
        if (existingClauses.some(ec => ec.id === clauseInput.id)) {
          return prisma.clauses.update({
            where: { id: clauseInput.id },
            data: { description: clauseInput.description },
          });
        } else {
          return prisma.clauses.create({
            data: {
              contract_id: id,
              description: clauseInput.description,
            },
          });
        }
      });
      
      await Promise.all([...signCreateOrUpdatePromises]);
      await Promise.all([...SignDeletePromises, ...SignDeletePromises]);
      await Promise.all([...serviceDeletePromises, ...clauseDeletePromises]);
      await Promise.all([...serviceCreateOrUpdatePromises, ...clauseCreateOrUpdatePromises]);
  
      return updatedContract;
    });
  
    return result;
  }
}

export default new DocumentsService();
