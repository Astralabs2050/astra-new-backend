import { Router } from "express";
import authRouter from "./auth";
import isAuthenticated from "../middleware/authorization";
import messageRouter from "./messageStaff";
import userRouter from './users'

const routes = Router();

routes.use("/auth", authRouter);
routes.use('/message',isAuthenticated,messageRouter);
routes.use('/user',isAuthenticated,userRouter)

routes.get('/',(req,res)=>{
    res.send(`
    <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            text-align: center;
            background-color: #f0f0f0;
          }

          h1 {
            color: #333;
          }

          a {
            color: #4285f4;
            text-decoration: none;
          }

          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <h1>Designed with love by <a href="http://lawblaze.netlify.app/" target="_blank">lawblaze</a></h1>
      </body>
    </html>
  `);
})
export default routes;
