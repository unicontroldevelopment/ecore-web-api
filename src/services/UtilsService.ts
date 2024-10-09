import { QueryError, RowDataPacket } from "mysql2";
import { db_agc } from "../database/db_agc";
const busca_cep = require("busca-cep");
const numero_extenso = require("numero-por-extenso");

export const buscaCepService = async (cep: string) => {
  if (cep.length < 9) {
    return false;
  } else {
    return busca_cep(cep);
  }
};

export const converteValorExtenso = (valor: string): string => {
  const valorConvertido = numero_extenso.porExtenso(
    valor.split(".").join("").split(",").join("."),
    numero_extenso.estilo.monetario
  );

  return valorConvertido;
};

export const buscaHorasTrabalhadasRHService = (
  date_ini: string,
  date_fim: string
): Promise<RowDataPacket[]> => {
  return new Promise((resolve, reject) => {
    let SQL = `
      SELECT l.cod_lau,l.cod_cli,l.ini_lau,l.fim_lau,l.cod_fun,a.nom_adm,c.razao_social
      FROM laudo AS l, administrador AS a, cliente AS c
      WHERE l.fim_lau BETWEEN '${date_ini}-01' AND '${date_fim}-31'
      AND l.cod_cli IN(40233,81344,30290,40442,40440,14492,492,41366,60070,82734,82379)
      AND a.cod_adm = l.cod_fun AND l.cod_cli = c.cod_cli
      AND l.ini_lau IS NOT NULL AND l.fim_lau IS NOT NULL
      UNION ALL
      SELECT lr.cod_lau, lr.cli_lau, lr.hora_inicio, lr.hora_fim, lr.fun_lau, a.nom_adm, c.razao_social
      FROM laudo_reservatorio AS lr, administrador AS a, cliente AS c
      WHERE lr.dat_lau BETWEEN '${date_ini}-01' AND '${date_fim}-31'
      AND lr.cli_lau IN(40233,81344,30290,40442,40440,14492,492,41366,60070,82734,82379)
      AND a.cod_adm = lr.fun_lau AND c.cod_cli = lr.cli_lau
      AND lr.hora_inicio IS NOT NULL AND lr.hora_fim IS NOT NULL
      ORDER BY nom_adm ASC, ini_lau DESC`;

    db_agc.query(
      SQL,
      (err: QueryError | null, result: RowDataPacket[] | null) => {
        if (err) {
          return reject(err);
        }

        if (!result) {
          return reject(new Error("Nenhum resultado encontrado."));
        }

        resolve(result);
      }
    );
  });
};

export const buscaInsumosService = (): Promise<RowDataPacket[]> => {
  return new Promise((resolve, reject) => {
    let SQL = `SELECT * FROM insumo WHERE ocultar = 0`;

    db_agc.query(
      SQL,
      (err: QueryError | null, result: RowDataPacket[] | null) => {
        if (err) {
          return reject(err);
        }

        if (!result) {
          return reject(new Error("Nenhum resultado encontrado."));
        }

        resolve(result);
      }
    );
  });
};
