import { z } from "zod";

export const createCustomerOrderSchema = z.object({
  customerId: z.coerce.number().int().positive(),
  tableNumber: z.coerce.number().int().positive(),
  dishType: z.string().trim().min(1),
});

export const createTicketSchema = z.object({
  customerOrderId: z.coerce.number().int().positive(),
  partySize: z.coerce.number().int().positive(),
});

export const createOrderTicketSchema = z.object({
  ticketId: z.coerce.number().int().positive(),
  customerOrderId: z.coerce.number().int().positive(),
});

export const createKitchenOrderSchema = z.object({
  tableNumber: z.coerce.number().int().positive(),
  staffMemberId: z.coerce.number().int().positive(),
});

export const createServiceOrderSchema = z.object({
  tableNumber: z.coerce.number().int().positive(),
  isAlcoholic: z.boolean(),
});

export const createKitchenTicketLogSchema = z.object({
  customerId: z.coerce.number().int().positive(),
  emergencyId: z.string().trim().optional(),
  dispatchTime: z.string().datetime().optional(),
});

export const createEmergencyRequestSchema = z.object({
  orderTicketId: z.coerce.number().int().positive(),
  orderTime: z.string().datetime(),
});

export const createPaymentAreaSchema = z.object({
  emergencyOrderId: z.coerce.number().int().positive(),
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type CreateCustomerOrderInput = z.infer<typeof createCustomerOrderSchema>;
export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type CreateOrderTicketInput = z.infer<typeof createOrderTicketSchema>;
export type CreateKitchenOrderInput = z.infer<typeof createKitchenOrderSchema>;
export type CreateServiceOrderInput = z.infer<typeof createServiceOrderSchema>;
export type CreateKitchenTicketLogInput = z.infer<typeof createKitchenTicketLogSchema>;
export type CreateEmergencyRequestInputType = z.infer<typeof createEmergencyRequestSchema>;
export type CreatePaymentAreaInput = z.infer<typeof createPaymentAreaSchema>;
export type IdParams = z.infer<typeof idParamSchema>;
