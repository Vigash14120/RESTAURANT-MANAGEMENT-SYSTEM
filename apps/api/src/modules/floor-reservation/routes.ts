import type {
  ApiSuccessResponse,
  FloorTableDto,
  ReservationDetailsDto,
  TableAssignmentDto
} from "@rms/shared-types";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import { Router } from "express";

import {
  createReservationSchema,
  createTableAssignmentSchema,
  floorTableQuerySchema,
  reservationIdParamSchema,
  reservationQuerySchema,
  updateReservationStatusSchema
} from "./schemas.js";
import {
  createReservationRecord,
  createTableAssignmentRecord,
  getFloorTables,
  getReservations,
  updateReservationStatusRecord
} from "./service.js";

type AsyncRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

function asyncHandler(handler: AsyncRouteHandler): RequestHandler {
  return (req, res, next) => {
    void handler(req, res, next).catch(next);
  };
}

export const floorReservationRouter = Router();

floorReservationRouter.get(
  "/floor-tables",
  asyncHandler(async (req, res) => {
    const query = floorTableQuerySchema.parse(req.query);
    const floorTables = await getFloorTables(query.location, query.status);
    const response: ApiSuccessResponse<FloorTableDto[]> = {
      success: true,
      data: floorTables
    };
    res.status(200).json(response);
  })
);

floorReservationRouter.get(
  "/reservations",
  asyncHandler(async (req, res) => {
    const query = reservationQuerySchema.parse(req.query);
    const reservations = await getReservations(query.status);
    const response: ApiSuccessResponse<ReservationDetailsDto[]> = {
      success: true,
      data: reservations
    };
    res.status(200).json(response);
  })
);

floorReservationRouter.post(
  "/reservations",
  asyncHandler(async (req, res) => {
    const body = createReservationSchema.parse(req.body);
    const reservation = await createReservationRecord(body);
    const response: ApiSuccessResponse<ReservationDetailsDto> = {
      success: true,
      data: reservation
    };
    res.status(201).json(response);
  })
);

floorReservationRouter.patch(
  "/reservations/:reservationId/status",
  asyncHandler(async (req, res) => {
    const { reservationId } = reservationIdParamSchema.parse(req.params);
    const body = updateReservationStatusSchema.parse(req.body);
    const reservation = await updateReservationStatusRecord(reservationId, body.status);
    const response: ApiSuccessResponse<ReservationDetailsDto> = {
      success: true,
      data: reservation
    };
    res.status(200).json(response);
  })
);

floorReservationRouter.post(
  "/table-assignments",
  asyncHandler(async (req, res) => {
    const body = createTableAssignmentSchema.parse(req.body);
    const assignment = await createTableAssignmentRecord(body);
    const response: ApiSuccessResponse<TableAssignmentDto> = {
      success: true,
      data: assignment
    };
    res.status(201).json(response);
  })
);
