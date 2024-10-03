import { Router } from "express";
import authRouter from "./auth";
import isAuthenticated from "../middleware/authorization";
import userRouter from "./users";

const routes = Router();

routes.use("/auth", authRouter);
routes.use("/user", isAuthenticated, userRouter);

routes.get("/", (req, res) => {
  res.send("working");
});
export default routes;
