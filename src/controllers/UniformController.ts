import { Request, Response } from "express";
import prisma from "../database/prisma";
import UniformService from "../services/UniformService";

class UniformController {
  async getById(req: Request, res: Response) {
    try {
      const uniformId = parseInt(req.params.id);

      const existedUniform = await prisma.uniform.findUnique({
        where: { id: uniformId },
      });

      if (!existedUniform) {
        return res.status(500).json({ message: "Usuário não encontrado!" });
      }

      const user = await UniformService.getById(uniformId);

      return res.status(200).json({ user, message: "Uniforme/EPI encontrado." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }
  async getAll(req: Request, res: Response) {
    try {
      const { name } = req.query;

      const listUniforms = await UniformService.getAllUsers(name?.toString());

      if (!listUniforms) {
        return res.status(500).json({ message: "Não há uniformes/epi's!" });
      }

      return res
        .status(200)
        .json({ listUniforms, message: "Uniformes/EPI's listados com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }
  async create(req: Request, res: Response) {
    try {
      const {
        name,
        size,
        unit,
        quantity,
        quantityMinimum,
        numberNF,
        baseValue,
        barCode
      } = req.body;

      const quantityInt = parseInt(quantity)
      const quantityMinimumInt = parseInt(quantityMinimum)
      const baseValueFloat = parseFloat(baseValue)

      const response = await UniformService.create(
        name,
        size,
        unit,
        quantityInt,
        quantityMinimumInt,
        numberNF,
        baseValueFloat,
        barCode
      );

      return res.status(200).json({ response, message: "Uniforme/EPI cadastrado!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }
  async delete(req: Request, res: Response) {
    try {
      const uniformId = parseInt(req.params.id);

      const existedUniform = await prisma.uniform.findUnique({
        where: { id: uniformId },
      });

      if (!existedUniform) {
        return res.status(500).json({ message: "Uniforme/EPI não encontrado!" });
      }

      const uniform = await UniformService.delete(uniformId);

      return res
        .status(200)
        .json({ uniform, message: "Uniforme/EPI deletado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }
  async update(req: Request, res: Response) {
    try {
      const uniformId = parseInt(req.params.id);

      const existedUniform = await prisma.uniform.findUnique({
        where: { id: uniformId },
      });

      if (!existedUniform) {
        return res.status(500).json({ message: "Uniforme/EPI não encontrado!" });
      }

      const updateData = await req.body;

      const updatedUniform = await UniformService.update(uniformId, updateData);

      return res
        .status(200)
        .json({ updatedUniform, message: "Uniforme/EPI atualizado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }
}

export default new UniformController();
