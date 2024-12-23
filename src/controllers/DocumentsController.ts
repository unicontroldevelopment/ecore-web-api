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
      const { description, code } = req.body;

      const service = await DocumentsService.createService(description, code);

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
      const { Redirects, ...serviceData } = updateData;

      const updatedService = await DocumentsService.updateService(
        serviceId,
        serviceData
      );

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

      const listServices = await DocumentsService.getServices(type?.toString());

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
        contractNumber,
        date,
        value,
        index,
        signOnContract,
        servicesContract,
        clauses,
      } = req.body;

      const signNumber = parseInt(signOnContract, 10);
      const floatValue = parseFloat(value.replace(/\./g, '').replace(',', '.')).toString();


      const contract = await DocumentsService.createContract(
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
        floatValue,
        index,
        signNumber,
        servicesContract,
        clauses
      );

      return res
        .status(201)
        .json({ contract, message: "Contrato criado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error });
    }
  }

  async createCustomer(req: Request, res: Response) {
    try {
      const {signOnContract, ...data} = req.body;

      const signNumber = parseInt(signOnContract, 10);

      const contract = await DocumentsService.createCustomer(data, signNumber);

      return res
        .status(201)
        .json({ contract, message: "Cliente criado com sucesso!" });
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

      const {
        id,
        signOnContract,
        clauses,
        contracts_Service,
        ...contractData
      } = updateData;

      if (contractData.value) {
        contractData.value = parseFloat(
          contractData.value.replace(/\./g, "").replace(",", ".")
        );
      }

      const updatedContract = await DocumentsService.updateContract(
        contractId,
        contractData,
        contracts_Service,
        clauses,
        signOnContract
      );

      return res
        .status(200)
        .json({ updatedContract, message: "Contrato atualizado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const Id = parseInt(req.params.id);

      const existedUser = await prisma.contracts.findUnique({
        where: { id: Id },
      });

      if (!existedUser) {
        return res.status(500).json({ message: "Contrato não encontrado!" });
      }

      const user = await DocumentsService.getByIdContract(Id);

      return res.status(200).json({ user, message: "Contrato encontrado." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }

  async getByIdAllInfo(req: Request, res: Response) {
    try {
      const Id = parseInt(req.params.id);

      const existedUser = await prisma.contracts.findUnique({
        where: { id: Id },
      });

      if (!existedUser) {
        return res.status(500).json({ message: "Contrato não encontrado!" });
      }

      const user = await DocumentsService.getByIdContractAllInfo(Id);

      return res.status(200).json({ user, message: "Contrato encontrado." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }

  async getContracts(req: Request, res: Response) {
    try {
      const { name, type } = req.query;

      const listContracts = await DocumentsService.getContracts(
        name?.toString(),
        type?.toString()
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

  async getDashboardStats(req: Request, res: Response) {
    try {
      const stats = await DocumentsService.getDashboardStats();
      return res.status(200).json(stats);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  async getContractsByMonth(req: Request, res: Response) {
    try {
      const contractsByMonth = await DocumentsService.getContractsByMonth();
      res.json(contractsByMonth);
    } catch (error) {
      console.error("Erro ao buscar contratos por mês:", error);
      res.status(500).json({ message: "Erro interno ao processar a requisição." });
    }
  }
}

export default new DocumentsController();
