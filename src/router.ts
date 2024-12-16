import express, { Router } from "express";
import multer from "multer";
import AdditiveOrReajustmentController from "./controllers/AdditiveOrReajustmentController";
import AGCController from "./controllers/AGCController";
import ContractSignatureController from "./controllers/ContractSignatureController";
import DocumentsController from "./controllers/DocumentsController";
import DraftsController from "./controllers/DraftsController";
import EmailController from "./controllers/EmailController";
import EmployeeController from "./controllers/EmployeeController";
import FileController from "./controllers/FileController";
import FormController from "./controllers/FormController";
import ProductController from "./controllers/ProductController";
import ServerAccessController from "./controllers/ServerAccessController";
import UniformController from "./controllers/UniformController";
import UtilsController from "./controllers/UtilsController";
import authMiddlewares from "./middlewares/auth";
import {
  buscarDocumentosDoCofre,
  buscarDocumentosDoCofreAditivo,
  buscarDocumentosDoCofrePorId,
  cadastrarAditivo,
  cadastrarAssinaturaNoDocumento,
  cadastrarDocumento,
  cancelarAditivo,
  cancelarDocumento,
  downloadDeDocumento,
  enviarDocumentoParaAssinar,
  listaDocumentoStatus,
  listarDocumentos,
  listarSignatariosDeDocumento,
  reenviarDocumentoParaAssinar,
  removerAssinaturaDoDocumento,
} from "./services/D4SignService";

const app = express();
const routes = Router();
const upload = multer({
  limits: {
    fieldSize: 50 * 1024 * 1024,
  },
});

routes.post("/login", EmployeeController.login);
routes.use(authMiddlewares);
routes.post("/employee", EmployeeController.create);
routes.get("/employees", EmployeeController.getAll);
routes.get("/employee/:id", EmployeeController.getById);
routes.delete("/employee/:id", EmployeeController.delete);
routes.put("/employee/:id", EmployeeController.update);
routes.put("/employeePassword/:id", EmployeeController.changePasswrod);
routes.post("/employeeInfo", EmployeeController.createInfo);
routes.get("/employeesInfo", EmployeeController.getAllInfo);
routes.get("/employeeInfo/:id", EmployeeController.getByIdInfo);
routes.delete("/employeeInfo/:id", EmployeeController.deleteInfo);
routes.put("/employeeInfo/:id", EmployeeController.updateInfo);
routes.post("/resetPassword", EmployeeController.resetPassword);

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

routes.post("/form", FormController.create);
routes.get("/forms", FormController.getAll);
routes.get("/form/:id", FormController.getById);
routes.get("/formSubmissions/:id", FormController.getSubmissions);
routes.get("/formUrl/:id", FormController.getByUrl)
routes.delete("/form/:id", FormController.delete);
routes.put("/form/:id", FormController.updateProperties);
routes.put("/formContent/:id", FormController.updateContent);
routes.put("/publishForm/:id", FormController.publishForm); 
routes.put("/submitForm/:id", FormController.submitForm); 

routes.post("/service", DocumentsController.createService);
routes.get("/services", DocumentsController.getServices);
routes.delete("/service/:id", DocumentsController.deleteService);
routes.put("/service/:id", DocumentsController.updateService);

routes.post("/contract", DocumentsController.createContract);
routes.post("/customer", DocumentsController.createCustomer);
routes.get("/contracts", DocumentsController.getContracts);
routes.get("/contract/:id", DocumentsController.getById);
routes.get("/contractInfo/:id", DocumentsController.getByIdAllInfo);
routes.delete("/contract/:id", DocumentsController.deleteContract);
routes.put("/contract/:id", DocumentsController.updateContract);
routes.get("/dashboard/contract-stats", DocumentsController.getDashboardStats);
routes.get("/dashboard/monthly", DocumentsController.getContractsByMonth); 

routes.post("/additive", AdditiveOrReajustmentController.createAdditive);
routes.delete("/additive/:id", AdditiveOrReajustmentController.deleteAdditive);
routes.put("/additive/:id", AdditiveOrReajustmentController.updateAdditive);

routes.post("/reajustment", AdditiveOrReajustmentController.createReajustment);
routes.delete(
  "/reajustment/:id",
  AdditiveOrReajustmentController.deleteReajustment
);
routes.put(
  "/reajustment/:id",
  AdditiveOrReajustmentController.updateReajustment
);

routes.post("/contractSign", ContractSignatureController.create);
routes.get("/contractSigns", ContractSignatureController.getAll);
routes.get("/contractSign/:id", ContractSignatureController.getById);
routes.delete("/contractSign/:id", ContractSignatureController.delete);
routes.put("/contractSign/:id", ContractSignatureController.update);

routes.get("/listarTodosOsDocumentos", listarDocumentos);
routes.post("/enviarDocumentoParaAssinar", enviarDocumentoParaAssinar);
routes.post("/cadastrarDocumento", upload.none(), cadastrarDocumento);
routes.post("/cadastrarAditivo", upload.none(), cadastrarAditivo);
routes.post("/cancelarDocumento", cancelarDocumento);
routes.post("/cancelarAditivo", cancelarAditivo);
routes.get("/buscarDocumentosDoCofre", buscarDocumentosDoCofre);
routes.get("/buscarDocumentosDoCofreAditivo", buscarDocumentosDoCofreAditivo);
routes.get("/buscarDocumentosDoCofrePorId", buscarDocumentosDoCofrePorId);
routes.post("/downloadDeDocumento", downloadDeDocumento);
routes.post("/listarSignatariosDeDocumento", listarSignatariosDeDocumento);
routes.post("/removerAssinaturaDoDocumento", removerAssinaturaDoDocumento);
routes.get("/listaDocumentoStatus", listaDocumentoStatus);
routes.post("/reenviarDocumentoParaAssinar", reenviarDocumentoParaAssinar);
routes.post("/cadastrarAssinaturaNoDocumento", cadastrarAssinaturaNoDocumento);

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

routes.post("/upload", upload.single("file"), FileController.uploadPdf);
routes.put("/updatePDF", upload.single("file"), FileController.updatePdf);
routes.post("/uploadAdditive", upload.single("file"), FileController.uploadAdditivePdf);
routes.put("/updateAdditivePDF", upload.single("file"), FileController.updateAdditivePdf);

routes.post("/valueExtensible", UtilsController.converteValorExtensoHandler);
routes.post("/cep", UtilsController.buscaCep);

routes.post("/buscaHorasTrabalhadasRH", UtilsController.buscaHorasTrabalhadasRH);
routes.post("/buscar-produtos-pedido", UtilsController.buscarProdutosDoPedido);
routes.put("/finalizar", UtilsController.alterarStatusPedidoFinalizado);
routes.post("/alterarStatusComprado", UtilsController.alterarStatusPedidoComprado);
routes.post("/alterarStatusCancelado", UtilsController.alterarStatusPedidoCancelado);
routes.get("/pedidos", UtilsController.buscarPedidos);
routes.post("/forgotPassword", UtilsController.forgotPassword);

routes.post("/drafts", upload.single("file"), DraftsController.createDraft);
routes.get("/drafts/contract/:contractId", DraftsController.getDraftsByContractId);
routes.get("/drafts/:id", DraftsController.getDraftById);
routes.put("/drafts/:id", upload.single("file"), DraftsController.updateDraft);
routes.delete("/drafts/:id", DraftsController.deleteDraft);

routes.get("/buscaInsumos", AGCController.buscaInsumos);
routes.get("/insumosMovimentacao", AGCController.buscarMovimentacoes);
routes.get("/buscarProdutos", AGCController.buscarProdutos);

export default routes;
