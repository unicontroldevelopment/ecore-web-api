import { Router } from "express";
import EmployeeController from "./controllers/EmployeeController";

const routes = Router();

routes.post("/login", EmployeeController.login);
routes.post("/user", EmployeeController.create);
routes.get("/list", EmployeeController.getAllUsers);
routes.get("/employee/:id", EmployeeController.getById);
routes.delete("/employee/:id", EmployeeController.delete);
routes.put("/employee/:id", EmployeeController.update)

//routes.use(authMiddlewares);

export default routes;
