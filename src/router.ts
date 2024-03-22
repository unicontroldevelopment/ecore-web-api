import { Router } from "express";
import EmployeeController from "./controllers/EmployeeController";
import ServerAccessController from "./controllers/ServerAccessController";

const routes = Router();

routes.post("/login", EmployeeController.login);
routes.post("/employee", EmployeeController.create);
routes.get("/employees", EmployeeController.getAllUsers);
routes.get("/employee/:id", EmployeeController.getById);
routes.delete("/employee/:id", EmployeeController.delete);
routes.put("/employee/:id", EmployeeController.update)

routes.post("/serverAccess", ServerAccessController.create);
routes.get("/serverAccessGetAll", ServerAccessController.getAllUsers);
routes.get("/serverAccess/:id", ServerAccessController.getById);
routes.delete("/serverAccess/:id", ServerAccessController.delete);
routes.put("/serverAccess/:id", ServerAccessController.update)

//routes.use(authMiddlewares);

export default routes;
