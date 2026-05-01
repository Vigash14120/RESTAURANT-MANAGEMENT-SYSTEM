import type {
  FloorTableDto,
  FloorTableStatusFilter,
  ReservationDetailsDto,
  ReservationStatusName,
  TableAssignmentDto
} from "@rms/shared-types";

import { ApiHttpError } from "../../middleware/error-handler.js";
import type { CreateReservationInput, CreateTableAssignmentInput } from "./schemas.js";
import {
  createReservation,
  createTableAssignment,
  getReservationById,
  getReservationStatusIdByName,
  getTableAssignmentById,
  getTableByNumber,
  hasReservationOverlap,
  listFloorTables,
  listReservations,
  updateReservationStatus
} from "./repository.js";

const validReservationTransitions: Record<ReservationStatusName, ReservationStatusName[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled"],
  cancelled: [],
  completed: []
};

function normalizeReservationStatus(value: string): ReservationStatusName {
  if (value === "pending" || value === "confirmed" || value === "cancelled" || value === "completed") {
    return value;
  }
  throw new ApiHttpError(500, "INVALID_STATUS_DATA", `Unexpected reservation status "${value}".`);
}

export async function getFloorTables(
  location?: string,
  status?: FloorTableStatusFilter
): Promise<FloorTableDto[]> {
  const floorTables = await listFloorTables();

  return floorTables
    .map((floorTable) => {
      const activeStatus = floorTable.activeReservationStatus
        ? normalizeReservationStatus(floorTable.activeReservationStatus)
        : null;
      return {
        tableNumber: floorTable.tableNumber,
        capacity: floorTable.capacity,
        location: floorTable.location,
        servedByStaffMemberId: floorTable.servedByStaffMemberId,
        activeReservationId: floorTable.activeReservationId,
        activeReservationTime: floorTable.activeReservationTime,
        activeReservationStatus: activeStatus,
        activePartySize: floorTable.activePartySize,
        availability: floorTable.activeReservationId ? "reserved" : "available"
      } satisfies FloorTableDto;
    })
    .filter((floorTable) => {
      if (location && !floorTable.location.toLowerCase().includes(location.toLowerCase())) {
        return false;
      }
      if (!status) {
        return true;
      }
      if (status === "available" || status === "reserved") {
        return floorTable.availability === status;
      }
      return floorTable.activeReservationStatus === status;
    });
}

export async function getReservations(status?: ReservationStatusName): Promise<ReservationDetailsDto[]> {
  const reservations = await listReservations(status);
  return reservations.map((reservation) => ({
    reservationId: reservation.reservationId,
    tableNumber: reservation.tableNumber,
    reservationTime: reservation.reservationTime,
    status: normalizeReservationStatus(reservation.status),
    partySize: reservation.partySize,
    capacity: reservation.capacity,
    location: reservation.location
  }));
}

export async function createReservationRecord(
  input: CreateReservationInput
): Promise<ReservationDetailsDto> {
  const reservationTime = new Date(input.reservationTime);
  if (Number.isNaN(reservationTime.getTime())) {
    throw new ApiHttpError(400, "INVALID_RESERVATION_TIME", "Reservation time is invalid.");
  }

  const table = await getTableByNumber(input.tableNumber);
  if (!table) {
    throw new ApiHttpError(404, "TABLE_NOT_FOUND", `Table ${input.tableNumber} does not exist.`);
  }

  if (input.partySize > table.capacity) {
    throw new ApiHttpError(
      409,
      "CAPACITY_EXCEEDED",
      `Party size ${input.partySize} exceeds table capacity ${table.capacity}.`
    );
  }

  const reservationStatus = input.status ?? "pending";
  const reservationStatusId = await getReservationStatusIdByName(reservationStatus);
  if (!reservationStatusId) {
    throw new ApiHttpError(400, "RESERVATION_STATUS_NOT_FOUND", "Invalid reservation status.");
  }

  const overlapExists = await hasReservationOverlap(input.tableNumber, reservationTime, null);
  if (overlapExists) {
    throw new ApiHttpError(
      409,
      "RESERVATION_CONFLICT",
      "A conflicting reservation already exists for this table within the 2-hour slot."
    );
  }

  const reservationId = await createReservation(
    input.tableNumber,
    reservationTime,
    reservationStatusId,
    input.partySize
  );
  const reservation = await getReservationById(reservationId);
  if (!reservation) {
    throw new ApiHttpError(500, "RESERVATION_CREATE_FAILED", "Failed to load created reservation.");
  }

  return {
    reservationId: reservation.reservationId,
    tableNumber: reservation.tableNumber,
    reservationTime: reservation.reservationTime,
    status: normalizeReservationStatus(reservation.status),
    partySize: reservation.partySize,
    capacity: reservation.capacity,
    location: reservation.location
  };
}

export async function updateReservationStatusRecord(
  reservationId: number,
  nextStatus: ReservationStatusName
): Promise<ReservationDetailsDto> {
  const reservation = await getReservationById(reservationId);
  if (!reservation) {
    throw new ApiHttpError(404, "RESERVATION_NOT_FOUND", `Reservation ${reservationId} was not found.`);
  }

  const currentStatus = normalizeReservationStatus(reservation.status);
  const allowedTransitions = validReservationTransitions[currentStatus];
  if (!allowedTransitions.includes(nextStatus)) {
    throw new ApiHttpError(
      409,
      "INVALID_STATUS_TRANSITION",
      `Cannot transition reservation from ${currentStatus} to ${nextStatus}.`
    );
  }

  if (nextStatus === "confirmed") {
    const overlapExists = await hasReservationOverlap(
      reservation.tableNumber,
      new Date(reservation.reservationTime),
      reservationId
    );
    if (overlapExists) {
      throw new ApiHttpError(
        409,
        "RESERVATION_CONFLICT",
        "A conflicting reservation exists for this table and time slot."
      );
    }
  }

  const reservationStatusId = await getReservationStatusIdByName(nextStatus);
  if (!reservationStatusId) {
    throw new ApiHttpError(400, "RESERVATION_STATUS_NOT_FOUND", "Invalid reservation status.");
  }

  await updateReservationStatus(reservationId, reservationStatusId);
  const updatedReservation = await getReservationById(reservationId);
  if (!updatedReservation) {
    throw new ApiHttpError(500, "RESERVATION_UPDATE_FAILED", "Failed to load updated reservation.");
  }

  return {
    reservationId: updatedReservation.reservationId,
    tableNumber: updatedReservation.tableNumber,
    reservationTime: updatedReservation.reservationTime,
    status: normalizeReservationStatus(updatedReservation.status),
    partySize: updatedReservation.partySize,
    capacity: updatedReservation.capacity,
    location: updatedReservation.location
  };
}

export async function createTableAssignmentRecord(
  input: CreateTableAssignmentInput
): Promise<TableAssignmentDto> {
  const table = await getTableByNumber(input.tableNumber);
  if (!table) {
    throw new ApiHttpError(404, "TABLE_NOT_FOUND", `Table ${input.tableNumber} does not exist.`);
  }

  if (input.reservationId !== undefined) {
    const reservation = await getReservationById(input.reservationId);
    if (!reservation) {
      throw new ApiHttpError(
        404,
        "RESERVATION_NOT_FOUND",
        `Reservation ${input.reservationId} was not found.`
      );
    }
    if (reservation.tableNumber !== input.tableNumber) {
      throw new ApiHttpError(
        409,
        "RESERVATION_TABLE_MISMATCH",
        "Reservation does not belong to the provided table."
      );
    }
  }

  const assignmentId = await createTableAssignment(
    input.tableNumber,
    input.reservationId ?? null,
    input.menuPrice ?? null
  );
  const assignment = await getTableAssignmentById(assignmentId);
  if (!assignment) {
    throw new ApiHttpError(
      500,
      "TABLE_ASSIGNMENT_CREATE_FAILED",
      "Failed to load created table assignment."
    );
  }

  return {
    assignmentId: assignment.assignmentId,
    tableNumber: assignment.tableNumber,
    reservationId: assignment.reservationId,
    menuPrice: assignment.menuPrice,
    createdAt: assignment.createdAt
  };
}
