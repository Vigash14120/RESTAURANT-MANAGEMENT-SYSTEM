import cors from "cors";
import express from "express";

import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";
import { healthRouter } from "./routes/health.js";

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/api", healthRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
