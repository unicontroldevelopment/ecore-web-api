import { Router } from "express";
import EmailController from "./controllers/EmailController";
import EmployeeController from "./controllers/EmployeeController";
import ServerAccessController from "./controllers/ServerAccessController";

const routes = Router();

routes.post("/login", EmployeeController.login);
//routes.use(authMiddlewares);
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

routes.post("/email", EmailController.create);
routes.get("/emails", EmailController.getAll);
routes.get("/email/:id", EmailController.getById);
routes.delete("/email/:id", EmailController.delete);
routes.put("/email/:id", EmailController.update)

export default routes;
