import express, { Request, Response } from "express";
import { BASE_API, NODE_ENV, PORT } from "./configs/config";
import cors from "cors";
import cookieParser from "cookie-parser";

// bull ui
// import { createBullBoard } from "@bull-board/api";
// import { BullAdapter } from "@bull-board/api/bullAdapter";
// import { ExpressAdapter } from "@bull-board/express";
// import emailQueue from "@/queues/email.queue";

// env variables
const port = PORT;
const baseApi = BASE_API;

// routes
import userRoute from "@/routes/users.route";
import homeRoute from "@/routes/home.route";

// packages
import { logRoutes } from "@/utils/log-routes.util";
import connectDB from "./database/mongo";
import mongoose from "mongoose";
import redisClient from "./database/redis";
import { engine } from "express-handlebars";
// hot reload
import livereload from "livereload";
import connectLiveReload from "connect-livereload";
import path from "path";
import { handlebarsHelpers } from "./utils/handlebars.util";

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

// Create livereload server
// Set up livereload for live reloading in the browser
let liveReloadServer: any = null;
// if (NODE_ENV === "development") {
//   liveReloadServer = livereload.createServer();
//   liveReloadServer.watch(path.join(__dirname, "public")); // Watch the public directory for changes
//   liveReloadServer.watch(path.join(__dirname, "views"));

//   console.log(path.join(__dirname, "public"), path.join(__dirname, "views"));

//   app.use(connectLiveReload());

//   liveReloadServer.server.once("connection", () => {
//     setTimeout(() => {
//       liveReloadServer.refresh("/");
//     }, 100);
//   });

//   console.log("LiveReload listening on", liveReloadServer.config.port);
// }

// set handlebars view engine
app.engine(
  ".hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views", "layouts"),
    partialsDir: path.join(__dirname, "views", "partials"),
    helpers: handlebarsHelpers,
  })
);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views"));

// Serve static files (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, "public")));

// middlewares
app.use(cors(corsOptions)); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(connectLiveReload());

// view routes
app.get("/", homeRoute);

// api routes
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

      // close live server
      // if (liveReloadServer?.server) {
      //   liveReloadServer.server.close(() => {
      //     console.log("LiveReload server closed.");
      //   });
      // }

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
