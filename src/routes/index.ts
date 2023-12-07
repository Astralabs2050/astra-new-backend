import { Router } from "express";
import authRouter from "./auth";
import isAuthenticated from "../middleware/authorization";
import messageRouter from "./messageStaff";
import userRouter from "./users";
import { welcomeScreen } from "../../template/welcome";

const routes = Router();

routes.use("/auth", authRouter);
routes.use("/message", isAuthenticated, messageRouter);
routes.use("/user", isAuthenticated, userRouter);

routes.get("/", (req, res) => {
  res.send(welcomeScreen);
});
export default routes;
