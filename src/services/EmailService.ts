import { Emails } from "@prisma/client";
import prisma from "../database/prisma";

type EmailsUpdateInput = Partial<
  Omit<Emails, "id" | "created" | "updated">
>;
class EmailService {
  async getById(id: number) {
    const user = await prisma.emails.findUnique({
      where: { id },
    });

    return user;
  }
  async getAllEmails(email?: string) {
    const users = await prisma.emails.findMany({
      where: {
        AND: [
          {
            email: {
              contains: email ? email : "",
            },
          },
        ],
      },
      orderBy: {
        email: "asc",
      },
      select: {
        email: true,
        Redirects: {
          select: {
            id: true,
            email_id: true,
          },
        },
      },
    });

    return users;
  }
  async create(
    type: string,
    email: string,
    password: string,
  ) {
    const userAlreadyExists = await prisma.emails.findUnique({
      where: { email },
    });

    if (userAlreadyExists) {
      throw new Error("E-mail já existe!");
    }

    const user = await prisma.emails.create({
      data: {
        email,
        password,
        type,
      },
    });

    return user;
  }
  async delete(id: number) {
    const user = await prisma.emails.delete({
      where: { id },
    });

    return user;
  }
  async update(id: number, updateData: EmailsUpdateInput) {
    const user = await prisma.emails.update({
      where: {
        id: id,
      },
      data: updateData,
    });

    return user;
  }
}

export default new EmailService();
