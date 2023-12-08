// File: socketHandler.ts
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { MessageModel, UsersModel } from "../model";
import { getSingleUploadedMedia } from "../../util/helperFunctions";

export const handleSocketConnection = async (io: Server) => {
  io.use(async (socket: any, next) => {
    try {
      const token: string = socket.handshake.auth.token as string;
        
      if (!token) {
        throw new Error("Unauthorized: Missing token");
      }

      const secretKey: string = process.env.JWT_SECRET || "";
      const decoded: any = await jwt.verify(token, secretKey);

      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTimestamp) {
        throw new Error("Unauthorized: Token Expired");
      }

      let userData = decoded?.data;
      if (userData) {
        delete userData?.password;
      }

      socket.user = userData;
      socket.id = userData?.id;
    } catch (err) {
      handleSocketError(err, "JWT verification error:");
      return next(new Error("Unauthorized: Invalid token"));
    }

    return next();
  });

  io.on("connection", async(socket: Socket) => {
    console.log(socket.id + " connected");
    //set the user as active
    await UsersModel.update(
        { active: true },
        {
          where: {
            id: socket.id
          }
        }
      );
      
    socket.on("receive_private_message", async (data) => {
      try {
        const { receiverId, message,type } = data;

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
            type,
            senderId: socket.id,
          });

          // Get all the messages from users chat
          const chatHistory = await MessageModel.findAll({
            where: {
              receiverId,
              senderId: socket.id,
            },
            order: [["createdAt", "DESC"]],
          });

          const receiverImg = await getSingleUploadedMedia(
            {
              id: receiverId,
            },
            "PROFILE_IMAGE"
          );
          const senderImg = await getSingleUploadedMedia(
            {
              id: socket.id,
            },
            "PROFILE_IMAGE"
          );

          // Emit the message directly to the receiver
          io.to(receiverId).emit("send_private_message", {
            chatHistory,
            senderImg,
            receiverImg,
          });
        } else {
          throw new Error("User not found");
        }
      } catch (err) {
        handleSocketError(err, 'Error processing private message:');
      }
    });

    socket.on("disconnect", async() => {
      console.log(socket.id + " disconnected");
      //set the user as inactive
      await UsersModel.update(
        { 
            active: false,
            lastseen: new Date
         },
        {
          where: {
            id: socket.id
          }
        }
      );
    });
  });
};

const handleSocketError = (err: any, message: string) => {
  console.error(message, err);
};
