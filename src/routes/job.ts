import { Router } from "express";
import isAuthenticated from "../middleware/authorization";
import JobController from "../controllers/job.controller";

const jobRouter = Router();

jobRouter.post('/create-job',isAuthenticated, JobController.createJob)


export default jobRouter