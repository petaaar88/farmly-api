import { createServer } from "http";
import dotenv from "dotenv";
import app from "./app.js";
import sequelize from "./config/database.js";
import initializeSocket from "./socket/index.js";

dotenv.config();

const httpServer = createServer(app);
const io = initializeSocket(httpServer);

const startServer = async () => {
  const PORT = process.env.PORT;

  if (PORT === undefined) throw new Error("Port is not defined!");

  try {
    await sequelize.authenticate();
    console.log('Database connected!');

    httpServer.listen(PORT, () => console.log(`Farmly api running on port ${PORT}...`));

  } catch (error) {
    console.error('Unable to start server:', error);
  }
};

if (process.env.NODE_ENV !== 'test')
  startServer();

export { app, httpServer, io, sequelize };