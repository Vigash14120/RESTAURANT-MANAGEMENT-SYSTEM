import cors from "cors";
import express from "express";

import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";
import { floorReservationRouter } from "./modules/floor-reservation/routes.js";
import { inventoryMaintenanceRouter } from "./modules/inventory-maintenance/routes.js";
import { ordersKitchenRouter } from "./modules/orders-kitchen/routes.js";
import { staffingDashboardRouter } from "./modules/staffing-dashboard/routes.js";
import { healthRouter } from "./routes/health.js";

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/api", healthRouter);
  app.use("/api", floorReservationRouter);
  app.use("/api", ordersKitchenRouter);
  app.use("/api", inventoryMaintenanceRouter);
  app.use("/api", staffingDashboardRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
