import { Request, Response } from "express";
import prisma from "../database/prisma";
import EmailService from "../services/EmailService";


interface User {
  name: string;
}
class EmailController {
  async create(req: Request, res: Response) {
    try {
      const {
        email,
        type,
        password,
        redirects,
      } = req.body;

      const user = await EmailService.create(
        email,
        type,
        password,
        redirects
      );

      return res
        .status(201)
        .json({ user, message: "E-mail criado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);

      const existedUser = await prisma.emails.findUnique({
        where: { id: userId },
      });

      if (!existedUser) {
        return res.status(500).json({ message: "E-mail não encontrado!" });
      }

      const user = await EmailService.getById(userId);

      return res.status(200).json({ user, message: "E-mail encontrado." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);

      const existedUser = await prisma.emails.findUnique({
        where: { id: userId },
      });

      if (!existedUser) {
        return res.status(500).json({ message: "E-mail não encontrado!" });
      }

      const user = await EmailService.delete(userId);

      return res
        .status(200)
        .json({ user, message: "E-mail deletado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);

      const existedUser = await prisma.emails.findUnique({
        where: { id: userId },
      });

      if (!existedUser) {
        return res.status(500).json({ message: "E-mail não encontrado!" });
      }

      const updateData = await req.body;
      const { Redirects, ...emailData} = updateData;
      

      const updatedUser = await EmailService.update(userId, emailData);

      return res
        .status(200)
        .json({ updatedUser, message: "E-mail atualizado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const { type } = req.query;

      const listUsers = await EmailService.getAllEmails(
        type?.toString(),
      );

      if (!listUsers) {
        return res.status(500).json({ message: "Não há e-mails!" });
      }

      return res
        .status(200)
        .json({ listUsers, message: "E-mails listados com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }
}

export default new EmailController();
