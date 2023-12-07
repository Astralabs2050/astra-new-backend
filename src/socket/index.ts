// File: socketHandler.ts
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";

export const handleSocketConnection = (io: Server) => {
  io.use((socket: any, next) => {
    const token: any = socket.request.headers.token;

    if (!token) {
      return next(new Error('Unauthorized: Missing token'));
    }

    const secretKey: any = process.env.JWT_SECRET;
    jwt.verify(token, secretKey, (err: any, decoded: any) => {
      if (err) {
        console.error("JWT verification error:", err);
        return next(new Error("Unauthorized: Invalid token"));
      }

      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTimestamp) {
        return next(new Error("Unauthorized: Token Expired"));
      }

      let userData = decoded?.data;
      if (userData) {
        delete userData?.password;
      }

      socket.user = userData;
      socket.id = userData?.id;
    });

    return next();
  });

  io.on('connection', (socket) => {
    console.log(socket.id + ' connected');

    socket.on('receive_private_message', (data) => {
      const { sender_id, recevier_id, message } = data;
      console.log(`Message received from ${sender_id}: ${message}`);

      io.emit('send_private_message', { sender: sender_id, message });
    });

    socket.on('disconnect', () => {
      console.log(socket.id + ' disconnected');
    });
  });
};
