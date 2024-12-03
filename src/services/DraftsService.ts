import prisma from "../database/prisma";
import { savePdfDraft, updatePdfDraft } from "./FileService";

class DraftsService {
  async createDraft(contract_id: number, title: string, value: string, dateString: Date, file: Express.Multer.File) {
    const date = new Date(dateString);
    const draft = await prisma.drafts.create({
      data: {
        contract_id,
        title,
        date,
        value,
      },
    });

    const savedFile = await savePdfDraft(draft.id, file);

    return { draft: { ...draft, draft_file: savedFile } };
  }

  async getDraftsByContractId(contract_id: number) {
    return prisma.drafts.findMany({
      where: { contract_id },
      include: { draft_file: true }
    });
  }

  async getDraftById(id: number) {
    return prisma.drafts.findUnique({
      where: { id },
      include: { draft_file: true }
    });
  }

  async updateDraft(id: number, title: string, value: string, dateString: Date, file?: Express.Multer.File) {
    const date = new Date(dateString);
    const updatedDraft = await prisma.drafts.update({
      where: { id },
      data: {
        title,
        value,
        date,
      },
      include: { draft_file: true }
    });

    if (file) {
      const savedFile = await updatePdfDraft(updatedDraft.id, file);
      return { draft: { ...updatedDraft, draft_file: savedFile } };
    }

    return { draft: updatedDraft };
  }

  async deleteDraft(id: number) {
    await prisma.drafts.delete({
      where: { id }
    });
  }
}

export default new DraftsService();