import { Emails } from "@prisma/client";
import prisma from "../database/prisma";

type EmailsUpdateInput = Partial<
  Omit<Emails, "id" | "created" | "updated">
>;

interface RedirectsInput {
  id: string,
  email: string
  email_id: string
}
class EmailService {
  async getById(id: number) {
    const user = await prisma.emails.findUnique({
      where: { id },
    });

    return user;
  }
  async getAllEmails(type?: string) {
    const users = await prisma.emails.findMany({
      where: {
        AND: [
          {
            type: {
              contains: type ? type : "",
            },
          },
        ],
      },
      orderBy: {
        email: "asc",
      },
      select: {
        id: true,
        email: true,
        type: true,
        password: true,
        Redirects: {
          select: {
            id: true,
            email_id: true,
            email: true,
          },
        },
      },
    });

    return users;
  }
  async create(
    email: string,
    type: string,
    password: string,
    redirects: RedirectsInput[]
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
        type,
        password,
        Redirects: {
          create: redirects.map(({ email }) => ({
            email,
          })),
        },
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
  async update(id: number, updateData: EmailsUpdateInput, Redirects: RedirectsInput[]) {
    const user = await prisma.emails.update({
      where: {
        id: id,
      },
      data: updateData,
    });

    if (Redirects && Redirects.length > 0) {
      await prisma.redirects.deleteMany({ where: { email_id: id } });
  
      for (const redirect of Redirects) {
        await prisma.redirects.create({
          data: {
            email: redirect.email,
            email_id: id,
          },
        });
      }
    }

    return user;
  }
}

export default new EmailService();
