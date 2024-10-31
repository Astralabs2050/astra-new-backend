import { Request, Response } from "express";
import DesignService from "../service/design.service";

class designController {
  public createNewDesign = async (req: Request, res: Response) => {
    try {
      console.log("reaching the controller");
      const { id } = (req as any)?.user;
      const response = await DesignService.generateNewDesign(req.body,id);
      return res.json(response);
    } catch (error: any) {
      return res.status(400).json({
        status: false,
        message: `An error occurred: ${error?.message || error}`,
      });
    }
  };

  public uploadNewDesign = async (req: Request, res: Response) => {
    try {
      const { id } = (req as any)?.user;
      const response = await DesignService.uploadNewDesign(req.body, id);
      return res.json(response);
    } catch (error: any) {
      return res.status(400).json({
        status: false,
        message: `An error occurred: ${error?.message || error}`,
      });
    }
  };

  public addCreatorToDesign = async (req: Request, res: Response) => {
    try{
      const {designId} = req.params

    }catch(error:any){
      return res.status(400).json({
        status: false,
        message: `An error occurred: ${error?.message || error}`,
      });
    }
  };
}

const DesignController = new designController();
export default DesignController;
