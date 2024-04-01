import { Request, Response } from "express";
import prisma from "../database/prisma";
import DocumentsService from "../services/DocumentsService";


interface User {
  name: string;
}
class EmailController {
  async createService(req: Request, res: Response) {
    try {
      const {
        description,
        code
      } = req.body;

      const user = await DocumentsService.createService(
        description,
        code
      );

      return res
        .status(201)
        .json({ user, message: "E-mail criado com sucesso!" });
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
      const userId = parseInt(req.params.id);

      const existedUser = await prisma.services.findUnique({
        where: { id: userId },
      });

      if (!existedUser) {
        return res.status(500).json({ message: "Serviço não encontrado!" });
      }

      const updateData = await req.body;
      const { Redirects, ...emailData} = updateData;
      

      const updatedUser = await DocumentsService.updateService(userId, emailData);

      return res
        .status(200)
        .json({ updatedUser, message: "Serviço atualizado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }

  async getServices(req: Request, res: Response) {
    try {
      const { type } = req.query;

      const listUsers = await DocumentsService.getServices(
        type?.toString(),
      );

      if (!listUsers) {
        return res.status(500).json({ message: "Não há serviços!" });
      }

      return res
        .status(200)
        .json({ listUsers, message: "Serviços listados com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }
}

export default new EmailController();
