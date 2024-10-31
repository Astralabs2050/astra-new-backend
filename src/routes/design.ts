import { Router } from "express";
import DesignController from "../controllers/design.controller";
import isAuthenticated from "../middleware/authorization";

const designRouter = Router();

designRouter.post(
  "/create-design",
  isAuthenticated,
  DesignController.createNewDesign,
);

designRouter.post(
  "/post-design",
  isAuthenticated,
  DesignController.uploadNewDesign,
);

designRouter.patch("/add-creator", isAuthenticated);

export default designRouter;
