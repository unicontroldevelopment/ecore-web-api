import { Emails } from "@prisma/client";
import prisma from "../database/prisma";

type EmailsUpdateInput = Partial<Omit<Emails, "id" | "created" | "updated">>;

interface RedirectsInput {
  id: string;
  email: string;
  email_id: string;
}
class FormService {
  async getById(id: number) {
    const form = await prisma.form.findUnique({
      where: { id },
    });

    return form;
  }
  async getByUrl(url: string) {
    const form = await prisma.form.update({
      select: {
        content: true,
      },
      data: {
        visits: {
          increment: 1,
        },
      },
      where: {
        shareUrl: url,
      },
    });

    return form;
  }
  async getAllForms() {
    const forms = await prisma.form.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return forms;
  }
  async create(name: string, description: string) {
    const userAlreadyExists = await prisma.form.findFirst({
      where: { name },
    });

    if (userAlreadyExists) {
      throw new Error("Formulário com esse nome já existe!");
    }

    const user = await prisma.form.create({
      data: {
        name,
        description,
        content: "",
      },
    });

    return user;
  }
  async delete(id: number) {
    const form = await prisma.form.delete({
      where: { id },
    });

    return form;
  }
  async update(
    id: number,
    updateData: EmailsUpdateInput,
    Redirects: RedirectsInput[]
  ) {
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
  async updateContent(id: number, contentData: string) {
    const user = await prisma.form.update({
      where: {
        id: id,
      },
      data: {
        content: contentData,
      },
    });

    return user;
  }
  async publishForm(id: number) {
    const user = await prisma.form.update({
      data: {
        published: true,
      },
      where: {
        id,
      },
    });

    return user;
  }
  async submitForm(url: string, content: string, name: string) {
    const form = await prisma.form.update({
      data: {
        submissions: {
          increment: 1,
        },
        FormSubmissions: {
          create: {
            sendBy: name,
            content,
          },
        },
      },
      where: {
        shareUrl: url,
        published: true,
      },
    });

    return form;
  }
  async getSubmissions(id: number) {
    const form = await prisma.form.findUnique({
      where: {
        id,
      },
      include: {
        FormSubmissions: true,
      },
    });

    return form;
  }
}

export default new FormService();
