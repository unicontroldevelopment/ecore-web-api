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

class AdditiveOrReajustmentService {
  async createAdditive(contractId: number, newValue: number, clauses: ClauseInput[]) {
    const userAlreadyExists = await prisma.contracts.findFirst({
      where: { contractNumber: contractId },
    });

    if (userAlreadyExists) {
      throw new Error("Contrato já existe!");
    }

    const user = await prisma.additive.create({
      data: { contract_id: contractId, newValue: newValue, additive_Clauses: {
        create: clauses.map(({ description }) => ({
          description,
        })), },
      }
    });

    return user;
  }
  async deleteAdditive(id: number) {
    const user = await prisma.contracts.delete({
      where: { id },
    });

    return user;
  }
  async updateAdditive(
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

      const SignToDelete = existingSign.filter(
        (ec) => !newSignData.some((nc) => nc.id === ec.id)
      );
      const SignDeletePromises = SignToDelete.map((sign) =>
        prisma.signOnContract.delete({ where: { id: sign.id } })
      );

      const signCreateOrUpdatePromises = newSignData.map((signInput) => {
        if (existingClauses.some((ec) => ec.id === signInput.id)) {
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
        async (serviceInput) => {
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

      await Promise.all([...SignDeletePromises, ...SignDeletePromises]);
      await Promise.all([...serviceDeletePromises, ...clauseDeletePromises]);
      await Promise.all([
        ...serviceCreateOrUpdatePromises,
        ...clauseCreateOrUpdatePromises,
      ]);

      return updatedContract;
    });

    return result;
  }
  async createReajustment(contractId: number, valueContract: number, index: number) {
    const userAlreadyExists = await prisma.reajustment.findFirst({
      where: { contract_id: contractId },
    });

    if (userAlreadyExists) {
      throw new Error("Contrato já existe!");
    }

    const user = await prisma.reajustment.create({
      data: {
        contract_id: contractId,
        valueContract: valueContract,
        index: index
      },
    });

    return user;
  }
  async deleteReajustment(id: number) {
    const user = await prisma.contracts.delete({
      where: { id },
    });

    return user;
  }
  async updateReajustment(
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

      const SignToDelete = existingSign.filter(
        (ec) => !newSignData.some((nc) => nc.id === ec.id)
      );
      const SignDeletePromises = SignToDelete.map((sign) =>
        prisma.signOnContract.delete({ where: { id: sign.id } })
      );

      const signCreateOrUpdatePromises = newSignData.map((signInput) => {
        if (existingClauses.some((ec) => ec.id === signInput.id)) {
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
        async (serviceInput) => {
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

      await Promise.all([...SignDeletePromises, ...SignDeletePromises]);
      await Promise.all([...serviceDeletePromises, ...clauseDeletePromises]);
      await Promise.all([
        ...serviceCreateOrUpdatePromises,
        ...clauseCreateOrUpdatePromises,
      ]);

      return updatedContract;
    });

    return result;
  }
}

export default new AdditiveOrReajustmentService();
