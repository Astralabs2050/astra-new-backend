import { Router } from "express";
import { UserController } from "../controllers/user";

const userRouter = Router();

userRouter.get("/get/:userType/:level", UserController.getSelf);
userRouter.post("/upload-profile-image", UserController.uploadProfileImage);
userRouter.get("/self", UserController.getSelf);

export default userRouter;
