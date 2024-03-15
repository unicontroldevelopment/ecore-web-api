import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import prisma from "../database/prisma";
import EmployeeService from "../services/EmployeeService";

class EmployeeController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await prisma.employees.findUnique({
        where: { email: email },
      });

      if (!user) {
        return res.status(500).json({ message: "Usuário não encontrado!" });
      }

      if (password !== user.password) {
        return res.status(422).json({ message: "Senha inválida!" });
      }

      const token = sign({ id: user.id }, process.env.JWT_KEY ?? "", {});

      const { password: _, ...userLogin } = user;

      const { id } = userLogin;

      const loggedUser = await EmployeeService.getById(id);

      return res.status(200).json({ user: loggedUser, token });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const {
        role,
        name,
        password,
        passwordConfirmation,
        department,
        company,
        unit,
        networkUser,
        networkPassword,
        email,
        emailPassword,
        discordEmail,
        discordPassword,
        notebookBrand,
        notebookName,
        notebookProperty,
        coolerProperty,
        officeVersion,
        windowsVersion,
      } = req.body;
      
      const user = await EmployeeService.create(
        role,
        name,
        password,
        passwordConfirmation,
        department,
        company,
        unit,
        networkUser,
        networkPassword,
        email,
        emailPassword,
        discordEmail,
        discordPassword,
        notebookBrand,
        notebookName,
        notebookProperty,
        coolerProperty,
        officeVersion,
        windowsVersion
      );

      return res
        .status(201)
        .json({ user, message: "Usuário criado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      
      const existedUser = await prisma.employees.findUnique({
        where: { id: userId },
      });

      if (!existedUser) {
        return res.status(500).json({ message: "Usuário não encontrado!" });
      }

      const user = await EmployeeService.getById(userId);

      return res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
    }

    async delete(req: Request, res: Response) {
      console.log('delete');
      
      try {
        const userId = parseInt(req.params.id);
        
        const existedUser = await prisma.employees.findUnique({
          where: { id: userId },
        });
  
        if (!existedUser) {
          return res.status(500).json({ message: "Usuário não encontrado!" });
        }
  
        const user = await EmployeeService.deleteUser(userId);
        console.log(user);
        
        return res.status(204).json();
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Internal Error", error });
      }
    }
}

export default new EmployeeController();
