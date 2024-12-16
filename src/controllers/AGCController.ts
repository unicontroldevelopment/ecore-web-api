import { Request, Response } from "express";
import AGCService from "../services/AGCService";

class AGCController {
    async buscaInsumos(req: Request, res: Response) {
        try {
          const result = await AGCService.buscaInsumosService();
          res.json(result);
        } catch (error) {
          res.status(500).json({ message: "Erro ao buscar insumos", error });
        }
      }
      async buscarMovimentacoes(req: Request, res: Response): Promise<void> {
        try {
          const pedidos = await AGCService.buscaInsumosMoviemntacao();
          res.json(pedidos);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Erro ao buscar pedidos" });
        }
      }

      async buscarProdutos (req: Request, res: Response): Promise<void> {
        try {
        const produtos = await AGCService.buscarProdutos();
        res.json(produtos);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Erro ao buscar produtos" });
        }
      }
}

export default new AGCController();