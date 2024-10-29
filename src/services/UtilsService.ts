import {
  FieldPacket,
  QueryError,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2";
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

export const buscarPedidosService = (): Promise<RowDataPacket[]> => {
  return new Promise((resolve, reject) => {
    const SQL = `
      SELECT 
        s.id, 
        sta.nome_status, 
        data_solicitacao, 
        numero_nota_fiscal, 
        data_nota_fiscal, 
        adm.nom_adm AS nome, 
        agc.nom_agc AS franquia 
      FROM estoque_solicitacao_produtos AS s 
      INNER JOIN estoque_status AS sta ON sta.id = s.estoque_status_id 
      INNER JOIN administrador AS adm ON s.usuario_id = adm.cod_adm 
      INNER JOIN agc_franqueado AS agc ON agc.cod_agc = s.agc_franqueado 
      ORDER BY s.id DESC
    `;

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

export const buscarProdutosDoPedidoService = (
  id_pedido: number
): Promise<RowDataPacket[]> => {
  return new Promise((resolve, reject) => {
    const SQL = `
      SELECT itens.id, p.nome, itens.quantidade, itens.tipo_id, itens.solicitacao_id, p.unidade 
      FROM estoque_solicitacao_produtos_itens AS itens, estoque_interno_produto AS p 
      WHERE p.id = itens.produto_id AND itens.tipo_id = 2 AND itens.solicitacao_id = ? 
      UNION ALL 
      SELECT itens.id, u.nome, itens.quantidade, itens.tipo_id, itens.solicitacao_id, u.tamanho 
      FROM estoque_solicitacao_produtos_itens AS itens, estoque_interno_uniforme_epi AS u 
      WHERE u.id = itens.produto_id AND itens.tipo_id = 1 AND itens.solicitacao_id = ? 
      ORDER BY tipo_id, nome ASC
    `;

    db_agc.query<RowDataPacket[]>(
      SQL,
      [id_pedido, id_pedido],
      (
        err: QueryError | null,
        result: RowDataPacket[],
        fields: FieldPacket[]
      ) => {
        if (err) {
          return reject(err);
        }

        if (!result || result.length === 0) {
          return reject(new Error("Nenhum resultado encontrado."));
        }

        resolve(result);
      }
    );
  });
};

export const alterarStatusPedidoFinalizado = (
  id_pedido: number,
  numero_nf: string
): Promise<ResultSetHeader> => {
  return new Promise((resolve, reject) => {
    const id_status = 3;
    const SQL = `UPDATE estoque_solicitacao_produtos SET estoque_status_id = ?, numero_nota_fiscal = ? WHERE id = ?`;

    db_agc.query<ResultSetHeader>(
      SQL,
      [id_status, numero_nf, id_pedido],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          console.log("Resultado:", result);
          resolve(result);
        }
      }
    );
  });
};

export const alterarStatusPedidoComprado = (
  id_pedido: number,
  data_nf: string
): Promise<ResultSetHeader> => {
  return new Promise((resolve, reject) => {
    const id_status = 2;
    const SQL = `UPDATE estoque_solicitacao_produtos SET estoque_status_id = ?, data_nota_fiscal = ? WHERE id = ?`;

    db_agc.query<ResultSetHeader>(
      SQL,
      [id_status, data_nf, id_pedido],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

export const alterarStatusPedidoCancelado = (id_pedido: number) => {
  return new Promise((resolve, reject) => {
    const id_status = 4;

    const SQL = `UPDATE estoque_solicitacao_produtos SET estoque_status_id = ? WHERE id = ?`;

    db_agc.query<ResultSetHeader>(
      SQL,
      [id_status, id_pedido],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};
