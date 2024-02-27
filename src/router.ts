import { Router } from "express";
import UserController from "./controllers/UserController";
import authMiddlewares from "./middlewares/auth";

const routes = Router();

routes.post("/login", UserController.login);
routes.post("/user", UserController.create);

routes.use(authMiddlewares);

export default routes;
