// types.d.ts
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: any; // Define the structure of your user object
    }
  }
}
