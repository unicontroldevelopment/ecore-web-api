import { Users } from "@prisma/client";

interface UserCustom extends Users {}
declare global {
  namespace Express {
    export interface Request {
      user: Partial<UsuarioCustom>;
      imageId?: number;
      driver?: Partial<Motorista>;
      company_id?: number;
    }
  }
}
