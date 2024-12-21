"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
const bodyParser = require("body-parser");
const socket_io_1 = require("socket.io"); // Import Socket.IO
dotenv.config();
const app = (0, express_1.default)();
app.use(bodyParser.json({ limit: "100mb" })); // Set the limit to an appropriate value
// ENABLE CORS
const allowedOrigins = [
    "http://localhost:3000",
    "http://51.20.37.218:3004",
    "http://51.20.37.218:3005/",
    // Add more origins as needed
];
app.use((0, cors_1.default)({
    origin: allowedOrigins, // Replace with the origin of your React app
    credentials: true,
}));
async function startServer() {
    // try {
    //   // Try to get an available port dynamically, starting from 3001
    //   port = await portfinder.getPortPromise({ port: port });
    // } catch (error: any) {
    //   console.error("Error finding an available port:", error.message);
    //   // If an error occurs (e.g., no available ports), use a different port
    //   port = 3002;
    // }
    const httpServer = (0, http_1.createServer)(app);
    // Create Socket.IO server
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: allowedOrigins, // Allow frontend port
        },
    });
    //handle socke connection
    //handleSocketConnection(io);
    // PARSE JSON
    app.use(express_1.default.json());
    // Database connection
    //initDB();
    // Routes
    app.use(routes_1.default);
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
