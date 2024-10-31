import { Handshake } from "./../../node_modules/socket.io/dist/socket-types.d";
// File: socketHandler.js
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { test } from "./test";

const JWT_SECRET: string = process.env.JWT_SECRET as string;

const handleSocketConnection = (io: {
  use: (arg0: (socket: any, next: any) => Promise<any>) => void;
  on: (arg0: string, arg1: (socket: any) => Promise<void>) => void;
}) => {
  io.use(async (socket, next) => {
    try {
      const token =
        socket?.handshake?.headers?.token || socket?.handshake?.auth?.token;
      console.log("token from socket12", token);
      if (!token) {
        throw new Error("Unauthorized: Missing token");
      }

      const decoded: any = jwt.verify(token, JWT_SECRET);
      console.log("decoded", decoded);
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decoded?.exp && decoded?.exp < currentTimestamp) {
        throw new Error("Unauthorized: Token Expired");
      }

      const userData = decoded?.data;
      console.log("userData", userData);
      if (userData) {
        delete userData?.password;
      }

      socket.user = userData;

      socket.id = userData?.id;
      next();
    } catch (err) {
      console.error("JWT verification error:", err);
      return next(new Error("Unauthorized: Invalid token"));
    }
  });

  io.on("connection", async (socket) => {
    console.log(`${socket.id} connected`);

    // Emit connection status
    socket.emit("connection_status", true);

    // test function here you would call other functions here
    test(socket);
    // Handle disconnect
    socket.on("disconnect", async () => {
      console.log(`${socket.id} disconnected`);
    });
  });
};

export { handleSocketConnection };
