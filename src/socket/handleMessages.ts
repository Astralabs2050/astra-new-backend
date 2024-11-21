import { Op } from "sequelize";
import { UsersModel } from "../model";
import { MessageModel } from "../model/ChatMessage.model";

export function sendMessage(io: any) {}

export function receiveMessage(io: any) {}

const getMessages = async (senderId: string, receiverId: string) => {
  // Retrieve both sent and received messages for a conversation
  return MessageModel.findAll({
    where: {
      [Op.or]: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    },
    order: [['createdAt', 'ASC']]
  });
};

const saveAndBroadcastMessage = async (data: any) => {
  try {
    // Check if the receiver is online
    const receiver = await UsersModel.findOne({
      where: { id: data.receiverId },
      attributes: ['active']
    });

    // Create the message with a seen status based on receiver's availability
    const message = await MessageModel.create({
      message: data.message,
      type: data.type,
      receiverId: data.receiverId,
      senderId: data.senderId,
      sent: true,
      seen: receiver?.active ?? false,
      createdAt: data.createdAt
    });

    return message;
  } catch (error) {
    console.error("Error in saveAndBroadcastMessage:", error);
    throw error;
  }
};

export async function getPreviousMessages(
  socket: any,
  senderId: string,
  receiverId: string
) {
  socket.on("get_previous_messages", async (data: any) => {
    try {
      const messages = await getMessages(data.senderId, data.receiverId);
      socket.emit("previous_messages", messages);
    } catch (error) {
      console.error("Error retrieving previous messages:", error);
    }
  });
}

export async function handlePrivateMessage(socket: any, io: any) {
  socket.on("privateMessage", async (data: any) => {
    try {
      const message = await saveAndBroadcastMessage(data);
      io.to(data.receiverId).emit("privateMessage", message);
    } catch (error) {
      console.error("Error handling private message:", error);
    }
  });
}

export async function updateUserAvailability(status: boolean, id: string) {
  try {
    await UsersModel.update({ active: status }, { where: { id } });
  } catch (error) {
    console.error("Error updating user availability:", error);
  }
}

export function markAsRead(io: any) {
  io.on("connection", (socket: any) => {
    socket.on("mark_as_read", async (data: any) => {
      try {
        await MessageModel.update(
          { seen: true },
          {
            where: {
              receiverId: data.receiverId,
              senderId: data.senderId,
              seen: false,
            },
          }
        );
        io.to(data.senderId).emit("message_read", { receiverId: data.receiverId });
      } catch (error) {
        console.error("Error in markAsRead:", error);
      }
    });
  });
}

export function typing(io: any) {
  io.on("connection", (socket: any) => {
    socket.on("typing", (data: any) => {
      try {
        io.to(data.receiverId).emit("typing", { senderId: data.senderId });
      } catch (error) {
        console.error("Error in typing:", error);
      }
    });

    socket.on("stop_typing", (data: any) => {
      try {
        io.to(data.receiverId).emit("stop_typing", { senderId: data.senderId });
      } catch (error) {
        console.error("Error in stop_typing:", error);
      }
    });
  });
}
