import "reflect-metadata";
import express from "express";
import { DataSourceSingleton } from "./database";

const app = express();
app.use(express.json());

const dataSource = DataSourceSingleton.getInstance();
dataSource.initialize()
    .then(() => console.log("Banco conectado!"))
    .catch((err) => console.error("Erro ao conectar com banco:", err));

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));