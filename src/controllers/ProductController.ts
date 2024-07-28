import { Request, Response } from "express";
import prisma from "../database/prisma";
import ProductService from "../services/ProductService";

class ProductController {
  async getById(req: Request, res: Response) {
    try {
      const productId = parseInt(req.params.id);

      const existedProduct = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!existedProduct) {
        return res.status(500).json({ message: "Produto não encontrado!" });
      }

      const product = await ProductService.getById(productId);

      return res.status(200).json({ product, message: "Produto encontrado." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }
  async getAll(req: Request, res: Response) {
    try {
      const { name } = req.query;

      const listProducts = await ProductService.getAllUsers(name?.toString());

      if (!listProducts) {
        return res.status(500).json({ message: "Não há produtos!" });
      }

      return res
        .status(200)
        .json({ listProducts, message: "Produtos listados com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }
  async create(req: Request, res: Response) {
    try {
      const {
        name,
        unitOfMeasurement,
        unit,
        quantity,
        quantityMinimum,
        numberNF,
        baseValue,
        barCode
      } = req.body;

      const response = await ProductService.create(
        name,
        unitOfMeasurement,
        unit,
        quantity,
        quantityMinimum,
        numberNF,
        baseValue,
        barCode
      );

      return res.status(200).json({ response, message: "Produto cadastrado!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }
  async delete(req: Request, res: Response) {
    try {
      const productId = parseInt(req.params.id);

      const existedProduct = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!existedProduct) {
        return res.status(500).json({ message: "Produto não encontrado!" });
      }

      const uniform = await ProductService.delete(productId);

      return res
        .status(200)
        .json({ uniform, message: "Produto deletado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }
  async update(req: Request, res: Response) {
    try {
      const productId = parseInt(req.params.id);

      const existedProduct = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!existedProduct) {
        return res.status(500).json({ message: "Produto não encontrado!" });
      }

      const updateData = await req.body;

      const updatedProduct = await ProductService.update(productId, updateData);

      return res
        .status(200)
        .json({ updatedProduct, message: "Produto atualizado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }
}

export default new ProductController();
