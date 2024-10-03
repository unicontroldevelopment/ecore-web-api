import { Emails, FormType } from "@prisma/client";
import prisma from "../database/prisma";
const nodemailer = require("nodemailer");

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
      include: {
        emails: true,
        users: {
          include: {
            user: true,
          },
        },
      },
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
  async getAllForms(type: FormType, userId?: number) {
    if (userId) {
      return await prisma.form.findMany({
        where: {
          users: {
            some: {
              userId: userId,
            },
          },
          type: {
            equals: type,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      return await prisma.form.findMany({
        where: {
          type: {
            equals: type,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }
  }
  async create(
    name: string,
    description: string,
    type: FormType,
    users: number[],
    emails: string[]
  ) {
    const userAlreadyExists = await prisma.form.findFirst({
      where: { name },
    });

    if (userAlreadyExists) {
      throw new Error("Formulário com esse nome já existe!");
    }

    const formData: any = {
      name,
      description,
      content: "",
      type,
    };
    if (emails.length > 0) {
      formData.users = {
        create: users.map((userId) => ({
          userId: userId,
        })),
      };
    }
    if (emails.length > 0) {
      formData.emails = {
        create: emails.map((email) => ({
          email,
        })),
      };
    }

    const user = await prisma.form.create({
      data: formData,
    });

    return user;
  }
  async delete(id: number) {
    const form = await prisma.form.delete({
      where: { id },
    });

    return form;
  }
  async updateProperties(id: number, formData: { name: string; description: string; type: FormType; users: number[]; emails: string[] }) {
    const { name, description, type, users, emails } = formData;
  
    const updatedForm = await prisma.$transaction(async (prisma) => {
      const form = await prisma.form.update({
        where: { id },
        data: {
          name,
          description,
          type,
        },
      });
  
      if (users && users.length > 0) {
        await prisma.formUser.deleteMany({
          where: { formId: id },
        });
        await prisma.formUser.createMany({
          data: users.map((userId) => ({
            formId: id,
            userId,
          })),
        });
      }
  
      if (emails && emails.length > 0) {
        await prisma.formEmail.deleteMany({
          where: { formId: id },
        });
        await prisma.formEmail.createMany({
          data: emails.map((email) => ({
            formId: id,
            email,
          })),
        });
      }
  
      return form;
    });
  
    return updatedForm;
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
            content
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
