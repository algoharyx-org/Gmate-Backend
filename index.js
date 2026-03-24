import express from 'express';
import dbConnection from './src/DB/dbConnection.js';
import { config } from './src/config/env.js';
import bootstrap from './src/main.js';
import qs from 'qs';

const app = express();

dbConnection();

app.use(express.json());

bootstrap(app);

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});