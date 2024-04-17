import { Request, Response } from "express";
import prisma from "../database/prisma";
import DocumentsService from "../services/DocumentsService";

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

class DocumentsController {
  async createService(req: Request, res: Response) {
    try {
      const {
        description,
        code
      } = req.body;

      const service = await DocumentsService.createService(
        description,
        code
      );

      return res
        .status(201)
        .json({ service, message: "Serviço criado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error });
    }
  }

  async deleteService(req: Request, res: Response) {
    try {
      const serviceId = parseInt(req.params.id);

      const existedService = await prisma.services.findUnique({
        where: { id: serviceId },
      });

      if (!existedService) {
        return res.status(500).json({ message: "Serviço não encontrado!" });
      }

      const service = await DocumentsService.deleteService(serviceId);

      return res
        .status(200)
        .json({ service, message: "Serviço deletado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }

  async updateService(req: Request, res: Response) {
    try {
      const serviceId = parseInt(req.params.id);

      const existedService = await prisma.services.findUnique({
        where: { id: serviceId },
      });

      if (!existedService) {
        return res.status(500).json({ message: "Serviço não encontrado!" });
      }

      const updateData = await req.body;
      const { Redirects, ...serviceData} = updateData;
      

      const updatedService = await DocumentsService.updateService(serviceId, serviceData);

      return res
        .status(200)
        .json({ updatedService, message: "Serviço atualizado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }

  async getServices(req: Request, res: Response) {
    try {
      const { type } = req.query;

      const listServices = await DocumentsService.getServices(
        type?.toString(),
      );

      if (!listServices) {
        return res.status(500).json({ message: "Não há serviços!" });
      }

      return res
        .status(200)
        .json({ listServices, message: "Serviços listados com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }
  async createContract(req: Request, res: Response) {
    try {
      const {
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
        servicesContract,  
        clauses,      
      } = req.body;
      

      const numberInt = parseInt(number, 10)
      const contractNumberInt = parseInt(contractNumber, 10)

      const contract = await DocumentsService.createContract(
        status,
        name,
        cpfcnpj,
        cep,
        road,
        numberInt,
        complement,
        neighborhood,
        city,
        state,
        tecSignature,
        contractNumberInt,
        date,
        value,
        index,
        servicesContract,  
        clauses,
      );

      return res
        .status(201)
        .json({ contract, message: "Contrato criado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error });
    }
  }

  async deleteContract(req: Request, res: Response) {
    try {
      const contractId = parseInt(req.params.id);

      const existedContract = await prisma.contracts.findUnique({
        where: { id: contractId },
      });

      if (!existedContract) {
        return res.status(500).json({ message: "Contrato não encontrado!" });
      }

      const contract = await DocumentsService.deleteContract(contractId);

      return res
        .status(200)
        .json({ contract, message: "Contrato deletado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }

  async updateContract(req: Request, res: Response) {
    try {
      const contractId = parseInt(req.params.id);

      const existedContract = await prisma.contracts.findUnique({
        where: { id: contractId },
      });

      if (!existedContract) {
        return res.status(500).json({ message: "Contrato não encontrado!" });
      }

      const updateData = await req.body;
      const { clauses, contracts_Service, ...contractData} = updateData;
      

      const updatedContract = await DocumentsService.updateContract(contractId, contractData, contracts_Service, clauses);

      return res
        .status(200)
        .json({ updatedContract, message: "Contrato atualizado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }

  async getContracts(req: Request, res: Response) {
    try {
      const { type } = req.query;

      const listContracts= await DocumentsService.getContracts(
        type?.toString(),
      );

      if (!listContracts) {
        return res.status(500).json({ message: "Não há contratos!" });
      }

      return res
        .status(200)
        .json({ listContracts, message: "Contratos listados com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }
}

export default new DocumentsController();
