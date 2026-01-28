import { verifyJwt } from "../utils/jwtUtils.js";

const socketAuthMiddleware = (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token)
    return next(new Error("Authentication required"));

  try {
    const payload = verifyJwt(token);
    socket.user = payload;
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
};

export default socketAuthMiddleware;
