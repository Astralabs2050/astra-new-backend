import { Request, Response } from "express";
import DesignService from "../service/design.service";

class designController{
    public createNewDesign  = async(req:Request, res:Response) =>{
        try{
            console.log("reaching the controller")
            const response = await DesignService.generateNewDesign(req.body)
            return res.json(response)
        }catch(error:any){
            return res.status(400).json({
                status: false,
                message: `An error occurred: ${error?.message || error}`,
              });
        }
    }
}

const DesignController = new designController()
export default DesignController