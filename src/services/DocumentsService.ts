import { Contracts, Services } from "@prisma/client";
import prisma from "../database/prisma";

type ServicesUpdateInput = Partial<
  Omit<Services, "id" | "created" | "updated">
>;

type ContractUpdateInput = Partial<
  Omit<Contracts, "id" | "created" | "updated">
>;

type CustomerInput = {
  status: string;
  d4sign?: string | null;
  name: string;
  cpfcnpj: string;
  cep: string;
  road: string;
  number: string;
  complement?: string | null;
  neighborhood: string;
  city: string;
  state: string;
};

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
  async getByIdContract(id: number) {
    const user = await prisma.contracts.findUnique({
      where: { id },
      include: {
        propouse: {
          select: {
            id: true,
            file: true,
            fileName: true,
            contract_id: true,
          },
        },
      },
    });

    return user;
  }
  async getByIdContractAllInfo(id: number) {
    const user = await prisma.contracts.findUnique({
      where: { id },
      include: {
        signOnContract: {
          select: {
            Contract_Signature: true,
          },
        },
        additive: {
          select: {
            id: true,
            created: true,
            contract_id: true,
            oldValue: true,
            newValue: true,
            additive_Clauses: {
              select: {
                description: true,
                created: true,
                id: true,
              },
            },
            propouse: {
              select: {
                file: true,
                id: true,
              },
            },
          },
        },
        reajustment: {
          select: {
            contract_id: true,
            id: true,
            type: true,
            created: true,
            valueContract: true,
            index: true,
          },
        },
      },
    });

    return user;
  }
  async getContracts(name?: string, type?: string) {
    const users = await prisma.contracts.findMany({
      where: {
        name: {
          contains: name ? name : "",
        },
        status: {
          equals: type
        }
      },
      orderBy: {
        created: "desc",
      },
      include: {
        signOnContract: {
          select: {
            id: true,
            contract_id: true,
            sign_id: true,
            Contract_Signature: true,
          },
        },
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
    number: string,
    complement: string,
    neighborhood: string,
    city: string,
    state: string,
    contractNumber: string,
    date: string,
    value: string,
    index: string,
    signNumber: number,
    services: number[],
    clauses: ClauseInput[]
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
            sign_id: signNumber,
          },
        },
        contracts_Service: {
          create: services.map((service) => ({
            service_id: service,
          })),
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

  async createCustomer(data: CustomerInput, signNumber: number,) {
    const user = await prisma.contracts.create({
      data: { ...data,
        signOnContract: {
          create: {
            sign_id: signNumber,
          },
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
  async updateContract(
    id: number,
    updateData: ContractUpdateInput,
    newServiceData: ContractServiceInput[],
    newClauseData: ClauseInput[],
    newSignData: SignInput[]
  ) {
    const result = await prisma.$transaction(async (prisma) => {
      const updatedContract = await prisma.contracts.update({
        where: { id: id },
        data: updateData,
      });

      const existingSign = await prisma.signOnContract.findMany({
        where: { contract_id: id },
      });

      const existingServices = await prisma.contract_Service.findMany({
        where: { contract_id: id },
      });

      const existingClauses = await prisma.clauses.findMany({
        where: { contract_id: id },
      });

      const signToDelete = existingSign.filter(
        (ec) => !newSignData.some((nc) => nc.id === ec.id)
      );
      const signDeletePromises = signToDelete.map((sign) =>
        prisma.signOnContract.delete({ where: { id: sign.id } })
      );

      const signCreateOrUpdatePromises = newSignData.map((signInput) => {
        if (existingSign.some((ec) => ec.id === signInput.id)) {
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
      });

      const servicesToDelete = existingServices.filter(
        (es) => !newServiceData.some((ns) => ns.contract_id === es.contract_id)
      );
      const serviceDeletePromises = servicesToDelete.map((service) =>
        prisma.contract_Service.delete({ where: { id: service.id } })
      );

      const serviceCreateOrUpdatePromises = newServiceData.map(
        (serviceInput) => {
          const existingService = existingServices.find(
            (es) => es.id === serviceInput.id
          );
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
        }
      );

      const clausesToDelete = existingClauses.filter(
        (ec) => !newClauseData.some((nc) => nc.id === ec.id)
      );
      const clauseDeletePromises = clausesToDelete.map((clause) =>
        prisma.clauses.delete({ where: { id: clause.id } })
      );

      const clauseCreateOrUpdatePromises = newClauseData.map((clauseInput) => {
        if (existingClauses.some((ec) => ec.id === clauseInput.id)) {
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

      await Promise.all([
        ...signDeletePromises,
        ...signCreateOrUpdatePromises,
        ...serviceDeletePromises,
        ...serviceCreateOrUpdatePromises,
        ...clauseDeletePromises,
        ...clauseCreateOrUpdatePromises,
      ]);

      return updatedContract;
    });

    return result;
  }
}

export default new DocumentsService();
