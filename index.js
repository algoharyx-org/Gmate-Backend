import express from "express";
import dotenv from "dotenv";
import dbConnection from "./src/DB/dbConnection.js";

dotenv.config({ path: "./.env" });
const app = express();

dbConnection();

app.use(express.json());

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
