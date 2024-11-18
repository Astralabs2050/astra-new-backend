import { Router } from "express";
import isAuthenticated from "../middleware/authorization";
import JobController from "../controllers/job.controller";

const jobRouter = Router();

jobRouter.post("/create-job", isAuthenticated, JobController.createJob);
jobRouter.get("/get-job", isAuthenticated, JobController.getJob);
jobRouter.get('/get-all-job', isAuthenticated, JobController.getAllJobs)
jobRouter.post("/apply-job", isAuthenticated, JobController.applyJob);
jobRouter.get(
  "/job-application",
  isAuthenticated,
  JobController.getJobApplicants,
);

export default jobRouter;
