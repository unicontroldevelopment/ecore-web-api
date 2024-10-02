import { Request, Response } from "express";
import prisma from "../database/prisma";
import AdditiveOrReajustmentService from "../services/AdditiveOrReajustmentService";
class AdditiveOrReajustmentController {
  async createAdditive(req: Request, res: Response) {
    try {
      const {
        contract_id,
        newValue,
        oldValue,
        clauses
      } = req.body;

      const idInt = parseInt(contract_id)
      const newValueFormat = newValue.replace(/\./g, "").replace(",", ".");
      const oldValueFormat = oldValue.replace(/\./g, "").replace(",", ".");

      const contract = await AdditiveOrReajustmentService.createAdditive(
        idInt,
        newValueFormat,
        oldValueFormat,
        clauses
      );

      return res
        .status(201)
        .json({ contract, message: "Aditivo criado com sucesso!" });
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
        return res.status(500).json({ message: "Aditivo não encontrado!" });
      }

      const contract = await AdditiveOrReajustmentService.deleteAdditive(contractId);

      return res
        .status(200)
        .json({ contract, message: "Aditivo deletado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }

  async updateAdditive(req: Request, res: Response) {
    try {
      const additiveId = parseInt(req.params.id);

      const existedContract = await prisma.additive.findUnique({
        where: { id: additiveId },
      });

      if (!existedContract) {
        return res.status(500).json({ message: "Aditivo não encontrado!" });
      }

      const {additive_Clauses, id, contract_id, d4SignData, ...updateData} = await req.body;

      if(updateData.newValue && updateData.oldValue) {
        updateData.newValue = parseFloat(updateData.newValue.replace(/\./g, '').replace(',', '.')).toString();
        updateData.oldValue = parseFloat(updateData.oldValue.replace(/\./g, '').replace(',', '.')).toString();
      }
      

      const updatedContract = await AdditiveOrReajustmentService.updateAdditive(additiveId, updateData, additive_Clauses);

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
        value,
        index,
        type,
        text
      } = req.body;
      
      const contractId = parseInt(contract_id);
      const indexFormat = index.replace(/\./g, "").replace(",", ".");
      const indexInt = parseFloat(indexFormat);
      const valueFormat = value.replace(/\./g, "").replace(",", ".");
      

      const contract = await AdditiveOrReajustmentService.createReajustment(
        contractId,
        valueFormat,
        indexInt,
        type,
        text
      );

      return res
        .status(201)
        .json({ contract, message: "Reajuste criado com sucesso!" });
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
        return res.status(500).json({ message: "Reajuste não encontrado!" });
      }

      const contract = await AdditiveOrReajustmentService.deleteReajustment(contractId);

      return res
        .status(200)
        .json({ contract, message: "Reajuste deletado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }

  async updateReajustment(req: Request, res: Response) {
    try {
      const reajustmentId = parseInt(req.params.id);

      const existedReajustment = await prisma.reajustment.findUnique({
        where: { id: reajustmentId },
      });

      if (!existedReajustment) {
        return res.status(500).json({ message: "Reajuste não encontrado!" });
      }

      const updateData = await req.body;

      const {index, contract_id, value, id, ...data } = updateData;
      let floatIndex: number;
      let floatValue: number;

      if (index.toString().includes(",")) {
        const indexFormat = index.replace(/\./g, "").replace(",", ".");
        floatIndex = parseFloat(indexFormat);
      } else {
        floatIndex = parseFloat(index);
      }
      
      if (value.toString().includes(",")) {
        const valueFormat = value.replace(/\./g, "").replace(",", ".");
        floatValue = parseFloat(valueFormat);
      } else {
        floatValue = parseFloat(value);
      }

      const updateDataReajustment = {index: floatIndex, valueContract: floatValue, ...data}

      const updatedContract = await AdditiveOrReajustmentService.updateReajustment(reajustmentId, updateDataReajustment);

      return res
        .status(200)
        .json({ updatedContract, message: "Reajuste atualizado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }
}

export default new AdditiveOrReajustmentController();
