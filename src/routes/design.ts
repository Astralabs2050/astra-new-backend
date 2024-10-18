import { Router } from "express";
import DesignController from "../controllers/design.controller";
import isAuthenticated from "../middleware/authorization";

const designRouter = Router()

designRouter.post('/create-design',isAuthenticated, DesignController.createNewDesign)



export default designRouter