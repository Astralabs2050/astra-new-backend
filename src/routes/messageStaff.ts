import isAuthenticated from "../middleware/authorization";
import { Router } from "express";
import { celebrate } from "celebrate";
import messageController from "../controllers/message";

const messageRouter = Router();

messageRouter.post("/staff-message", messageController.staff);




export default messageRouter