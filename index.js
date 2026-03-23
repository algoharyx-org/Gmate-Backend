import express from 'express';
import dbConnection from './src/DB/dbConnection.js';
import { config } from './src/config/env.js';
import bootstrap from './src/main.js';
import cors from "cors";

const app = express();

dbConnection();

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true, 
}));


app.use(express.json());

bootstrap(app);

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});