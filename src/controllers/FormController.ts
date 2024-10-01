import { FormType } from "@prisma/client";
import { Request, Response } from "express";
import prisma from "../database/prisma";
import EmailService from "../services/EmailService";
import FormService from "../services/FormService";

class FormController {
  async create(req: Request, res: Response) {
    try {
      const { data } = req.body;

      const { name, description, type, users, emails } = data;

      const form = await FormService.create(
        name,
        description,
        type,
        users,
        emails
      );

      return res
        .status(201)
        .json({ form, message: "Formulário criado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const formId = parseInt(req.params.id);

      const existedform = await prisma.form.findUnique({
        where: { id: formId },
      });

      if (!existedform) {
        return res.status(500).json({ message: "Formulário não encontrado!" });
      }

      const form = await FormService.getById(formId);

      return res.status(200).json({ form, message: "Formulário encontrado." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }

  async getByUrl(req: Request, res: Response) {
    try {
      const formUrl = req.params.id;

      const existedform = await prisma.form.findUnique({
        where: { shareUrl: formUrl },
      });

      if (!existedform) {
        return res.status(500).json({ message: "Formulário não encontrado!" });
      }

      const form = await FormService.getByUrl(formUrl);

      return res.status(200).json({ form, message: "Formulário encontrado." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const formId = parseInt(req.params.id);

      const existedForm = await prisma.form.findUnique({
        where: { id: formId },
      });

      if (!existedForm) {
        return res.status(500).json({ message: "Formulário não encontrado!" });
      }

      const form = await FormService.delete(formId);

      return res
        .status(200)
        .json({ form, message: "Formulário deletado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);

      const existedUser = await prisma.emails.findUnique({
        where: { id: userId },
      });

      if (!existedUser) {
        return res.status(500).json({ message: "E-mail não encontrado!" });
      }

      const updateData = await req.body;
      const { Redirects, ...emailData } = updateData;

      const updatedUser = await EmailService.update(
        userId,
        emailData,
        Redirects
      );

      return res
        .status(200)
        .json({ updatedUser, message: "E-mail atualizado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }
  
  async updateProperties(req: Request, res: Response) {
    try {
      const formId = parseInt(req.params.id);

      const existedForm = await prisma.form.findUnique({
        where: { id: formId },
      });

      if (!existedForm) {
        return res.status(500).json({ message: "Formulário não encontrado!" });
      }

      const { name, description, type, users, emails } = await req.body;
      

      const form = await FormService.updateProperties(formId, {
        name,
        description,
        type,
        users,
        emails,
      });

      return res.status(200).json({
        form,
        message: "Propriedades do formulário atualizado com sucesso!",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }

  async updateContent(req: Request, res: Response) {
    try {
      const formId = parseInt(req.params.id);

      const existedForm = await prisma.form.findUnique({
        where: { id: formId },
      });

      if (!existedForm) {
        return res.status(500).json({ message: "Formulário não encontrado!" });
      }

      const contentData = await req.body;
      const jsonElements = JSON.stringify(contentData);

      const form = await FormService.updateContent(formId, jsonElements);

      return res.status(200).json({
        form,
        message: "Conteudo do formulário atualizado com sucesso!",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }

  async publishForm(req: Request, res: Response) {
    try {
      const formId = parseInt(req.params.id);

      const existedForm = await prisma.form.findUnique({
        where: { id: formId },
      });

      if (!existedForm) {
        return res.status(500).json({ message: "Formulário não encontrado!" });
      }

      const form = await FormService.publishForm(formId);

      return res
        .status(200)
        .json({ form, message: "Formulário publicado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }

  async submitForm(req: Request, res: Response) {
    try {
      const formUrl = req.params.id;

      const { contentData, name } = await req.body;

      const jsonElements = JSON.stringify(contentData);

      const existedForm = await prisma.form.findUnique({
        where: { shareUrl: formUrl },
      });

      if (!existedForm) {
        return res.status(500).json({ message: "Formulário não encontrado!" });
      }

      const form = await FormService.submitForm(formUrl, jsonElements, name);

      return res
        .status(200)
        .json({ form, message: "Formulário enviado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const { formId, type } = req.query;
      
      const intId = formId ? parseInt(formId.toString(), 10) : undefined;

      const listForms = await FormService.getAllForms(type?.toString() as FormType, intId)

      if (!listForms) {
        return res.status(500).json({ message: "Não há formulários!" });
      }

      return res
        .status(200)
        .json({ listForms, message: "Formulários listados com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }

  async getSubmissions(req: Request, res: Response) {
    try {
      const formId = parseInt(req.params.id);

      const form = await FormService.getSubmissions(formId);

      if (!form) {
        return res.status(500).json({ message: "Não ha formulário nesse ID!" });
      }

      return res.status(200).json({ form, message: "Formulário localizado!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }
}

export default new FormController();
