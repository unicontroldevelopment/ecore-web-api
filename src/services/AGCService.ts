import { QueryError, RowDataPacket } from "mysql2";
import { db_agc } from "../database/db_agc";

class AGCService {
  async buscaInsumosService(): Promise<RowDataPacket[]> {
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
  }

  async buscaInsumosMoviemntacao(): Promise<RowDataPacket[]> {
    return new Promise((resolve, reject) => {
      let SQL = `SELECT insumo_movimentacao.*, insumo.nom_ins AS nome_insumo, administrador.nom_adm AS nome_operador, 
        CASE 
            WHEN insumo_movimentacao.tipo = 1 THEN 'Entrada Estoque'
            WHEN insumo_movimentacao.tipo = 2 THEN 'Saída Estoque'
            WHEN insumo_movimentacao.tipo = 3 THEN 'Entrada Operador'
            WHEN insumo_movimentacao.tipo = 4 THEN 'Saída Operador'
            WHEN insumo_movimentacao.tipo = 5 THEN 'Cadastro'
            ELSE 'Tipo Desconhecido'
        END AS descricao_tipo
            FROM insumo_movimentacao 
                LEFT JOIN insumo ON insumo_movimentacao.cod_ins = insumo.cod_ins 
                LEFT JOIN administrador ON insumo_movimentacao.cod_adm = administrador.cod_adm 
                    WHERE insumo_movimentacao.agc_franqueado = 0 AND administrador.repasse = 0;`;

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
  }
}

export default new AGCService();
