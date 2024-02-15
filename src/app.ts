import express, { Application } from "express";

const app: Application = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.listen(port, () => {
  console.log(`Listening to requests on port ${port}`);
});
