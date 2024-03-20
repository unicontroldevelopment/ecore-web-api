import { Request, Response } from "express";
import ServerAccessService from "../services/ServerAccessService";

class ServerAccessController {
  async create(req: Request, res: Response) {
    try {
      const {
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
      } = req.body;

      const response = await ServerAccessService.create(
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
        employeeId
      );

      return res.status(200).json({ response, message: "Acesso criado!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Internal Error", error });
    }
  }
}

export default new ServerAccessController();
