import { Request, Response } from "express";
import { AuthService } from "../service/auth.service";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public registerBrand = async (req: Request, res: Response) => {
    try {
      const response = await this.authService.registerBrandService(req.body);
      return res.json(response);
    } catch (error: any) {
      return res.status(400).json({
        status: false,
        message: `An error occurred: ${error?.message || error}`,
      });
    }
  };

  // public register = async (req: Request, res: Response) => {
  //   try {
  //     const result = await this.authService.register(req.body);
  //     return res.json(result);
  //   } catch (error: any) {
  //     return res.json({
  //       status: false,
  //       message: `An error occurred: ${error?.message || error}`,
  //     });
  //   }
  // };

  // public login = async (req: Request, res: Response) => {
  //   try {
  //     const result = await this.authService.login(req.body);
  //     return res.json(result);
  //   } catch (error: any) {
  //     return res.json({
  //       status: false,
  //       message: `An error occurred: ${error?.message || error}`,
  //     });
  //   }
  // };

  // public verifyOtp = async (req: Request, res: Response) => {
  //   const otp = req.params?.otp;
  //   if (otp) {
  //     try {
  //       const result = await this.authService.verifyOtp(otp);
  //       return res.json(result);
  //     } catch (err) {
  //       return res.json({
  //         status: false,
  //         message: `An error occurred: ${err}`,
  //       });
  //     }
  //   } else {
  //     return res.json({ status: false, message: "No OTP provided" });
  //   }
  // };

  // public resendOtp = async (req: Request, res: Response) => {
  //   const email = req.params?.email;
  //   if (email) {
  //     try {
  //       const result = await this.authService.resendOtp(email);
  //       return res.json(result);
  //     } catch (err) {
  //       return res.json({
  //         status: false,
  //         message: `An error occurred: ${err}`,
  //       });
  //     }
  //   } else {
  //     return res.json({ status: false, message: "Enter a valid email" });
  //   }
  // };
}
