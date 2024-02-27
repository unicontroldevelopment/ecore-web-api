import bcryptjs from "bcryptjs";
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import prisma from "../database/prisma";
import UserService from "../services/UserService";

class UserController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await prisma.users.findUnique({ where: { email: email } });

      if (!user) {
        return res.status(500).json({ message: "Usuário não encontrado!" });
      }

      if (!(await bcryptjs.compare(password, user.password))) {
        return res.status(422).json({ message: "Senha inválida!" });
      }

      const token = sign({ id: user.id }, process.env.JWT_KEY ?? "", {});

      const { password: _, ...userLogin } = user;

      const { id } = userLogin;

      const loggedUser = await UserService.getById(id);

      return res.status(200).json({ user: loggedUser, token });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }
  async create(req: Request, res: Response) {
    try {
      const { name, email, password, passwordConfirmation, role } = req.body;
      const user = await UserService.create(
        name,
        email,
        password,
        passwordConfirmation,
        role
      );

      return res
        .status(201)
        .json({ user, message: "Usuário criado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error });
    }
  }
}

export default new UserController();
