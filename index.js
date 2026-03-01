import express from "express";
import dbConnection from "./src/DB/dbConnection.js";
import { config } from "./src/config/env.js";

const app = express();

dbConnection();

app.use(express.json());

const server = app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}
${JSON.stringify(server.address())}`);
});
