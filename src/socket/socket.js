import { Server } from "socket.io";
import { verifyToken } from "../utils/tokens.js";

let io = null;

function resolveToken(socket) {
  const authToken = socket.handshake.auth?.token;
  if (authToken) return authToken;
  const header = socket.handshake.headers?.authorization;
  if (header?.startsWith("Bearer ")) return header.slice(7);
  const q = socket.handshake.query?.token;
  if (typeof q === "string") return q;
  if (Array.isArray(q) && q[0]) return q[0];
  return null;
}

export function getIO() {
  return io;
}

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: true,
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    try {
      const token = resolveToken(socket);
      if (!token) {
        return next(new Error("Unauthorized"));
      }
      const decoded = verifyToken(token);
      const uid = decoded._id?.toString?.() ?? String(decoded._id);
      socket.userId = uid;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.userId}`);
  });

  return io;
}
