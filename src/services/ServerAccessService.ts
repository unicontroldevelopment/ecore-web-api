import prisma from "../database/prisma";

class ServerAccessService {
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
}

export default new ServerAccessService();