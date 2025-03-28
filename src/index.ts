import express, { Request, Response } from "express";
import { BASE_API, PORT } from "./configs/config";
import cors from "cors";
import cookieParser from "cookie-parser";

// bull ui
import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { ExpressAdapter } from "@bull-board/express";
import emailQueue from "@/queues/email.queue";

// env variables
const port = PORT;
const baseApi = BASE_API;

// routes
import userRoute from "@/routes/users.route";
import { logRoutes } from "@/utils/log-routes.util";
import connectDB from "./database/mongo";
import mongoose from "mongoose";
import redisClient from "./database/redis";
import printQueueStatus from "./utils/print-queue.util";

const app = express();

// cors options
const corsOptions: any = {
  origin: (origin: string, callback: Function) => {
    // Allow requests with no origin (e.g., mobile apps, curl) or any origin
    callback(null, origin || "*");
  },
  credentials: true, // Allow cookies and auth headers
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Explicitly allow methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
};

// middlewares
app.use(cors(corsOptions)); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// index route
app.get(baseApi + "/", (req: Request, res: Response) => {
  res.send("this is a dating app api");
});

// register routes
app.use(baseApi + "/users", userRoute);

// catch  all route
app.get("*", (req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// Start HTTP server and connect to MongoDB
const startServer = async () => {
  await connectDB(); // Connect to MongoDB

  // redis connect
  redisClient.connect();

  // http server
  const server = app.listen(port, () => {
    console.log(`HTTP Server running at http://localhost:${port}`);
  });

  // Set up Bull-Board
  // const serverAdapter = new ExpressAdapter();
  // serverAdapter.setBasePath("/admin/queues"); // Base path for the UI

  // const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  //   queues: [new BullAdapter(emailQueue)],
  //   serverAdapter: serverAdapter,
  // });

  // // Mount the Bull-Board UI on your Express app
  // app.use("/admin/queues", serverAdapter.getRouter());

  // Log routes
  console.log("***************************");
  logRoutes(app);
  console.log("***************************");

  // Cleanup on exit
  const cleanup = () => {
    console.log("Shutting down server...");
    server.close(async () => {
      console.log("Server closed.");
      await mongoose.connection.close(); // Close MongoDB connection

      // close redis
      await redisClient.disconnect(); // Ensure proper disconnection

      console.log("MongoDB connection closed.");
      process.exit(0);
    });
  };

  process.on("SIGINT", cleanup); // Ctrl+C
  process.on("SIGTERM", cleanup); // Termination signal (e.g., kill)
  process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    cleanup();
  });
};

startServer();
