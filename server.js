import express from "express";
import dotenv from "dotenv";
import usersRoutes from "./routes/usersRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import globalErrorHandler from "./errors/globalErrorHandler.js";
import sequelize from "./config/database.js";

dotenv.config();

const PORT = process.env.PORT;

if(PORT === undefined) throw new Error("Port is not defined!");

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/products", productRoutes);

app.use(globalErrorHandler);

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected!');

        app.listen(PORT, () => console.log(`Farmly api running on port ${PORT}...`));

    } catch (error) {
        console.error('Unable to start server:', error);
    }
};

startServer();