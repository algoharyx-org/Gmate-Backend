import express from 'express';
import dbConnection from './src/DB/dbConnection.js';
import { config } from './src/config/env.js';
import cookieParser from 'cookie-parser';
import bootstrap from './src/main.js';

const app = express();

dbConnection();

app.use(express.json());
app.use(cookieParser());

bootstrap(app);

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});