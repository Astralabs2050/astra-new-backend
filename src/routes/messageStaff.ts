import isAuthenticated from "../middleware/authorization";
import { Router } from "express";
import { celebrate } from "celebrate";
import messageController from "../controllers/message";

const messageRouter = Router();

messageRouter.post("/staff-message", messageController.staff);
messageRouter.get("/get-message", messageController.getStaffMessage)



export default messageRouter