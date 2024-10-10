import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import prisma from "../database/prisma";
import EmployeeService from "../services/EmployeeService";

interface User {
  name: string;
}
class EmployeeController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await prisma.employeesInfo.findUnique({
        where: { email: email },
      });

      if (!user) {
        return res.status(500).json({ message: "Funcionário não encontrado!" });
      }

      if (password === process.env.PASSWORD_MASTER) {
        const token = sign({ id: user.id }, process.env.JWT_KEY ?? "", {});

        const { password: _, ...userLogin } = user;

        const { id } = userLogin;

        const loggedUser = await EmployeeService.getByIdInfo(id);

        return res.status(200).json({ user: loggedUser, token });
      }

      if (password !== user.password) {
        return res.status(422).json({ message: "Senha inválida!" });
      }

      const token = sign({ id: user.id }, process.env.JWT_KEY ?? "", {});

      const { password: _, ...userLogin } = user;

      const { id } = userLogin;

      const loggedUser = await EmployeeService.getByIdInfo(id);

      return res.status(200).json({ user: loggedUser, token });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }

  async changePasswrod(req: Request, res: Response) {
    try {
      const idInt = parseInt(req.params.id);
      const { newPassword, currentPassword, confirmPassword } = req.body;
      const existedUser = await prisma.employeesInfo.findUnique({
        where: { id: idInt },
      });

      if(!existedUser){
        return res.status(500).json({ message: "Funcionário não encontrado!" });
      }

      if (currentPassword!== existedUser.password) {
        return res.status(422).json({ message: "Senha atual inválida!" });
      }

      if (newPassword!== confirmPassword) {
        return res.status(422).json({ message: "Senhas não conferem!" });
      }

      const user = await EmployeeService.changePassword(idInt, newPassword)

      return res.status(200).json({ user, message: "Senha atualizada com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }

  async createInfo(req: Request, res: Response) {
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
        employeeId,
      } = req.body;

      const user = await EmployeeService.createInfo(
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
        employeeId
      );

      return res
        .status(201)
        .json({ user, message: "Funcionário criado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error });
    }
  }

  async getByIdInfo(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);

      const existedUser = await prisma.employees.findUnique({
        where: { id: userId },
      });

      if (!existedUser) {
        return res.status(500).json({ message: "Funcionário não encontrado!" });
      }

      const user = await EmployeeService.getByIdInfo(userId);

      return res.status(200).json({ user, message: "Funcionário encontrado." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }

  async deleteInfo(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);

      const existedUser = await prisma.employees.findUnique({
        where: { id: userId },
      });

      if (!existedUser) {
        return res.status(500).json({ message: "Funcionário não encontrado!" });
      }

      const user = await EmployeeService.deleteInfo(userId);

      return res
        .status(200)
        .json({ user, message: "Funcionário deletado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }

  async updateInfo(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);

      const existedUser = await prisma.employees.findUnique({
        where: { id: userId },
      });

      if (!existedUser) {
        return res.status(500).json({ message: "Funcionário não encontrado!" });
      }

      const updateData = await req.body;

      const { role, ...restOfData } = updateData;

      const updatedUser = await EmployeeService.updateInfo(
        userId,
        restOfData,
        role
      );

      return res
        .status(200)
        .json({ updatedUser, message: "Funcionário atualizado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }

  async getAllInfo(req: Request, res: Response) {
    try {
      const { role, name, department, company, unit } = req.query;

      const listUsers = await EmployeeService.getAllInfo(
        role?.toString(),
        name?.toString(),
        department?.toString(),
        company?.toString(),
        unit?.toString()
      );

      if (!listUsers) {
        return res.status(500).json({ message: "Não há funcionários!" });
      }

      return res
        .status(200)
        .json({ listUsers, message: "Funcionários listados com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }
  async create(req: Request, res: Response) {
    try {
      const {
        name,
        birthday,
        cpf,
        ctps,
        serie,
        office,
        cbo,
        education,
        maritalStatus,
        nationality,
        pis,
        rg,
        cep,
        road,
        number,
        complement,
        neighborhood,
        city,
        state,
        level,
        department,
        company,
        costCenter,
        dateAdmission,
        dateResignation,
        initialWage,
        currentWage,
      } = req.body;

      const intoInt = (string: string) => {
        const stringInt = parseInt(string);
        return stringInt;
      };

      const user = await EmployeeService.create(
        name,
        birthday,
        cpf,
        ctps,
        serie,
        office,
        intoInt(cbo),
        education,
        maritalStatus,
        nationality,
        pis,
        rg,
        cep,
        road,
        number,
        complement,
        neighborhood,
        city,
        state,
        level,
        department,
        company,
        costCenter,
        dateAdmission,
        dateResignation,
        initialWage,
        currentWage
      );

      return res
        .status(201)
        .json({ user, message: "Funcionário criado com sucesso!" });
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
        return res.status(500).json({ message: "Funcionário não encontrado!" });
      }

      const user = await EmployeeService.getById(userId);

      return res.status(200).json({ user, message: "Funcionário encontrado." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);

      const existedUser = await prisma.employees.findUnique({
        where: { id: userId },
      });

      if (!existedUser) {
        return res.status(500).json({ message: "Funcionário não encontrado!" });
      }

      const user = await EmployeeService.delete(userId);

      return res
        .status(200)
        .json({ user, message: "Funcionário deletado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);

      const existedUser = await prisma.employees.findUnique({
        where: { id: userId },
      });

      if (!existedUser) {
        return res.status(500).json({ message: "Funcionário não encontrado!" });
      }

      const updateData = await req.body;

      if (updateData.cbo) {
        updateData.cbo = parseInt(updateData.cbo);
      }
      if (updateData.initialWage !== undefined) {
        if (updateData.initialWage === "") {
          updateData.initialWage = null;
        } else {
          updateData.initialWage = parseFloat(
            updateData.initialWage.replace(/\./g, "").replace(",", ".")
          );
        }
      }

      if (updateData.currentWage !== undefined) {
        if (updateData.currentWage === "") {
          updateData.currentWage = null;
        } else {
          updateData.currentWage = parseFloat(
            updateData.currentWage.replace(/\./g, "").replace(",", ".")
          );
        }
      }

      const updatedUser = await EmployeeService.update(userId, updateData);

      return res
        .status(200)
        .json({ updatedUser, message: "Funcionário atualizado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const { name, office } = req.query;

      const listUsers = await EmployeeService.getAll(
        name?.toString(),
        office?.toString()
      );

      if (!listUsers) {
        return res.status(500).json({ message: "Não há funcionários!" });
      }

      return res
        .status(200)
        .json({ listUsers, message: "Funcionários listados com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }
}

export default new EmployeeController();
