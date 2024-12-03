import { Request, Response } from "express";
import DraftsService from "../services/DraftsService";

class DraftsController {
  async createDraft(req: Request, res: Response) {
    try {
      const { contractId, title, value, date } = req.body;
      
      const { file } = req;  

      if (!file) {
        return res.status(400).json({ message: "Arquivo não fornecido" });
      }

      const result = await DraftsService.createDraft(parseInt(contractId), title, value, date, file);

      return res.status(201).json({
        draft: result.draft,
        message: "Minuta criada com sucesso!"
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Erro interno do servidor", error });
    }
  }

  async getDraftsByContractId(req: Request, res: Response) {
    try {
      const { contractId } = req.params;
      const drafts = await DraftsService.getDraftsByContractId(parseInt(contractId));
      return res.status(200).json(drafts);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Erro interno do servidor", error });
    }
  }

  async getDraftById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const draft = await DraftsService.getDraftById(parseInt(id));
      if (!draft) {
        return res.status(404).json({ message: "Minuta não encontrada" });
      }

      return res.status(200).json(draft);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Erro interno do servidor", error });
    }
  }

  async updateDraft(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, value, date} = req.body;
      const file = req.file;

      const result = await DraftsService.updateDraft(parseInt(id), title, value, date, file);

      return res.status(200).json({
        draft: result.draft,
        message: "Minuta atualizada com sucesso!"
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Erro interno do servidor", error });
    }
  }

  async deleteDraft(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      await DraftsService.deleteDraft(parseInt(id));
      return res.status(200).json({ message: "Minuta excluída com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Erro interno do servidor", error });
    }
  }
}

export default new DraftsController();