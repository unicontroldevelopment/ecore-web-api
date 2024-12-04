import prisma from "../database/prisma";
import { savePdfDraft, updatePdfDraft } from "./FileService";

class DraftsService {
  async createDraft(contractId: number, title: string, value: string, dateString: Date, file: Express.Multer.File) {
    const date = new Date(dateString);
    const draft = await prisma.drafts.create({
      data: {
        contractId,
        title,
        date,
        value,
      },
    });

    const savedFile = await savePdfDraft(draft.id, file);

    return { draft: { ...draft, DraftFile: savedFile } };
  }

  async getDraftsByContractId(contractId: number) {
    return prisma.drafts.findMany({
      where: { contractId },
      include: { DraftFile: true }
    });
  }

  async getDraftById(id: number) {
    return prisma.drafts.findUnique({
      where: { id },
      include: { DraftFile: true }
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
      include: { DraftFile: true }
    });

    if (file) {
      const savedFile = await updatePdfDraft(updatedDraft.id, file);
      return { draft: { ...updatedDraft, DraftFile: savedFile } };
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