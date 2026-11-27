import express from "express";
import helmet from "helmet";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import { config } from "./config.js";
import tasksRouter from "./routes/tasks.js";
import { notFound, errorHandler } from "./middleware/errors.js";

export function createApp() {
  const app = express();

  if (config.trustProxy) app.set("trust proxy", config.trustProxy);

  // Secure HTTP headers (also hides "X-Powered-By: Express").
  app.use(helmet());

  // Only the listed frontend addresses may call the API from a browser.
  app.use(cors({
    origin: config.allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
    maxAge: 600
  }));

  // Health check for Render (no login, no data).
  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  // Limit how many requests one IP address can make.
  app.use("/api", rateLimit({
    windowMs: config.rateLimitWindowMs,
    limit: config.rateLimitMax,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { error: "Too many requests. Please slow down and try again later." }
  }));

  // Parse JSON bodies, max 10 KB (a task title is at most 100 characters).
  app.use("/api", express.json({ limit: "10kb", strict: true }));

  app.use("/api/tasks", tasksRouter);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
