import { ServerAccess } from "@prisma/client";
import prisma from "../database/prisma";

type ServerAccessUpdateInput = Partial<Omit<ServerAccess, 'id' | 'created' | 'updated'>>;
class ServerAccessService {
  async getById(id: number) {
    const user = await prisma.serverAccess.findUnique({
      where: { id },
    });

    return user;
  }
  async getAllUsers() {
    const users = await prisma.serverAccess.findMany()

    return users;
  }
    async create(
        fitolog:           boolean,
        commercial:        boolean,
        administrative:    boolean,
        humanResources:    boolean,
        technician:        boolean,
        newsis:            boolean,
        marketing:         boolean,
        projects:          boolean,
        managementControl: boolean,
        trainings:         boolean,
        it:                boolean,
        temp:              boolean,
        franchises:       boolean,
        employeeId:     number,
    ) {

      
          const userAlreadyExists = await prisma.serverAccess.findFirst({
            where: { employeeId },
          });
      
          if (userAlreadyExists) {
            throw new Error("Usuário já existe!");
          }
      
          const user = await prisma.serverAccess.create({
            data: { 
                fitolog,
                commercial,
                administrative,
                humanResources,
                technician,
                newsis,
                marketing,
                projects,
                managementControl,
                trainings,
                it,
                temp,
                franchises,
                employeeId,
            },
          });
      
          return user;
    }
    async delete(id: number) {
      const user = await prisma.serverAccess.delete({
        where: { id },
      });
  
      return user;
    }
    async update(id: number, updateData: ServerAccessUpdateInput) {
      const user = await prisma.serverAccess.update({
        where: {
          id: id,
        },
        data: updateData,
      })
  
      return user;
    }
}

export default new ServerAccessService();