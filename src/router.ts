import { Router } from "express";
import EmployeeController from "./controllers/EmployeeController";
import authMiddlewares from "./middlewares/auth";

const routes = Router();

routes.post("/login", EmployeeController.login);
routes.post("/user", EmployeeController.create);

routes.use(authMiddlewares);

export default routes;
