import { Router } from "express";
import isAuthenticated from "../middleware/authorization";
import JobController from "../controllers/job.controller";

const jobRouter = Router();

jobRouter.post("/create-job", isAuthenticated, JobController.createJob);
jobRouter.get("/get-job", isAuthenticated, JobController.getJob);
jobRouter.get("/get-all-job", isAuthenticated, JobController.getAllJobs);
jobRouter.get("/get-job/:id", isAuthenticated, JobController.getEachJob);
jobRouter.post("/apply-job", isAuthenticated, JobController.applyJob);
jobRouter.post("/save-job", isAuthenticated, JobController.saveJob);
jobRouter.get("/save-job", isAuthenticated, JobController.getSaveJob);
jobRouter.patch(
  "/appcept-reject-job",
  isAuthenticated,
  JobController.acceptDeclineJob,
);
jobRouter.get(
  "/job-application",
  isAuthenticated,
  JobController.getJobApplicants,
);

export default jobRouter;
