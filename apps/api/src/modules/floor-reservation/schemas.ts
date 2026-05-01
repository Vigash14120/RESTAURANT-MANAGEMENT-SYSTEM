import { reservationStatusNames } from "@rms/shared-types";
import { z } from "zod";

const reservationStatusSchema = z.enum(reservationStatusNames);

const floorTableStatusFilterSchema = z.union([
  z.literal("available"),
  z.literal("reserved"),
  reservationStatusSchema
]);

export const floorTableQuerySchema = z.object({
  location: z.string().trim().min(1).optional(),
  status: floorTableStatusFilterSchema.optional()
});

export const reservationQuerySchema = z.object({
  status: reservationStatusSchema.optional()
});

export const createReservationSchema = z.object({
  tableNumber: z.coerce.number().int().positive(),
  reservationTime: z.string().datetime(),
  partySize: z.coerce.number().int().positive(),
  status: reservationStatusSchema.optional()
});

export const updateReservationStatusSchema = z.object({
  status: reservationStatusSchema
});

export const reservationIdParamSchema = z.object({
  reservationId: z.coerce.number().int().positive()
});

export const createTableAssignmentSchema = z.object({
  tableNumber: z.coerce.number().int().positive(),
  reservationId: z.coerce.number().int().positive().optional(),
  menuPrice: z.coerce.number().nonnegative().optional()
});

export type FloorTableQuery = z.infer<typeof floorTableQuerySchema>;
export type ReservationQuery = z.infer<typeof reservationQuerySchema>;
export type CreateReservationInput = z.infer<typeof createReservationSchema>;
export type UpdateReservationStatusInput = z.infer<typeof updateReservationStatusSchema>;
export type ReservationIdParams = z.infer<typeof reservationIdParamSchema>;
export type CreateTableAssignmentInput = z.infer<typeof createTableAssignmentSchema>;
