import { Request, Response } from "express";

const numero_extenso = require("numero-por-extenso")

// Converte valor para extenso
export const converteValorExtensoHandler = (req: Request, res: Response): void => {
  const { valor } = req.body; 
  res.json(
    numero_extenso.porExtenso(
      valor.split(".").join("").split(",").join("."),
      numero_extenso.estilo.monetario
    )
  );
};