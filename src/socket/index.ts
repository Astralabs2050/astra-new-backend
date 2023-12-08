// File: socketHandler.ts
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { MessageModel, UsersModel } from "../model";
import { getSingleUploadedMedia } from "../../util/helperFunctions";

const JWT_SECRET = process.env.JWT_SECRET || "";

const handleSocketConnection = async (io: Server) => {
  io.use(async (socket: any, next) => {
    try {
      const token: string = socket.handshake.auth.token as string;

      if (!token) {
        throw new Error("Unauthorized: Missing token");
      }

      const decoded: any = await jwt.verify(token, JWT_SECRET);

      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTimestamp) {
        throw new Error("Unauthorized: Token Expired");
      }

      const userData = decoded?.data;
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

  io.on("connection", async (socket: Socket) => {
    console.log(socket.id + " connected");

    // Set the user as active
    await UsersModel.update({ active: true }, { where: { id: socket.id } });

    socket.on("send_private_message", async (data: any) => {
      console.log(data, 'from front end');

      try {
        const { receiverId, message, type } = data;

        // Check if the receiver exists
        const receiverExists = await UsersModel.findOne({
          where: { id: receiverId },
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
            where: { receiverId, senderId: socket.id },
            order: [["createdAt", "DESC"]],
          });

          const [receiverImg, senderImg] = await Promise.all([
            getSingleUploadedMedia({ id: receiverId }, "PROFILE_IMAGE"),
            getSingleUploadedMedia({ id: socket.id }, "PROFILE_IMAGE"),
          ]);

          // Emit the message directly to the receiver
          io.to(receiverId).emit("receive_private_message", {
            chatHistory,
            senderImg,
            receiverImg,
          });
        } else {
          // Emit an error event to the sender
          socket.emit("private_message_error", { error: "User not found" });
        }
      } catch (err) {
        socket.emit("private_message_error", {
          error: "Error processing private message",
        });
        handleSocketError(err, 'Error processing private message:');
      }
    });

    socket.on("disconnect", async () => {
      console.log(socket.id + " disconnected");

      // Set the user as inactive
      await UsersModel.update(
        { active: false, lastseen: new Date() },
        { where: { id: socket.id } }
      );
    });
  });
};

const handleSocketError = (err: any, message: string) => {
  console.error(message, err);
};

export { handleSocketConnection };
