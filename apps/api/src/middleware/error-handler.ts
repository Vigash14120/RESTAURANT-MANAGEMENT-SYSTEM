import type { ApiErrorResponse } from "@rms/shared-types";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export class ApiHttpError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  public constructor(statusCode: number, code: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new ApiHttpError(404, "NOT_FOUND", `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof ZodError) {
    const response: ApiErrorResponse = {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed.",
        details: error.issues.map((issue) => ({
          code: issue.code,
          field: issue.path.join("."),
          message: issue.message
        }))
      }
    };
    res.status(400).json(response);
    return;
  }

  if (error instanceof ApiHttpError) {
    const response: ApiErrorResponse = {
      success: false,
      error: {
        code: error.code,
        message: error.message
      }
    };
    res.status(error.statusCode).json(response);
    return;
  }

  console.error("Unhandled API error.", error);
  const response: ApiErrorResponse = {
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred."
    }
  };
  res.status(500).json(response);
}
