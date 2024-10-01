import cors from "cors";
import express from "express";
import http from "http";
import routes from "./router";

/* eslint no-console: "off" */

require("dotenv/config");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.use(routes);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () =>
  console.log(`Servidor rodando no http://localhost:${PORT}`)
);

export default app;
