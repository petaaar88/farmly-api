import express from "express";
import dotenv from "dotenv";
import usersRoutes from "./routes/usersRoutes.js";
import globalErrorHandler from "./errors/globalErrorHandler.js";

dotenv.config();

const PORT = process.env.PORT;

if(PORT === undefined)
    throw new Error("Port is not defined!");

const app = express();

app.use(express.json());

app.use("/api/users", usersRoutes);

app.use(globalErrorHandler);

app.listen(PORT, () => console.log(`Farmly API listening on port ${PORT}...`))