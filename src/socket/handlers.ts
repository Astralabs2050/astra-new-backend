import { ChatRoomModel, ChatMessageModel } from '/Users/chukwumaihenzerue/Desktop/astra-new-backend/src/model/index';
import { Op } from 'sequelize';

export const test = (socket: any) => {
    // Join a chat room
    socket.on("join_room", async (roomId: string) => {
        try {
            socket.join(roomId);
            
            // Find or create room in database
            let room = await ChatRoomModel.findOne({ where: { id: roomId } });
            
            if (!room) {
                room = await ChatRoomModel.create({
                    id: roomId,
                    name: `Room ${roomId}`,
                    participants: [socket.user.id]
                });
            } else {
                // Update participants if user not already in room
                if (!room.participants.includes(socket.user.id)) {
                    room.participants = [...room.participants, socket.user.id];
                    await room.save();
                }
            }

            // Notify room participants
            socket.to(roomId).emit("user_joined", {
                userId: socket.user.id,
                userName: socket.user.name
            });

            // Send last 50 messages to the joining user
            const recentMessages = await ChatMessageModel.findAll({
                where: { roomId },
                order: [['createdAt', 'DESC']],
                limit: 50
            });

            socket.emit("message_history", recentMessages.reverse());

            console.log(`User ${socket.user.id} joined room ${roomId}`);
        } catch (error) {
            console.error("Error joining room:", error);
            socket.emit("error", "Failed to join room");
        }
    });

    // Leave a chat room
    socket.on("leave_room", async (roomId: string) => {
        try {
            socket.leave(roomId);
            
            // Update room participants in database
            const room = await ChatRoomModel.findOne({ where: { id: roomId } });
            if (room) {
                room.participants = room.participants.filter(id => id !== socket.user.id);
                await room.save();

                // Delete room if empty
                if (room.participants.length === 0) {
                    await room.destroy();
                }
            }

            // Notify room participants
            socket.to(roomId).emit("user_left", {
                userId: socket.user.id,
                userName: socket.user.name
            });

            console.log(`User ${socket.user.id} left room ${roomId}`);
        } catch (error) {
            console.error("Error leaving room:", error);
            socket.emit("error", "Failed to leave room");
        }
    });

    // Send a message to a room
    socket.on("send_message", async (message: { content: string, roomId: string }) => {
        try {
            // Validate message
            if (!message.content?.trim()) {
                throw new Error("Message content cannot be empty");
            }

            // Check if room exists
            const room = await ChatRoomModel.findOne({ where: { id: message.roomId } });
            if (!room) {
                throw new Error("Room not found");
            }

            // Create message in database
            const newMessage = await ChatMessageModel.create({
                roomId: message.roomId,
                senderId: socket.user.id,
                senderName: socket.user.name,
                content: message.content
            });

            // Broadcast to room
            socket.to(message.roomId).emit("new_message", {
                id: newMessage.id,
                roomId: message.roomId,
                senderId: socket.user.id,
                senderName: socket.user.name,
                content: message.content,
                createdAt: newMessage.createdAt
            });

            // Acknowledge message receipt
            socket.emit("message_sent", {
                success: true,
                messageId: newMessage.id,
                timestamp: newMessage.createdAt
            });

        } catch (error) {
            console.error("Error sending message:", error);
            socket.emit("error", "Failed to send message");
        }
    });

    // Get room messages
    socket.on("get_messages", async (roomId: string, page = 1, limit = 50) => {
        try {
            const offset = (page - 1) * limit;
            const messages = await ChatMessageModel.findAll({
                where: { roomId },
                order: [['createdAt', 'DESC']],
                limit,
                offset
            });

            socket.emit("room_messages", {
                messages: messages.reverse(),
                page,
                limit
            });
        } catch (error) {
            console.error("Error fetching messages:", error);
            socket.emit("error", "Failed to fetch messages");
        }
    });

    // Get user's rooms
    socket.on("get_rooms", async () => {
        try {
            const rooms = await ChatRoomModel.findAll({
                where: {
                    participants: {
                        [Op.contains]: [socket.user.id]
                    }
                }
            });
            
            socket.emit("rooms_list", rooms);
        } catch (error) {
            console.error("Error fetching rooms:", error);
            socket.emit("error", "Failed to fetch rooms");
        }
    });

    // Handle disconnect
    socket.on("disconnect", async () => {
        try {
            // Find all rooms where user is a participant
            const rooms = await ChatRoomModel.findAll({
                where: {
                    participants: {
                        [Op.contains]: [socket.user.id]
                    }
                }
            });

            // Remove user from all rooms
            for (const room of rooms) {
                room.participants = room.participants.filter(id => id !== socket.user.id);
                if (room.participants.length === 0) {
                    await room.destroy();
                } else {
                    await room.save();
                }
            }
        } catch (error) {
            console.error("Error handling disconnect:", error);
        }
    });
};