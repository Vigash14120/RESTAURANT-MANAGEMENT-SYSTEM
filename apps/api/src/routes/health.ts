import type { ApiSuccessResponse, HealthPayload } from "@rms/shared-types";
import { Router } from "express";

const healthRouter = Router();

healthRouter.get("/health", (_req, res) => {
  const response: ApiSuccessResponse<HealthPayload> = {
    success: true,
    data: {
      service: "rms-api",
      status: "ok",
      timestamp: new Date().toISOString()
    }
  };
  res.status(200).json(response);
});

export { healthRouter };
