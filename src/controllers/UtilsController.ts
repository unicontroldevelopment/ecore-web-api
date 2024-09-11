import { Request, Response } from "express";
import {
    buscaCepService,
    buscaHorasTrabalhadasRHService,
    converteValorExtenso,
} from "../services/UtilsService";

class UtilsController {
  async buscaHorasTrabalhadasRH(req: Request, res: Response) {
    const { date_ini, date_fim } = req.body;

    try {
      const result = await buscaHorasTrabalhadasRHService(date_ini, date_fim);
      res.json(result);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao buscar horas trabalhadas", error });
    }
  }
  async converteValorExtensoHandler(req: Request, res: Response) {
    try {
      const { valor } = req.body;

      if (!valor) {
        return res.status(400).json({ message: "Valor é obrigatório." });
      }

      const valorPorExtenso = converteValorExtenso(valor);
      res.json(valorPorExtenso);
    } catch (error) {
      console.error("Erro ao converter valor para extenso:", error);
      res.status(500).json({ message: "Erro interno ao processar o valor." });
    }
  }
  async buscaCep(req: Request, res: Response) {
    const { cep } = req.body;
    try {
      const endereco = await buscaCepService(cep);
      res.json(endereco);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar CEP", error });
    }
  }
}

export default new UtilsController();
