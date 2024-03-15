import { Router } from "express";
import EmployeeController from "./controllers/EmployeeController";
import authMiddlewares from "./middlewares/auth";

const routes = Router();

routes.post("/login", EmployeeController.login);
routes.post("/user", EmployeeController.create);
routes.get("/employee/:id", EmployeeController.getById);
routes.delete("/employee/:id", EmployeeController.delete);

routes.use(authMiddlewares);

export default routes;
