import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../../db/mysql.js";
import {
  CustomerOrderDto,
  TicketDto,
  OrderTicketDto,
  KitchenOrderDto,
  ServiceOrderDto,
  KitchenTicketLogDto,
  EmergencyRequestDto,
  PaymentAreaDto
} from "@rms/shared-types";

// DB Row Interfaces
interface CustomerOrderRow extends RowDataPacket {
  customer_order_id: number;
  customer_id: number;
  table_number: number;
  dish_type: string;
  time_created: string | Date;
}

interface TicketRow extends RowDataPacket {
  ticket_id: number;
  customer_order_id: number;
  party_size: number;
  created_at: string | Date;
}

interface OrderTicketRow extends RowDataPacket {
  order_ticket_id: number;
  ticket_id: number;
  customer_order_id: number;
  created_at: string | Date;
}

interface KitchenOrderRow extends RowDataPacket {
  kitchen_order_id: number;
  table_number: number;
  staff_member_id: number;
  created_at: string | Date;
}

interface ServiceOrderRow extends RowDataPacket {
  service_order_id: number;
  table_number: number;
  is_alcoholic: number; // BOOLEAN is TINYINT(1)
  created_at: string | Date;
}

interface KitchenTicketLogRow extends RowDataPacket {
  kitchen_ticket_log_id: number;
  customer_id: number;
  emergency_id: string | null;
  dispatch_time: string | Date | null;
  created_at: string | Date;
}

interface EmergencyRequestRow extends RowDataPacket {
  order_id: number;
  order_ticket_id: number;
  order_time: string | Date;
  created_at: string | Date;
}

interface PaymentAreaRow extends RowDataPacket {
  payment_area_id: number;
  emergency_order_id: number;
  created_at: string | Date;
}

// Helpers
function toIsoString(value: string | Date | null): string | null {
  if (value === null) {
    return null;
  }
  const dateValue = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(dateValue.getTime())) {
    return String(value);
  }
  return dateValue.toISOString();
}

function safeIsoString(value: string | Date): string {
  const result = toIsoString(value);
  return result ?? new Date().toISOString();
}

// Mappers
function mapCustomerOrder(row: CustomerOrderRow): CustomerOrderDto {
  return {
    customerOrderId: row.customer_order_id,
    customerId: row.customer_id,
    tableNumber: row.table_number,
    dishType: row.dish_type,
    timeCreated: safeIsoString(row.time_created),
  };
}

function mapTicket(row: TicketRow): TicketDto {
  return {
    ticketId: row.ticket_id,
    customerOrderId: row.customer_order_id,
    partySize: row.party_size,
    createdAt: safeIsoString(row.created_at),
  };
}

function mapOrderTicket(row: OrderTicketRow): OrderTicketDto {
  return {
    orderTicketId: row.order_ticket_id,
    ticketId: row.ticket_id,
    customerOrderId: row.customer_order_id,
    createdAt: safeIsoString(row.created_at),
  };
}

function mapKitchenOrder(row: KitchenOrderRow): KitchenOrderDto {
  return {
    kitchenOrderId: row.kitchen_order_id,
    tableNumber: row.table_number,
    staffMemberId: row.staff_member_id,
    createdAt: safeIsoString(row.created_at),
  };
}

function mapServiceOrder(row: ServiceOrderRow): ServiceOrderDto {
  return {
    serviceOrderId: row.service_order_id,
    tableNumber: row.table_number,
    isAlcoholic: Boolean(row.is_alcoholic),
    createdAt: safeIsoString(row.created_at),
  };
}

function mapKitchenTicketLog(row: KitchenTicketLogRow): KitchenTicketLogDto {
  return {
    kitchenTicketLogId: row.kitchen_ticket_log_id,
    customerId: row.customer_id,
    emergencyId: row.emergency_id,
    dispatchTime: toIsoString(row.dispatch_time),
    createdAt: safeIsoString(row.created_at),
  };
}

function mapEmergencyRequest(row: EmergencyRequestRow): EmergencyRequestDto {
  return {
    orderId: row.order_id,
    orderTicketId: row.order_ticket_id,
    orderTime: safeIsoString(row.order_time),
    createdAt: safeIsoString(row.created_at),
  };
}

function mapPaymentArea(row: PaymentAreaRow): PaymentAreaDto {
  return {
    paymentAreaId: row.payment_area_id,
    emergencyOrderId: row.emergency_order_id,
    createdAt: safeIsoString(row.created_at),
  };
}

// Repositories

export async function createCustomerOrder(
  customerId: number,
  tableNumber: number,
  dishType: string
): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `
      INSERT INTO customer_order (customer_id, table_number, dish_type)
      VALUES (?, ?, ?)
    `,
    [customerId, tableNumber, dishType]
  );
  return result.insertId;
}

export async function getCustomerOrderById(id: number): Promise<CustomerOrderDto | null> {
  const [rows] = await pool.query<CustomerOrderRow[]>(
    "SELECT * FROM customer_order WHERE customer_order_id = ? LIMIT 1",
    [id]
  );
  return rows[0] ? mapCustomerOrder(rows[0]) : null;
}

export async function listCustomerOrders(): Promise<CustomerOrderDto[]> {
  const [rows] = await pool.query<CustomerOrderRow[]>("SELECT * FROM customer_order ORDER BY time_created DESC");
  return rows.map(mapCustomerOrder);
}

export async function createTicket(
  customerOrderId: number,
  partySize: number
): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `
      INSERT INTO ticket (customer_order_id, party_size)
      VALUES (?, ?)
    `,
    [customerOrderId, partySize]
  );
  return result.insertId;
}

export async function getTicketById(id: number): Promise<TicketDto | null> {
  const [rows] = await pool.query<TicketRow[]>(
    "SELECT * FROM ticket WHERE ticket_id = ? LIMIT 1",
    [id]
  );
  return rows[0] ? mapTicket(rows[0]) : null;
}

export async function listTickets(): Promise<TicketDto[]> {
  const [rows] = await pool.query<TicketRow[]>("SELECT * FROM ticket ORDER BY created_at DESC");
  return rows.map(mapTicket);
}

export async function createOrderTicket(
  ticketId: number,
  customerOrderId: number
): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `
      INSERT INTO order_ticket (ticket_id, customer_order_id)
      VALUES (?, ?)
    `,
    [ticketId, customerOrderId]
  );
  return result.insertId;
}

export async function getOrderTicketById(id: number): Promise<OrderTicketDto | null> {
  const [rows] = await pool.query<OrderTicketRow[]>(
    "SELECT * FROM order_ticket WHERE order_ticket_id = ? LIMIT 1",
    [id]
  );
  return rows[0] ? mapOrderTicket(rows[0]) : null;
}

export async function listOrderTickets(): Promise<OrderTicketDto[]> {
  const [rows] = await pool.query<OrderTicketRow[]>("SELECT * FROM order_ticket ORDER BY created_at DESC");
  return rows.map(mapOrderTicket);
}

export async function createKitchenOrder(
  tableNumber: number,
  staffMemberId: number
): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `
      INSERT INTO kitchen_order (table_number, staff_member_id)
      VALUES (?, ?)
    `,
    [tableNumber, staffMemberId]
  );
  return result.insertId;
}

export async function getKitchenOrderById(id: number): Promise<KitchenOrderDto | null> {
  const [rows] = await pool.query<KitchenOrderRow[]>(
    "SELECT * FROM kitchen_order WHERE kitchen_order_id = ? LIMIT 1",
    [id]
  );
  return rows[0] ? mapKitchenOrder(rows[0]) : null;
}

export async function listKitchenOrders(): Promise<KitchenOrderDto[]> {
  const [rows] = await pool.query<KitchenOrderRow[]>("SELECT * FROM kitchen_order ORDER BY created_at DESC");
  return rows.map(mapKitchenOrder);
}

export async function createServiceOrder(
  tableNumber: number,
  isAlcoholic: boolean
): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `
      INSERT INTO service_order (table_number, is_alcoholic)
      VALUES (?, ?)
    `,
    [tableNumber, isAlcoholic]
  );
  return result.insertId;
}

export async function getServiceOrderById(id: number): Promise<ServiceOrderDto | null> {
  const [rows] = await pool.query<ServiceOrderRow[]>(
    "SELECT * FROM service_order WHERE service_order_id = ? LIMIT 1",
    [id]
  );
  return rows[0] ? mapServiceOrder(rows[0]) : null;
}

export async function listServiceOrders(): Promise<ServiceOrderDto[]> {
  const [rows] = await pool.query<ServiceOrderRow[]>("SELECT * FROM service_order ORDER BY created_at DESC");
  return rows.map(mapServiceOrder);
}

export async function createKitchenTicketLog(
  customerId: number,
  emergencyId: string | null,
  dispatchTime: Date | null
): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `
      INSERT INTO kitchen_ticket_log (customer_id, emergency_id, dispatch_time)
      VALUES (?, ?, ?)
    `,
    [customerId, emergencyId, dispatchTime]
  );
  return result.insertId;
}

export async function getKitchenTicketLogById(id: number): Promise<KitchenTicketLogDto | null> {
  const [rows] = await pool.query<KitchenTicketLogRow[]>(
    "SELECT * FROM kitchen_ticket_log WHERE kitchen_ticket_log_id = ? LIMIT 1",
    [id]
  );
  return rows[0] ? mapKitchenTicketLog(rows[0]) : null;
}

export async function listKitchenTicketLogs(): Promise<KitchenTicketLogDto[]> {
  const [rows] = await pool.query<KitchenTicketLogRow[]>("SELECT * FROM kitchen_ticket_log ORDER BY created_at DESC");
  return rows.map(mapKitchenTicketLog);
}

export async function createEmergencyRequest(
  orderTicketId: number,
  orderTime: Date
): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `
      INSERT INTO emergency_request (order_ticket_id, order_time)
      VALUES (?, ?)
    `,
    [orderTicketId, orderTime]
  );
  return result.insertId;
}

export async function getEmergencyRequestById(id: number): Promise<EmergencyRequestDto | null> {
  const [rows] = await pool.query<EmergencyRequestRow[]>(
    "SELECT * FROM emergency_request WHERE order_id = ? LIMIT 1",
    [id]
  );
  return rows[0] ? mapEmergencyRequest(rows[0]) : null;
}

export async function listEmergencyRequests(): Promise<EmergencyRequestDto[]> {
  const [rows] = await pool.query<EmergencyRequestRow[]>("SELECT * FROM emergency_request ORDER BY created_at DESC");
  return rows.map(mapEmergencyRequest);
}

export async function createPaymentArea(
  emergencyOrderId: number
): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `
      INSERT INTO payment_area (emergency_order_id)
      VALUES (?)
    `,
    [emergencyOrderId]
  );
  return result.insertId;
}

export async function getPaymentAreaById(id: number): Promise<PaymentAreaDto | null> {
  const [rows] = await pool.query<PaymentAreaRow[]>(
    "SELECT * FROM payment_area WHERE payment_area_id = ? LIMIT 1",
    [id]
  );
  return rows[0] ? mapPaymentArea(rows[0]) : null;
}

export async function listPaymentAreas(): Promise<PaymentAreaDto[]> {
  const [rows] = await pool.query<PaymentAreaRow[]>("SELECT * FROM payment_area ORDER BY created_at DESC");
  return rows.map(mapPaymentArea);
}
