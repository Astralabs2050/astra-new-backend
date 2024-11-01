import { Router } from "express";
import authRouter from "./auth";
import isAuthenticated from "../middleware/authorization";
import userRouter from "./users";
import designRouter from "./design";
import jobRouter from "./job";

const routes = Router();

routes.use("/auth", authRouter);
routes.use("/user", isAuthenticated, userRouter);
routes.use("/design", designRouter);
routes.use("/job", jobRouter);
routes.get("/", (req, res) => {
  res.send("working now2");
});
export default routes;
