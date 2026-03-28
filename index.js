import express from "express";
import http from "http";
import dbConnection from "./src/DB/dbConnection.js";
import { config } from "./src/config/env.js";
import bootstrap from "./src/main.js";
import { initSocket } from "./src/socket/socket.js";

const app = express();

dbConnection();

app.use(express.json());

bootstrap(app);

const server = http.createServer(app);
initSocket(server);

server.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});