import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { initDB } from "./db";
import routes from "./routes";
import cors from "cors";
import * as dotenv from "dotenv";
import { errors } from "celebrate";
import { handleSocketConnection } from "./socket";

dotenv.config();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });
const port = process.env.APP_PORT || 3001;
const secretKey: any = process.env.JWT_SECRET;

// ENABLE CORS
app.use(cors());
// Middleware to handle validation errors
app.use(errors());
// PARSE JSON
app.use(express.json());
// Database connection
initDB();
// Socket.IO handling
handleSocketConnection(io);

// Routes
app.use(routes);

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
