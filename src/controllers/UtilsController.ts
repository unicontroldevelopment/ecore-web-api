import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import prisma from "../database/prisma";
import {
  alterarStatusPedidoCancelado,
  alterarStatusPedidoComprado,
  alterarStatusPedidoFinalizado,
  buscaCepService,
  buscaHorasTrabalhadasRHService,
  buscarPedidosService,
  buscarProdutosDoPedidoService,
  converteValorExtenso,
} from "../services/UtilsService";
const nodemailer = require("nodemailer");

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
  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email é obrigatório" });
    }

    const user = await prisma.employeesInfo.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

        const resetToken = jwt.sign({ email }, process.env.JWT_SECRET as string, {
          expiresIn: "1h",
        });
    
        await prisma.employeesInfo.update({
          where: { email },
          data: { resetToken },
        });

    const transporter = nodemailer.createTransport({
      host: "mail.unicontrol.net.br",
      port: 465,
      secure: true,
      auth: {
        user: process.env.LOGIN_RESETPASSWORD,
        pass: process.env.PASSWORD_RESETPASSWORD,
      },
    });

    const mailOptions = {
      from: "informatica@unicontrol.com.br",
      to: email,
      subject: `Recuperação de senha`,
      html: `
        <div style="width: 75%; background-color: white; padding: 24px;">
          <h1 style="font-size: 24px; font-weight: bold;">Recuperação de Senha</h1>
          <p>Olá,</p>
          <p>Recebemos uma solicitação para redefinir a senha da sua conta. Se você fez essa solicitação, clique no link abaixo para redefinir sua senha:</p>
          <a href="http://localhost:3001/reset-password/${resetToken}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Redefinir Senha</a>
          <p>Se você não solicitou a redefinição de senha, por favor ignore este e-mail.</p>
          <p>Atenciosamente,</p>
          <p>Equipe de suporte do Ecore Web 2.0</p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("E-mail enviado com sucesso.");
      return res.status(200).json({
        message: `E-mail enviado para ${email} com instruções para resetar sua senha`,
      });
    } catch (error) {
      console.error("Erro ao enviar o e-mail:", error);
    }
  }
}

export default new UtilsController();
