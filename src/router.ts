import { Router } from "express";
import DocumentsController from "./controllers/DocumentsController";
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
routes.post("/employeeInfo", EmployeeController.createInfo);
routes.get("/employeesInfo", EmployeeController.getAllInfo);
routes.get("/employeeInfo/:id", EmployeeController.getByIdInfo);
routes.delete("/employeeInfo/:id", EmployeeController.deleteInfo);
routes.put("/employeeInfo/:id", EmployeeController.updateInfo)

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

routes.post("/service", DocumentsController.createService);
routes.get("/services",  DocumentsController.getServices);
routes.delete("/service/:id",  DocumentsController.deleteService);
routes.put("/service/:id",  DocumentsController.updateService);

routes.post("/contract", DocumentsController.createContract);
routes.get("/contracts",  DocumentsController.getContracts);
routes.delete("/contract/:id",  DocumentsController.deleteContract);
routes.put("/contract/:id",  DocumentsController.updateContract);

export default routes;
