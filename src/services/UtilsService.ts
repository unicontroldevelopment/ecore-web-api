import { Request, Response } from "express";
import prisma from "../database/prisma";
const busca_cep = require("busca-cep");

const numero_extenso = require("numero-por-extenso");

export const converteValorExtensoHandler = (
  req: Request,
  res: Response
): void => {
  const { valor } = req.body;
  res.json(
    numero_extenso.porExtenso(
      valor.split(".").join("").split(",").join("."),
      numero_extenso.estilo.monetario
    )
  );
};

export const uploadPdf = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const idInt = parseInt(id);
    const { file } = req;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const savedFile = await prisma.propouse.create({
      data: {
        contract_id: idInt,
        file: file.buffer,
        fileName: file.originalname,
      },
    });

    res.status(201).json(savedFile);
  } catch (error) {
    console.error("Error saving file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

//Busca CEP
export const buscaCep = async (req: Request, res: Response) => {
  const { cep } = req.body;
  if (cep.length < 9) {
    res.json(false);
  } else {
    busca_cep(cep)
      .then((endereco: string) => {
        res.json(endereco);
      })
      .catch((error: Error) => {
        res.json(error);
      });
  }
};

export const updatePdf = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const idInt = parseInt(id);
    const { file } = req;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const updatedFile = await prisma.propouse.update({
      where: { contract_id: idInt },
      data: {
        file: file.buffer,
        fileName: file.originalname,
      },
    });

    res.status(200).json(updatedFile);
  } catch (error) {
    console.error("Error updating file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};