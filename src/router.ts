import { Router } from "express";
import AdditiveOrReajustmentController from "./controllers/AdditiveOrReajustmentController";
import ContractSignatureController from "./controllers/ContractSignatureController";
import DocumentsController from "./controllers/DocumentsController";
import EmailController from "./controllers/EmailController";
import EmployeeController from "./controllers/EmployeeController";
import ProductController from "./controllers/ProductController";
import ServerAccessController from "./controllers/ServerAccessController";
import UniformController from "./controllers/UniformController";
import {
  buscarDocumentosDoCofre,
  buscarDocumentosDoCofrePorId,
  cadastrarAssinaturaNoDocumento,
  cadastrarDocumento,
  cancelarDocumento,
  downloadDeDocumento,
  enviarDocumentoParaAssinar,
  listaDocumentoStatus,
  listarDocumentos,
  listarSignatariosDeDocumento,
  reenviarDocumentoParaAssinar,
  removerAssinaturaDoDocumento,
} from "./services/D4SignService";
import { converteValorExtensoHandler } from "./services/UtilsService";

const routes = Router();

routes.post("/login", EmployeeController.login);
//routes.use(authMiddlewares);
routes.post("/employee", EmployeeController.create);
routes.get("/employees", EmployeeController.getAll);
routes.get("/employee/:id", EmployeeController.getById);
routes.delete("/employee/:id", EmployeeController.delete);
routes.put("/employee/:id", EmployeeController.update);
routes.post("/employeeInfo", EmployeeController.createInfo);
routes.get("/employeesInfo", EmployeeController.getAllInfo);
routes.get("/employeeInfo/:id", EmployeeController.getByIdInfo);
routes.delete("/employeeInfo/:id", EmployeeController.deleteInfo);
routes.put("/employeeInfo/:id", EmployeeController.updateInfo);

routes.post("/serverAccess", ServerAccessController.create);
routes.get("/serverAccessGetAll", ServerAccessController.getAllUsers);
routes.get("/serverAccess/:id", ServerAccessController.getById);
routes.delete("/serverAccess/:id", ServerAccessController.delete);
routes.put("/serverAccess/:id", ServerAccessController.update);

routes.post("/email", EmailController.create);
routes.get("/emails", EmailController.getAll);
routes.get("/email/:id", EmailController.getById);
routes.delete("/email/:id", EmailController.delete);
routes.put("/email/:id", EmailController.update);

routes.post("/service", DocumentsController.createService);
routes.get("/services", DocumentsController.getServices);
routes.delete("/service/:id", DocumentsController.deleteService);
routes.put("/service/:id", DocumentsController.updateService);

routes.post("/contract", DocumentsController.createContract);
routes.get("/contracts", DocumentsController.getContracts);
routes.delete("/contract/:id", DocumentsController.deleteContract);
routes.put("/contract/:id", DocumentsController.updateContract);

routes.post("/additive", AdditiveOrReajustmentController.createAdditive);
routes.delete("/additive/:id",AdditiveOrReajustmentController.deleteAdditive);
routes.put("/additive/:id",AdditiveOrReajustmentController.updateAdditive);

routes.post("/reajustment",AdditiveOrReajustmentController.createReajustment);
routes.delete("/reajustment/:id",AdditiveOrReajustmentController.deleteReajustment);
routes.put("/reajustment/:id",AdditiveOrReajustmentController.updateReajustment);

routes.post("/contractSign", ContractSignatureController.create);
routes.get("/contractSigns", ContractSignatureController.getAll);
routes.get("/contractSign/:id", ContractSignatureController.getById);
routes.delete("/contractSign/:id", ContractSignatureController.delete);
routes.put("/contractSign/:id", ContractSignatureController.update);

routes.get("/listarTodosOsDocumentos", listarDocumentos);
routes.post("/enviarDocumentoParaAssinar", enviarDocumentoParaAssinar);
routes.post("/cadastrarDocumento", cadastrarDocumento);
routes.post("/cancelarDocumento", cancelarDocumento);
routes.get("/buscarDocumentosDoCofre", buscarDocumentosDoCofre);
routes.get("/buscarDocumentosDoCofrePorId", buscarDocumentosDoCofrePorId);
routes.post("/downloadDeDocumento", downloadDeDocumento);
routes.post("/listarSignatariosDeDocumento", listarSignatariosDeDocumento);
routes.post("/removerAssinaturaDoDocumento", removerAssinaturaDoDocumento);
routes.get("/listaDocumentoStatus", listaDocumentoStatus);
routes.post("/reenviarDocumentoParaAssinar", reenviarDocumentoParaAssinar);
routes.post(
  "/cadastrarAssinaturaNoDocumento",
  cadastrarAssinaturaNoDocumento
);

routes.post("/product", ProductController.create);
routes.get("/products", ProductController.getAll);
routes.get("/product/:id", ProductController.getById);
routes.delete("/product/:id", ProductController.delete);
routes.put("/product/:id", ProductController.update);

routes.post("/uniform", UniformController.create);
routes.get("/uniforms", UniformController.getAll);
routes.get("/uniform/:id", UniformController.getById);
routes.delete("/uniform/:id", UniformController.delete);
routes.put("/uniform/:id", UniformController.update);

routes.post("/valueExtensible", converteValorExtensoHandler);

export default routes;
