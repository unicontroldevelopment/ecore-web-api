import { Request, Response } from "express";
import {
    saveAdditivePdf,
    savePdf,
    updateOrCreateAdditivePdf,
    updateOrCreatePdf,
} from "../services/FileService";

class FileController {
  async uploadPdf(req: Request, res: Response) {
    try {
      const { id } = req.body;
      const idInt = parseInt(id);
      const { file } = req;

      if (!file) {
        return res.status(400).json({ message: "Sem arquivo!" });
      }

      const savedFile = await savePdf(idInt, file);
      res.status(201).json(savedFile);
    } catch (error) {
      console.error("Erro ao salvar arquivo:", error);
      res.status(500).json({ message: "Erro interno" });
    }
  }
  async uploadAdditivePdf(req: Request, res: Response) {
    try {
      const { id } = req.body;
      const idInt = parseInt(id);
      const { file } = req;

      if (!file) {
        return res.status(400).json({ message: "Sem arquivo!" });
      }

      const savedFile = await saveAdditivePdf(idInt, file);
      res.status(201).json(savedFile);
    } catch (error) {
      console.error("Erro ao salvar arquivo:", error);
      res.status(500).json({ message: "Erro iterno" });
    }
  }
  async updatePdf(req: Request, res: Response) {
    try {
      const { id } = req.body;
      const idInt = parseInt(id);
      const { file } = req;

      if (!file) {
        return res.status(400).json({ message: "Sem arquivo!" });
      }

      const updatedOrCreatedFile = await updateOrCreatePdf(idInt, file);
      res.status(200).json(updatedOrCreatedFile);
    } catch (error) {
      console.error("Erro ao atualizar ou criar arquivo:", error);
      res.status(500).json({ message: "Erro interno" });
    }
  }
  async updateAdditivePdf(req: Request, res: Response) {
    try {
      const { id } = req.body;
      const idInt = parseInt(id);
      const { file } = req;

      if (!file) {
        return res.status(400).json({ message: "Sem arquivo para atualizar!" });
      }

      const updatedOrCreatedFile = await updateOrCreateAdditivePdf(idInt, file);
      res.status(200).json(updatedOrCreatedFile);
    } catch (error) {
      console.error("Erro ao atualizar documento:", error);
      res.status(500).json({ message: "Erro interno" });
    }
  }
}

export default new FileController();
