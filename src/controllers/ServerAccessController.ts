import { Request, Response } from "express";
import prisma from "../database/prisma";
import ServerAccessService from "../services/ServerAccessService";

class ServerAccessController {
  async getById(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);

      const existedUser = await prisma.serverAccess.findUnique({
        where: { id: userId },
      });

      if (!existedUser) {
        return res.status(500).json({ message: "Usuário não encontrado!" });
      }

      const user = await ServerAccessService.getById(userId);

      return res.status(200).json({ user, message: "Usuário encontrado." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }
  async getAllUsers(req: Request, res: Response) {
    try {
      const listUsers = await ServerAccessService.getAllUsers()

      if(!listUsers) {
        return res.status(500).json({ message: "Não há usuários!" });
      }

      return res.status(200).json({listUsers,  message: "Usuários listados com sucesso!"});
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: "Server Internal Error", error})
    }
  }
  async create(req: Request, res: Response) {
    try {
      const {
        fitolog,
        commercial,
        administrative,
        humanResources,
        technician,
        newsis,
        marketing,
        projects,
        managementControl,
        trainings,
        it,
        temp,
        franchises,
        employeeId,
      } = req.body;

      const response = await ServerAccessService.create(
        fitolog,
        commercial,
        administrative,
        humanResources,
        technician,
        newsis,
        marketing,
        projects,
        managementControl,
        trainings,
        it,
        temp,
        franchises,
        employeeId
      );

      return res.status(200).json({ response, message: "Acesso criado!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }
  async delete(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      
      const existedUser = await prisma.serverAccess.findUnique({
        where: { id: userId },
      });

      if (!existedUser) {
        return res.status(500).json({ message: "Usuário não encontrado!" });
      }

      const user = await ServerAccessService.delete(userId);

      return res.status(200).json({user,  message: "Usuário deletado com sucesso!"});

    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }
  async update(req: Request, res: Response){
    try {
      const userId = parseInt(req.params.id);
    
      const existedUser = await prisma.serverAccess.findUnique({
        where: { id: userId },
      });

      if (!existedUser) {
        return res.status(500).json({ message: "Usuário não encontrado!" });
      }

      const updateData = await req.body;
      
      const updatedUser = await ServerAccessService.update(userId, updateData);
      

      return res.status(200).json({updatedUser, message: "Usuário atualizado com sucesso!"});

    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: "Server Internal Error", error})
    }
  }

}

export default new ServerAccessController();
