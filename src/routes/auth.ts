import { Router } from "express";

import { AuthController } from "../controllers/auth.controller";

const authRouter = Router();
const authcontroller = new AuthController();

authRouter.post(
  "/register/brand",
  authcontroller.registerBrand.bind(authcontroller),
);

authRouter.post("/register/creator",
  authcontroller.registerCreator.bind(authcontroller),
)


export default authRouter;
