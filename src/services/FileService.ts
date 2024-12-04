import prisma from "../database/prisma";

export const savePdf = async (
  contractId: number,
  file: Express.Multer.File
) => {
  const savedFile = await prisma.propouse.create({
    data: {
      contract_id: contractId,
      file: file.buffer,
      fileName: file.originalname,
    },
  });
  return savedFile;
};

export const savePdfDraft = async (
  contractId: number,
  file: Express.Multer.File
) => {
  const savedFile = await prisma.draftFile.create({
    data: {
      draftId: contractId,
      file: file.buffer,
      fileName: file.originalname,
    },
  });
  return savedFile;
};

export const saveAdditivePdf = async (
  additiveId: number,
  file: Express.Multer.File
) => {
  const savedFile = await prisma.propouseAdditive.create({
    data: {
      additive_id: additiveId,
      file: file.buffer,
      fileName: file.originalname,
    },
  });
  return savedFile;
};

export async function updatePdfDraft(draftId: number, file: Express.Multer.File) {
  const existingFile = await prisma.draftFile.findFirst({
    where: { draftId: draftId }
  });

  if (existingFile) {
    return prisma.draftFile.update({
      where: { id: existingFile.id },
      data: {
        file: file.buffer,
        fileName: file.originalname,
      }
    });
  } else {
    return prisma.draftFile.create({
      data: {
        draftId: draftId,
        file: file.buffer,
        fileName: file.originalname,
      }
    });
  }
}

export const updateOrCreatePdf = async (
  contractId: number,
  file: Express.Multer.File
) => {
  const updatedOrCreatedFile = await prisma.propouse.upsert({
    where: { contract_id: contractId },
    update: {
      file: file.buffer,
      fileName: file.originalname,
    },
    create: {
      contract_id: contractId,
      file: file.buffer,
      fileName: file.originalname,
    },
  });
  return updatedOrCreatedFile;
};

export const updateOrCreateAdditivePdf = async (
  additiveId: number,
  file: Express.Multer.File
) => {
  const updatedOrCreatedFile = await prisma.propouseAdditive.upsert({
    where: { additive_id: additiveId },
    update: {
      file: file.buffer,
      fileName: file.originalname,
    },
    create: {
      additive_id: additiveId,
      file: file.buffer,
      fileName: file.originalname,
    },
  });
  return updatedOrCreatedFile;
};
