"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./configs/config");
const cors_1 = __importDefault(require("cors"));
// env variables
const port = config_1.PORT;
const baseApi = config_1.BASE_API;
// routes
const users_route_1 = __importDefault(require("@/routes/users.route"));
const log_routes_util_1 = require("@/utils/log-routes.util");
const app = (0, express_1.default)();
// cors options
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g., mobile apps, curl) or any origin
        callback(null, origin || "*");
    },
    credentials: true, // Allow cookies and auth headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Explicitly allow methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
};
// middlewares
app.use((0, cors_1.default)()); // Enable CORS for all routes
app.use(express_1.default.json()); // Parse JSON bodies
app.use(express_1.default.urlencoded({ extended: true }));
// index route
app.get(baseApi + "/", (req, res) => {
    res.send("this is a dating app api");
});
// register routes
app.use(baseApi + "/users", users_route_1.default);
// catch  all route
app.get("*", (req, res) => {
    res.status(404).json({ message: "Route not found" });
});
// Start HTTP server
const server = app.listen(port, () => {
    console.log(`HTTP Server running at http://localhost:${port}`);
});
// log routes
console.log("***************************");
(0, log_routes_util_1.logRoutes)(app);
console.log("***************************");
// Cleanup on exit
const cleanup = () => {
    console.log("Shutting down server...");
    server.close(() => {
        console.log("Server closed.");
        process.exit(0);
    });
};
// Handle process termination signals
process.on("SIGINT", cleanup); // Ctrl+C
process.on("SIGTERM", cleanup); // Termination signal (e.g., kill)
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    cleanup();
});
