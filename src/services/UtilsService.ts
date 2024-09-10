import { Request, Response } from "express";
import { QueryError, RowDataPacket } from "mysql2";
import { db_agc } from "../database/db_agc";
import prisma from "../database/prisma";

const busca_cep = require("busca-cep");

const numero_extenso = require("numero-por-extenso");

export const converteValorExtensoHandler = (
  req: Request,
  res: Response
): void => {
  const { valor } = req.body;
  res.json(
    numero_extenso.porExtenso(
      valor.split(".").join("").split(",").join("."),
      numero_extenso.estilo.monetario
    )
  );
};

export const uploadPdf = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const idInt = parseInt(id);
    const { file } = req;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const savedFile = await prisma.propouse.create({
      data: {
        contract_id: idInt,
        file: file.buffer,
        fileName: file.originalname,
      },
    });

    res.status(201).json(savedFile);
  } catch (error) {
    console.error("Error saving file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const uploadAdditivePdf = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const idInt = parseInt(id);
    const { file } = req;
    

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const savedFile = await prisma.propouseAdditive.create({
      data: {
        additive_id: idInt,
        file: file.buffer,
        fileName: file.originalname,
      },
    });

    res.status(201).json(savedFile);
  } catch (error) {
    console.error("Error saving file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

//Busca CEP
export const buscaCep = async (req: Request, res: Response) => {
  const { cep } = req.body;
  if (cep.length < 9) {
    res.json(false);
  } else { 
    busca_cep(cep)
      .then((endereco: string) => {  
        res.json(endereco);
      })
      .catch((error: Error) => {
        res.json(error);
      });
  }
};

export const updatePdf = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const idInt = parseInt(id);
    const { file } = req;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const updatedOrCreatedFile = await prisma.propouse.upsert({
      where: { contract_id: idInt },
      update: {
        file: file.buffer,
        fileName: file.originalname,
      },
      create: {
        contract_id: idInt,
        file: file.buffer,
        fileName: file.originalname,
      },
    });

    res.status(200).json(updatedOrCreatedFile);
  } catch (error) {
    console.error("Error updating or creating file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateAdditivePdf = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const idInt = parseInt(id);
    const { file } = req;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const updatedOrCreatedFile = await prisma.propouseAdditive.upsert({
      where: { additive_id: idInt },
      update: {
        file: file.buffer,
        fileName: file.originalname,
      },
      create: {
        additive_id: idInt,
        file: file.buffer,
        fileName: file.originalname,
      },
    });

    res.status(200).json(updatedOrCreatedFile);
  } catch (error) {
    console.error("Error updating or creating file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const buscaHorasTrabalhadasRH = async (req: Request, res: Response) => {
  const { date_ini, date_fim } = req.body;

  let SQL = `SELECT l.cod_lau,l.cod_cli,l.ini_lau,l.fim_lau,l.cod_fun,a.nom_adm,c.razao_social FROM laudo AS l,administrador AS a,cliente AS c WHERE l.fim_lau BETWEEN '${date_ini}-01' AND '${date_fim}-31' AND l.cod_cli IN(40233,81344,30290,40442,40440,14492,492,41366,60070,82734,82379) AND a.cod_adm = l.cod_fun AND l.cod_cli = c.cod_cli and l.ini_lau is not null and l.fim_lau is not null UNION ALL SELECT lr.cod_lau,lr.cli_lau,lr.hora_inicio,lr.hora_fim,lr.fun_lau,a.nom_adm,c.razao_social FROM laudo_reservatorio AS lr,administrador AS a,cliente AS c WHERE lr.dat_lau BETWEEN '${date_ini}-01' AND '${date_fim}-31' AND lr.cli_lau IN(40233,81344,30290,40442,40440,14492,492,41366,60070,82734,82379) AND a.cod_adm = lr.fun_lau AND c.cod_cli = lr.cli_lau and lr.hora_inicio is not null and lr.hora_fim is not null ORDER BY nom_adm ASC, ini_lau DESC`;
  db_agc.query(SQL, (err: QueryError | null, result: RowDataPacket[] | null) => {
    if (err) {
      console.error(err);
      res.status(500).send({ error: "Erro ao buscar horas trabalhadas." });
    } else {
      res.send(result);
    }
  });
};