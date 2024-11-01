import { Request, Response } from "express";
import JobService from "../service/job.service";

class jobController {
    public createJob = async(req:Request,res:Response)=>{
        try{
            const response = await JobService.createJob(req.body)
            return res.json(response)
        }catch(error:any){
            return res.status(400).json({
                status: false,
                message: `An error occurred: ${error?.message || error}`,
              });
        }
    }
}
const JobController = new jobController();
export default JobController