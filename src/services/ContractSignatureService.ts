import { Contract_Signature } from "@prisma/client";
import prisma from "../database/prisma";

type ContractSignUpdateInput = Partial<
  Omit<Contract_Signature, "id" | "created" | "updated">
>;
class ContractSignatureService {
  async getById(id: number) {
    const user = await prisma.contract_Signature.findUnique({
      where: { id },
    });

    return user;
  }

  async create(
    cpf: string,
    email: string,
    phone: string,
    address: string,
    socialReason: string,
    cnpj: string,
    responsibleName: string,
    state: string,
    city: string,
  ) {

    const userAlreadyExists = await prisma.contract_Signature.findFirst({
      where: { cpf },
    });

    if (userAlreadyExists) {
      throw new Error("Usuário já existe!");
    }

    const user = await prisma.contract_Signature.create({
      data: {
        cpf,
        email,
        phone,
        address,
        socialReason,
        cnpj,
        responsibleName,
        state,
        city
      },
    });

    return user;
  }

  async delete(id: number) {
    const user = await prisma.contract_Signature.delete({
      where: { id },
    });

    return user;
  }

  async update(id: number, updateData: ContractSignUpdateInput) {
    const user = await prisma.contract_Signature.update({
      where: {
        id: id,
      },
      data: updateData,
    });

    return user;
  }

  async getAll(
  ) {
    const contractSign = await prisma.contract_Signature.findMany({
      orderBy: {
        socialReason: "asc",
      },
    });

    return contractSign;
  }
}

export default new ContractSignatureService();
