// File: socketHandler.ts
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { MessageModel, UsersModel } from "../model";

export const handleSocketConnection = (io: Server) => {
  io.use((socket: any, next) => {
    const token: any = socket.request.headers.token;

    if (!token) {
      return next(new Error("Unauthorized: Missing token"));
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

  //connecting the sockect.io instance
  io.on("connection", (socket) => {
    console.log(socket.id + " connected");
  
    socket.on("receive_private_message", async (data) => {
      const { receiverId, message } = data;
  
      try {
        // Check if the receiver exists
        const receiverExists = await UsersModel.findOne({
          where: {
            id: receiverId,
          },
        });
  
        if (receiverExists) {
          // Save the message to the database
          const newMessage = await MessageModel.create({
            message,
            receiverId,
            senderId: socket.id,
          });
          //get all the messages from users chat
          const chatHistory = await MessageModel.findAll({
            where:{
                receiverId,
                senderId: socket.id
            },
            order: [["createdAt", "DESC"]]
          })
          // Emit the message directly to the receiver
          io.to(receiverId).emit("send_private_message", chatHistory);
        } else {
          throw new Error("User not found");
        }
      } catch (err) {
        console.error(err, 'error');
      }
    });
  
    socket.on("disconnect", () => {
      console.log(socket.id + " disconnected");
    });
  });
  
};
