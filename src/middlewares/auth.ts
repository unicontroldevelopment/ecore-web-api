import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import prisma from "../database/prisma";
import IUser from "../interfaces/IUser";

type JwtPayload = {
  id: number;
};

declare module "express" {
  export interface Request {
    user?: Partial<IUser>;
  }
}

export default async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: "Por favor, logue-se antes." });
  }

  const token = authorization.split(" ")[1];

  try {
    const { id } = verify(token, process.env.JWT_KEY ?? "") as JwtPayload;

    const user = await prisma.employeesInfo.findUnique({
      where: { id },
    });

    if (user) {
      const { password: _, ...loggedUser } = user;
      return next();
    }
  } catch (err) {
    return res.status(404).json({ message: "Usuário não autorizado!" });
  }
};
