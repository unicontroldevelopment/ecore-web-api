import { Request, Response } from "express";
import prisma from "../database/prisma";
import ContractSignatureService from "../services/ContractSignatureService";

class ContractSignatureController {
    async create(req: Request, res: Response) {
      try {
        const {
            cpf,
            email,
            phone,
            address,
            socialReason,
            cnpj,
            responsibleName,
            state,
            city
        } = req.body;
  
        const user = await ContractSignatureService.create(
            cpf,
            email,
            phone,
            address,
            socialReason,
            cnpj,
            responsibleName,
            state,
            city
        );
  
        return res
          .status(201)
          .json({ user, message: "Assinatura criada com sucesso!" });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error });
      }
    }
  
    async getById(req: Request, res: Response) {
      try {
        const userId = parseInt(req.params.id);
  
        const existedUser = await prisma.contract_Signature.findUnique({
          where: { id: userId },
        });
  
        if (!existedUser) {
          return res.status(500).json({ message: "Assinatura não encontrada!" });
        }
  
        const user = await ContractSignatureService.getById(userId);
  
        return res.status(200).json({ user, message: "Assinatura encontrada." });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Internal Error", error });
      }
    }
  
    async delete(req: Request, res: Response) {
      try {
        const userId = parseInt(req.params.id);
  
        const existedUser = await prisma.contract_Signature.findUnique({
          where: { id: userId },
        });
  
        if (!existedUser) {
          return res.status(500).json({ message: "Assinatura não encontrada!" });
        }
  
        const user = await ContractSignatureService.delete(userId);
  
        return res
          .status(200)
          .json({ user, message: "Assinatura deletada com sucesso!" });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Internal Error", error });
      }
    }
  
    async update(req: Request, res: Response) {
      try {
        const userId = parseInt(req.params.id);
  
        const existedUser = await prisma.contract_Signature.findUnique({
          where: { id: userId },
        });
  
        if (!existedUser) {
          return res.status(500).json({ message: "Assinatura não encontrada!" });
        }
  
        const updateData = await req.body;
  
        const updatedUser = await ContractSignatureService.update(userId, updateData);
  
        return res
          .status(200)
          .json({ updatedUser, message: "Assinatura atualizada com sucesso!" });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Internal Error", error });
      }
    }
  
    async getAll(req: Request, res: Response) {
      try {
  
        const listUsers = await ContractSignatureService.getAll(
        );
  
        if (!listUsers) {
          return res.status(500).json({ message: "Não há assinaturas!" });
        }
  
        return res
          .status(200)
          .json({ listUsers, message: "Assinaturas listadas com sucesso!" });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Internal Error", error });
      }
    }
  }
  
  export default new ContractSignatureController();
  