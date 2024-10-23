import { Router } from "express";
import authRouter from "./auth";
import isAuthenticated from "../middleware/authorization";
import userRouter from "./users";
import designRouter from "./design";

const routes = Router();

routes.use("/auth", authRouter);
routes.use("/user", isAuthenticated, userRouter);
routes.use("/design", isAuthenticated, designRouter);
routes.get("/", (req, res) => {
  res.send("working now2");
});
export default routes;
