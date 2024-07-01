import { Product } from "@prisma/client";
import prisma from "../database/prisma";

type ProductUpdateInput = Partial<Omit<Product, "id" | "created" | "updated">>;
class ProductService {
  async getById(id: number) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    return product;
  }
  async getAllUsers(name?: string) {
    {
      const productList = await prisma.product.findMany({
        orderBy: {
          created: "asc",
        },
      });

      return productList;
    }
  }
  async create(
    name: string,
    unitOfMeasurement: string,
    unit: string,
    quantity: number,
    quantityMinimum: number,
    numberNF: string,
    baseValue: number,
    barCode: string
  ) {
    const productAlreadyExists = await prisma.product.findFirst({
      where: { name },
    });

    if (productAlreadyExists) {
      throw new Error("Usuário já existe!");
    }

    const product = await prisma.product.create({
      data: {
        name,
        unitOfMeasurement,
        unit,
        quantity,
        quantityMinimum,
        numberNF,
        baseValue,
        barCode,
      },
    });

    return product;
  }
  async delete(id: number) {
    const product = await prisma.product.delete({
      where: { id },
    });

    return product;
  }
  async update(id: number, updateData: ProductUpdateInput) {
    const product = await prisma.product.update({
      where: {
        id: id,
      },
      data: updateData,
    });

    return product;
  }
}

export default new ProductService();
