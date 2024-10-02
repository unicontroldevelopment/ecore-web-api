import { Additive, Reajustment } from "@prisma/client";
import prisma from "../database/prisma";

type ReajustmentUpdateInput = Partial<
  Omit<Reajustment, "id" | "created" | "updated">
>;

type ContractUpdateInput = Partial<
  Omit<Additive, "id" | "created" | "updated">
>;

interface ClauseInput {
  id: number;
  additive_id: number;
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
  async createAdditive(
    contractId: number,
    newValue: string,
    oldValue: string,
    clauses: ClauseInput[]
  ) {
    const contractExists = await prisma.contracts.findFirst({
      where: { id: contractId },
    });

    if (!contractExists) {
      throw new Error("Contrato não encontrado!");
    }

    const user = await prisma.additive.create({
      data: {
        contract_id: contractId,
        newValue: newValue,
        oldValue: oldValue,
        additive_Clauses: {
          create: clauses.map(({ description }) => ({
            description,
          })),
        },
      },
    });

    return user;
  }
  async deleteAdditive(id: number) {
    const deletedAdditive = await prisma.$transaction(async (prisma) => {
      await prisma.additive_Clauses.deleteMany({
        where: { additive_id: id },
      });
  
      await prisma.propouseAdditive.deleteMany({
        where: { additive_id: id },
      });
  
      const deletedAdditive = await prisma.additive.delete({
        where: { id },
      });
  
      return deletedAdditive;
    });
  
    return deletedAdditive;
  }
  async updateAdditive(
    id: number,
    updateData: ContractUpdateInput,
    newClauseData: ClauseInput[]
  ) {
    const result = await prisma.$transaction(async (prisma) => {
      const updatedContract = await prisma.additive.update({
        where: { id: id },
        data: updateData,
      });

      const existingClauses = await prisma.additive_Clauses.findMany({
        where: { additive_id: id },
      });

      const clausesToDelete = existingClauses.filter(
        (ec) => !newClauseData.some((nc) => nc.id === ec.id)
      );
      const clauseDeletePromises = clausesToDelete.map((clause) =>
        prisma.additive_Clauses.delete({ where: { id: clause.id } })
      );

      const clauseCreateOrUpdatePromises = newClauseData.map((clauseInput) => {
        if (existingClauses.some((ec) => ec.id === clauseInput.id)) {
          return prisma.additive_Clauses.update({
            where: { id: clauseInput.id },
            data: { description: clauseInput.description },
          });
        } else {
          return prisma.additive_Clauses.create({
            data: {
              additive_id: id,
              description: clauseInput.description,
            },
          });
        }
      });

      await Promise.all([...clauseDeletePromises]);
      await Promise.all([...clauseCreateOrUpdatePromises]);

      return updatedContract;
    });

    return result;
  }
  async createReajustment(
    contractId: number,
    valueContract: number,
    index: number,
    type: string,
    text: string
  ) {

    const user = await prisma.reajustment.create({
      data: {
        contract_id: contractId,
        valueContract: valueContract,
        index: index,
        type: type,
        text: text,
      },
    });

    return user;
  }
  async deleteReajustment(id: number) {
    const user = await prisma.reajustment.delete({
      where: { id },
    });

    return user;
  }
  async updateReajustment(
    id: number,
    updateData: ReajustmentUpdateInput,
  ) {
    const result = await prisma.reajustment.update({
      where: {id: id},
      data: updateData
    })

    return result;
  }
}

export default new AdditiveOrReajustmentService();
