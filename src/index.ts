import express from "express";
import { createServer } from "http";
import { initDB } from "./db";
import routes from "./routes";
import cors from "cors";
import * as dotenv from "dotenv";
import portfinder from "portfinder";
import bodyParser = require("body-parser");

dotenv.config();

const app = express();
app.use(bodyParser.json({ limit: "100mb" })); // Set the limit to an appropriate value
// ENABLE CORS
const allowedOrigins = [
  "http://localhost:3000",
  // Add more origins as needed
];

app.use(
  cors({
    origin: allowedOrigins, // Replace with the origin of your React app
    credentials: true,
  }),
);

async function startServer() {
  let port = 3001;

  // try {
  //   // Try to get an available port dynamically, starting from 3001
  //   port = await portfinder.getPortPromise({ port: port });
  // } catch (error: any) {
  //   console.error("Error finding an available port:", error.message);
  //   // If an error occurs (e.g., no available ports), use a different port
  //   port = 3002;
  // }

  const httpServer = createServer(app);

  // PARSE JSON
  app.use(express.json());
  // Database connection
  initDB();

  // Routes
  app.use(routes);

  httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`connect http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error("Error starting the server:", error.message);
  process.exit(1);
});
