import {Router} from 'express';
import { UserController } from '../controllers/user';

const userRouter = Router();

userRouter.get("/get/:userType/:level",UserController.getUser)


export default userRouter