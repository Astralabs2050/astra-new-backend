import { Router } from "express";
import isAuthenticated from "../middleware/authorization";
import JobController from "../controllers/job.controller";

const jobRouter = Router();

jobRouter.post("/create-job", isAuthenticated, JobController.createJob);
jobRouter.get("/get-job", isAuthenticated, JobController.getJob);
jobRouter.post("/apply-job", isAuthenticated, JobController.applyJob);

export default jobRouter;
