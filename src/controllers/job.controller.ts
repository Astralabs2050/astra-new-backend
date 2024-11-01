import { Request, Response } from "express";
import JobService from "../service/job.service";

class jobController {
  public createJob = async (req: Request, res: Response) => {
    try {
      const { id } = (req as any)?.user;
      const response = await JobService.createJob(req.body, id);
      return res.json(response);
    } catch (error: any) {
      return res.status(400).json({
        status: false,
        message: `An error occurred: ${error?.message || error}`,
      });
    }
  };

  public getJob = async (req: Request, res: Response) => {
    try {
      const { id } = (req as any)?.user;
      const { status } = req.params;
      const response = await JobService.getJob(id, status);
      return res.json(response);
    } catch (error: any) {
      return res.status(400).json({
        status: false,
        message: `An error occurred: ${error?.message || error}`,
      });
    }
  };

  public applyJob = async (req: Request, res: Response) => {
    try {
      const { id } = (req as any)?.user;
      const { status } = req.params;
      const response = await JobService.getJob(id, status);
      return res.json(response);
    } catch (error: any) {
      return res.status(400).json({
        status: false,
        message: `An error occurred: ${error?.message || error}`,
      });
    }
  };
}
const JobController = new jobController();
export default JobController;
