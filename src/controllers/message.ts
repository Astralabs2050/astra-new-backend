import { Request, Response } from "express";
import { StaffMessageModel, UsersModel } from "../model";
import { getUploadedFile } from "../../util/helperFunctions";

export class MessageController {
    public staff = async (req: any, res: Response) => {
        const {userType} = req?.user;
        const { message, recipient } = req.body;
        if(userType === 'staff'){

        try {
            let users: any[];

            if (recipient === "all") {
                users = await UsersModel.findAll({
                    where: { userType: 'student' },
                });
            } else if (recipient === "staff") {
                users = await UsersModel.findAll({
                    where: { userType: 'staff' },
                });
            } else {
                users = await UsersModel.findAll({
                    where: { level: recipient },
                });
            }

            const senderId = req?.user?.id;

            if (users && users.length > 0) {
                // Use Promise.all to parallelize the creation of StaffMessageModel instances
                await Promise.all(users.map(async (user) => {
                    if (user.id !== senderId) {
                        await StaffMessageModel.create({
                            message,
                            senderId,
                            receiver: recipient,
                        });
                    }
                }));

                res.json({
                    status: true,
                    message: `Messages successfully sent to ${recipient} ${recipient === "all" ? "users" : recipient ==="staff" ? "staff" : "level students "}`,
                });
            } else {
                res.json({
                    status: false,
                    message: `No ${recipient} ${recipient === "all" ? "users" : recipient ==="staff" ? "staff" : "level students "} found`,
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
        }else{
            res.json({
                status:false,
                message:"you need to be a staff to be able to send messages"
            })
        }
    };
    public getStaffMessage = async (req: any, res: Response) => {
        // Get the user info
        const { userType, level } = req?.user;
        const { firstname } = req?.user;
    
        try {
            let message: any;
    
            if (userType === "staff") {
                message = await StaffMessageModel.findAll({
                    where: {
                        receiver: userType
                    },
                    order: [['createdAt', 'DESC']] // Sort by createdAt in descending order
                });
            } else {
                message = await StaffMessageModel.findAll({
                    where: {
                        receiver: level
                    },
                    order: [['createdAt', 'DESC']] // Sort by createdAt in descending order
                });
            }
    
            const messagePromises = message.map(async (a: any) => {
                const staffInfo: any = await UsersModel.findOne({
                    where: {
                        id: a.senderId
                    },
                    attributes: ["fullname","id"]
                });
                const profileImg = await getUploadedFile(staffInfo?.dataValues,"PROFILE_IMAGE")
                // Assuming staffInfo contains the sender's name
                const messageWithSenderName = {
                    message: a.message,
                    senderName: staffInfo ? staffInfo?.dataValues?.fullname : 'Unknown',
                    profileImg,
                    time: a.createdAt
                };
    
                console.log(messageWithSenderName, 'message');
                return messageWithSenderName;
            });
    
            // Wait for all promises to resolve
            const result = await Promise.all(messagePromises);
    
            return res.json({
                status: true,
                message: 'Messages retrieved',
                data: result
            });
    
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                status: false,
                message: 'An error occurred while retrieving messages.'
            });
        }
    }
}

const messageController = new MessageController();
export default messageController;
