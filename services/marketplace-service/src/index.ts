import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import routes from "./routes";
import bodyParser from "body-parser";

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3004;

const app = express();
app.use(bodyParser.json());

app.get("/health", (_, res) => res.json({ status: "ok" }));
app.use("/", routes);

AppDataSource.initialize()
  .then(() => {
    console.log("Marketplace DB connected!");
    app.listen(PORT, () => console.log(`Marketplace Service running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("DB init error", err);
  });
