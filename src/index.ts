import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { initDB } from "./db";
import routes from "./routes";
import cors from "cors";
import * as dotenv from "dotenv";
import { errors } from "celebrate";
import { handleSocketConnection } from "./socket";
import portfinder from "portfinder";
import bodyParser = require("body-parser");

dotenv.config();

const app = express();
app.use(bodyParser.json({ limit: '50mb' })); // Set the limit to an appropriate value
// ENABLE CORS
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with the origin of your React app
    credentials: true,
  }),
);

const secretKey: any = process.env.JWT_SECRET;

async function startServer() {
  let port = 3001;

  try {
    // Try to get an available port dynamically, starting from 3001
    port = await portfinder.getPortPromise({ port: port });
  } catch (error: any) {
    console.error("Error finding an available port:", error.message);
    // If an error occurs (e.g., no available ports), use a different port
    port = 3002;
  }

  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.HOST_URL || "http://localhost:3000", // Replace with the origin of
    },
  });

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
}

startServer().catch((error) => {
  console.error("Error starting the server:", error.message);
  process.exit(1);
});
