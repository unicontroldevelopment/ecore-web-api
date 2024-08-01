import { Request, Response } from "express";
import prisma from "../database/prisma";
import AdditiveOrReajustmentService from "../services/AdditiveOrReajustmentService";

interface ServiceInput {
  id: number;
  contract_id: number;
  service_id: number;
  Services?: {
    id: number;
    description: string;
  };
}

interface ClauseInput {
  id?: number;
  description: string;
}

class AdditiveOrReajustmentController {
  async createAdditive(req: Request, res: Response) {
    try {
      const {
        contract_id,
        newValue,
        oldValue,
        clauses
      } = req.body;


      const contract = await AdditiveOrReajustmentService.createAdditive(
        contract_id,
        newValue,
        oldValue,
        clauses
      );

      return res
        .status(201)
        .json({ contract, message: "Reajuste criado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error });
    }
  }

  async deleteAdditive(req: Request, res: Response) {
    try {
      const contractId = parseInt(req.params.id);

      const existedContract = await prisma.additive.findUnique({
        where: { id: contractId },
      });

      if (!existedContract) {
        return res.status(500).json({ message: "Reajuste não encontrado!" });
      }

      const contract = await AdditiveOrReajustmentService.deleteAdditive(contractId);

      return res
        .status(200)
        .json({ contract, message: "Reajuste deletado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }

  async updateAdditive(req: Request, res: Response) {
    try {
      const contractId = parseInt(req.params.id);

      const existedContract = await prisma.additive.findUnique({
        where: { id: contractId },
      });

      if (!existedContract) {
        return res.status(500).json({ message: "Aditivo não encontrado!" });
      }

      const updateData = await req.body;
      const { signOnContract, clauses, contracts_Service, ...contractData} = updateData;
      

      const updatedContract = await AdditiveOrReajustmentService.updateAdditive(contractId, contractData, contracts_Service, clauses, signOnContract);

      return res
        .status(200)
        .json({ updatedContract, message: "Aditivo atualizado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }
  async createReajustment(req: Request, res: Response) {
    try {
      const {
        contract_id,
        newValue,
        index
      } = req.body;

      const contractId = parseInt(contract_id);
      const valueInt = parseInt(newValue);

      const contract = await AdditiveOrReajustmentService.createReajustment(
        contractId,
        valueInt,
        index
      );

      return res
        .status(201)
        .json({ contract, message: "Aditivo criado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error });
    }
  }

  async deleteReajustment(req: Request, res: Response) {
    try {
      const contractId = parseInt(req.params.id);

      const existedContract = await prisma.reajustment.findUnique({
        where: { id: contractId },
      });

      if (!existedContract) {
        return res.status(500).json({ message: "Aditivo não encontrado!" });
      }

      const contract = await AdditiveOrReajustmentService.deleteReajustment(contractId);

      return res
        .status(200)
        .json({ contract, message: "Aditivo deletado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }

  async updateReajustment(req: Request, res: Response) {
    try {
      const contractId = parseInt(req.params.id);

      const existedContract = await prisma.reajustment.findUnique({
        where: { id: contractId },
      });

      if (!existedContract) {
        return res.status(500).json({ message: "Aditivo não encontrado!" });
      }

      const updateData = await req.body;
      const { signOnContract, clauses, contracts_Service, ...contractData} = updateData;
      

      const updatedContract = await AdditiveOrReajustmentService.updateReajustment(contractId, contractData, contracts_Service, clauses, signOnContract);

      return res
        .status(200)
        .json({ updatedContract, message: "Aditivo atualizado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }
}

export default new AdditiveOrReajustmentController();
