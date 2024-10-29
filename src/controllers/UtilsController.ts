import { Request, Response } from "express";
import {
  alterarStatusPedidoCancelado,
  alterarStatusPedidoComprado,
  alterarStatusPedidoFinalizado,
  buscaCepService,
  buscaHorasTrabalhadasRHService,
  buscaInsumosService,
  buscarPedidosService,
  buscarProdutosDoPedidoService,
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

  async buscaInsumos(req: Request, res: Response) {
    try {
      const result = await buscaInsumosService();
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar insumos", error });
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
  async buscarPedidos(req: Request, res: Response): Promise<void> {
    try {
      const pedidos = await buscarPedidosService();
      res.json(pedidos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar pedidos" });
    }
  }
  async buscarProdutosDoPedido(req: Request, res: Response): Promise<void> {
    try {
      const { id_pedido } = req.body;

      if (!id_pedido) {
        res.status(400).json({ message: "ID do pedido é obrigatório" });
      }

      const produtos = await buscarProdutosDoPedidoService(id_pedido);
      res.status(200).json(produtos);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Erro ao buscar produtos do pedido", error });
    }
  }

  async alterarStatusPedidoFinalizado(req: Request, res: Response) {
    try {
      const { id_pedido, numero_nf } = req.body;

      if (!id_pedido || !numero_nf) {
        return res.status(400).json({ error: "Parâmetros inválidos" });
      }

      const result = await alterarStatusPedidoFinalizado(id_pedido, numero_nf);

      if (result) {
        res.status(200).json({ message: "Status alterado com sucesso" });
      } else {
        res.status(404).json({ error: "Erro ao atualizar dados do pedido" });
      }
    } catch (error) {
      console.error("Erro ao alterar status do pedido:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async alterarStatusPedidoComprado(req: Request, res: Response) {
    try {
      const { id_pedido, data_nf } = req.body;
      
      const result = await alterarStatusPedidoComprado(id_pedido, data_nf);
      
      if (result) {
        res.status(200).json({ message: "Status alterado com sucesso" });
      } else {
        res.status(400).json({ error: "Erro ao atualizar dados do pedido" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async alterarStatusPedidoCancelado(req: Request, res: Response) {
    try {
      const { id_pedido } = req.body;
      
      const result = await alterarStatusPedidoCancelado(id_pedido);
      
      if (result) {
        res.status(200).json({ message: "Status alterado com sucesso" });
      } else {
        res.status(400).json({ error: "Erro ao atualizar dados do pedido" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}

export default new UtilsController();
