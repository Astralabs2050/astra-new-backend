import { Request, Response } from "express";
import { StaffMessageModel, UsersModel } from "../model";

export class MessageController {
    public staff = async (req: any, res: Response) => {
        const { message, recipient } = req.body;
        try {
            let users;
            // Get recipients
            if (recipient === "all") {
                users = await UsersModel.findAll({
                    where: {
                        userType: 'student',
                    },
                });
            } else if (recipient === "staff") {
                users = await UsersModel.findAll({
                    where: {
                        userType: 'staff',
                    },
                });
            } else {
                users = await UsersModel.findAll({
                    where: {
                        level: recipient,
                    },
                });
            }

            if (users && users.length > 0) {
                const { id } = req?.user;
                // Create a StaffMessageModel for each user excluding the sender
                const createStaffModels = await Promise.all(
                    users.map(async (user) => {
                        try {
                            // Exclude the sender from the list of recipients
                            if (user.id !== id) {
                                await StaffMessageModel.create({
                                    message,
                                    senderId: id,
                                    receiverId: user.id,
                                });
                                // You can return some indication of success for each user if needed
                                return {
                                    status: true,
                                    message: `Message successfully sent to user with email ${user.email}`,
                                };
                            } else {
                                return {
                                    status: false,
                                    message: `Skipping sender with user with email ${user.email}`,
                                };
                            }
                        } catch (err:any) {
                            // Handle any errors that occurred during the database operation
                            return {
                                status: false,
                                message: `Error sending message to user with email ${user.email}: ${err.message}`,
                            };
                        }
                    })
                );

                // Send the response after the loop
                res.json({
                    status: true,
                    message: "Messages successfully sent to all users",
                    details: createStaffModels, // Include additional details if needed
                });
            } else {
                res.json({
                    status: false,
                    message: "No user found",
                });
            }
        } catch (err:any) {
            // Handle any other errors that occurred
            res.status(500).json({
                status: false,
                message: "Internal server error",
                error: err.message,
            });
        }
    };
}

const messageController = new MessageController();
export default messageController;
