import express from "express";
import { createServer } from "http";
import { initDB } from "./db";
import routes from "./routes";
import cors from "cors";
import * as dotenv from "dotenv";
import portfinder from "portfinder";
import bodyParser = require("body-parser");
import { Server as SocketIOServer } from "socket.io"; // Import Socket.IO
import { handleSocketConnection } from "./socket";

dotenv.config();

const app = express();
app.use(bodyParser.json({ limit: "100mb" })); // Set the limit to an appropriate value
// ENABLE CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://51.20.37.218:3004",
  "http://51.20.37.218:3005/",
  // Add more origins as needed
];

app.use(
  cors({
    origin: allowedOrigins, // Replace with the origin of your React app
    credentials: true,
  }),
);

async function startServer() {
  // try {
  //   // Try to get an available port dynamically, starting from 3001
  //   port = await portfinder.getPortPromise({ port: port });
  // } catch (error: any) {
  //   console.error("Error finding an available port:", error.message);
  //   // If an error occurs (e.g., no available ports), use a different port
  //   port = 3002;
  // }

  const httpServer = createServer(app);
  // Create Socket.IO server
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: allowedOrigins, // Allow frontend port
    },
  });

  //handle socke connection
  handleSocketConnection(io);

  // PARSE JSON
  app.use(express.json());
  // Database connection
  initDB();

  // Routes
  app.use(routes);
  const PORT = Number(process.env.APP_URL) || 3002;
  httpServer.listen(PORT, "0.0.0.0", () => {
    // Ensure that PORT is a number
    console.log(`Server is running on port ${PORT}`);
    console.log(`connect http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Error starting the server:", error.message);
  process.exit(1);
});
