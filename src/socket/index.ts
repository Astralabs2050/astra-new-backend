// File: socketHandler.ts
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { MessageModel, UsersModel } from "../model";
import { createNotification, getSingleUploadedMedia } from "../../util/helperFunctions";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";
import { NotificationModel } from "../model/notification.model";

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
    console.log(`${socket.id} connected`);
    //emitt connectted to socket
    socket.on("connection", async()=>{
      io.to(socket?.id).emit("connection_status",true)
    })
    // Set the user as active
    await UsersModel.update({ active: true }, { where: { id: socket.id } });
    socket.on('getNotification',async()=>{
        //get notification 
        const allNotification = await NotificationModel.findAll({
          where:{
            userId:socket?.id
          },
          order: [["createdAt", "DESC"]], 
        })
        if(allNotification){
          io.to(socket?.id).emit("newNotification",allNotification)
        }
       
    })
    // Emit all users
    socket.on('getUser', async () => {
      io.emit('user', await getUsersWithMessages(socket.id));
    });

    // Get previous messages for the user
    socket.on('get_previous_messages', async (data: any) => {
      try {
        if(data.senderId === data.receiverId){
          const sentMessages = await getMessages(data.senderId, data.receiverId);
          socket.emit('previous_messages', [...sentMessages]);
        }else{
          const sentMessages = await getMessages(data.senderId, data.receiverId);
          const receivedMessages = await getMessages(data.receiverId, data?.senderId);
          socket.emit('previous_messages', [...sentMessages, ...receivedMessages]);
        }

      } catch (error) {
        console.error(error);
      }
    });

    // Handle private messages
    socket.on('privateMessage', async (data: any) => {
      try {
        const message = await saveAndBroadcastMessage(data);
        let createNewNotification = await createNotification("NEW_MESSAGE",data.receiverId,data.senderId)
        console.log("createNewNotification",createNewNotification)
        io.to(data.receiverId).emit("newNotification",[createNewNotification])
  
        io.to(data.senderId).emit('privateMessage', message);
        io.to(data.receiverId).emit('privateMessage', message);
      } catch (error) {
        console.error(error);     
      }
    });
    socket.on('openChat',async(data)=>{
      const {recevier,sender} = data
      const updateResult = await MessageModel.update(
        { seen: true },
        {
          where: {
            senderId: sender,
            receiverId:recevier, // Corrected spelling from 'recevier' to 'receiver'
            seen: false || null
          }
        }
      );
      try {
        const sentMessages = await getMessages(data.senderId, data.receiverId);
        const receivedMessages = await getMessages(data.receiverId, data.senderId);

        socket.emit('previous_messages', [...sentMessages, ...receivedMessages]);
      } catch (error) {
        console.error(error);
      }
    })

    socket.on("disconnect", async () => {
      console.log(`${socket.id} disconnected`);
      socket.on("connection", async()=>{
        io.to(socket?.id).emit("connection_status",false)
      })
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

const getUsersWithMessages = async (socketId: string) => {
  const allUsers = await UsersModel.findAll();

  if (allUsers) {
    return Promise.all(
      allUsers.map(async (user) => {
        const profileImage = await getSingleUploadedMedia({ id: user.id }, "PROFILE_IMAGE");
        return { ...user.toJSON(), profileImage };
      })
    );
  }

  return [];
};

const getMessages = async (senderId: string, receiverId: string) => {
  return MessageModel.findAll({ where: { senderId, receiverId } });
};

const saveAndBroadcastMessage = async (data: any) => {
  //check where the recevier is online
  const receiver = await UsersModel.findOne({
    where:{
      id:data.receiverId
    },
    attributes:['active']
  })

  const message = await MessageModel.create({
    message: data.message,
    type: data.type,
    receiverId: data.receiverId,
    senderId: data.senderId,
    sent: true,
    seen:receiver?.dataValues?.active,
    createdAt:data.createdAt

  });

  return message;
};

export { handleSocketConnection };
