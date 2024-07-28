import prisma from "../database/prisma";

interface LogEntryData {
    action: 'IN' | 'OUT';
    itemId: number;
    userId: number;
    quantity: number;
    unit: string;
    itemType: 'product' | 'uniform';
  }
  
  async function createLogEntry({ action, itemId, userId, quantity, unit, itemType }: LogEntryData) {
    return prisma.logEntry.create({
      data: {
        action,
        itemId,
        userId,
        quantity,
        unit,
        itemType,
      },
    });
  }
  
  // Função para adicionar/remover produtos e uniformes
  export async function addItem(itemType: 'product' | 'uniform', itemId: number, userId: number, quantity: number, unit: string) {
    if (itemType === 'product') {
      const product = await prisma.product.update({
        where: { id: itemId },
        data: { quantity: { increment: quantity } },
      });
      await createLogEntry({ action: 'IN', itemId: product.id, userId, quantity, unit, itemType });
      return product;
    } else {
      const uniform = await prisma.uniform.update({
        where: { id: itemId },
        data: { quantity: { increment: quantity } },
      });
      await createLogEntry({ action: 'IN', itemId: uniform.id, userId, quantity, unit, itemType });
      return uniform;
    }
  }
  
  export async function removeItem(itemType: 'product' | 'uniform', itemId: number, userId: number, quantity: number, unit: string) {
    if (itemType === 'product') {
      const product = await prisma.product.update({
        where: { id: itemId },
        data: { quantity: { decrement: quantity } },
      });
      await createLogEntry({ action: 'OUT', itemId: product.id, userId, quantity, unit, itemType });
      return product;
    } else {
      const uniform = await prisma.uniform.update({
        where: { id: itemId },
        data: { quantity: { decrement: quantity } },
      });
      await createLogEntry({ action: 'OUT', itemId: uniform.id, userId, quantity, unit, itemType });
      return uniform;
    }
  }