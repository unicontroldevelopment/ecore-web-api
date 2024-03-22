import { Router } from "express";
import EmployeeController from "./controllers/EmployeeController";
import ServerAccessController from "./controllers/ServerAccessController";
import authMiddlewares from "./middlewares/auth";

const routes = Router();

routes.post("/login", EmployeeController.login);
routes.use(authMiddlewares);
routes.post("/employee", EmployeeController.create);
routes.get("/employees", EmployeeController.getAll);
routes.get("/employee/:id", EmployeeController.getById);
routes.delete("/employee/:id", EmployeeController.delete);
routes.put("/employee/:id", EmployeeController.update)

routes.post("/serverAccess", ServerAccessController.create);
routes.get("/serverAccessGetAll", ServerAccessController.getAllUsers);
routes.get("/serverAccess/:id", ServerAccessController.getById);
routes.delete("/serverAccess/:id", ServerAccessController.delete);
routes.put("/serverAccess/:id", ServerAccessController.update)

export default routes;
