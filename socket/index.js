import { Server } from "socket.io";
import socketAuthMiddleware from "./socketAuth.js";
import registerSocketHandlers from "./socketHandlers.js";

const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    registerSocketHandlers(io, socket);
  });

  return io;
};

export default initializeSocket;
