import type { RowDataPacket, ResultSetHeader } from "mysql2";

import { pool } from "../../db/mysql.js";

interface FloorTableRow extends RowDataPacket {
  table_number: number;
  capacity: number;
  location: string;
  served_by_staff_member_id: number | null;
  active_reservation_id: number | null;
  active_reservation_time: string | Date | null;
  active_reservation_status: string | null;
  active_party_size: number | null;
}

interface ReservationRow extends RowDataPacket {
  reservation_id: number;
  table_number: number;
  reservation_time: string | Date;
  reservation_status: string;
  party_size: number;
  capacity: number;
  location: string;
}

interface ReservationStatusRow extends RowDataPacket {
  reservation_status_id: number;
}

interface TableRow extends RowDataPacket {
  table_number: number;
  capacity: number;
  location: string | null;
}

interface CountRow extends RowDataPacket {
  total: number;
}

interface TableAssignmentRow extends RowDataPacket {
  assignment_id: number;
  table_number: number;
  reservation_id: number | null;
  menu_price: string | number | null;
  created_at: string | Date;
}

export interface FloorTableRecord {
  tableNumber: number;
  capacity: number;
  location: string;
  servedByStaffMemberId: number | null;
  activeReservationId: number | null;
  activeReservationTime: string | null;
  activeReservationStatus: string | null;
  activePartySize: number | null;
}

export interface ReservationRecord {
  reservationId: number;
  tableNumber: number;
  reservationTime: string;
  status: string;
  partySize: number;
  capacity: number;
  location: string;
}

export interface TableAssignmentRecord {
  assignmentId: number;
  tableNumber: number;
  reservationId: number | null;
  menuPrice: number | null;
  createdAt: string;
}

export interface TableRecord {
  tableNumber: number;
  capacity: number;
  location: string;
}

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

function toNumber(value: string | number | null): number | null {
  if (value === null) {
    return null;
  }
  return typeof value === "number" ? value : Number(value);
}

function mapFloorTable(row: FloorTableRow): FloorTableRecord {
  return {
    tableNumber: row.table_number,
    capacity: row.capacity,
    location: row.location,
    servedByStaffMemberId: row.served_by_staff_member_id,
    activeReservationId: row.active_reservation_id,
    activeReservationTime: toIsoString(row.active_reservation_time),
    activeReservationStatus: row.active_reservation_status,
    activePartySize: row.active_party_size
  };
}

function mapReservation(row: ReservationRow): ReservationRecord {
  return {
    reservationId: row.reservation_id,
    tableNumber: row.table_number,
    reservationTime: toIsoString(row.reservation_time) ?? new Date(row.reservation_time).toISOString(),
    status: row.reservation_status,
    partySize: row.party_size,
    capacity: row.capacity,
    location: row.location
  };
}

function mapTableAssignment(row: TableAssignmentRow): TableAssignmentRecord {
  return {
    assignmentId: row.assignment_id,
    tableNumber: row.table_number,
    reservationId: row.reservation_id,
    menuPrice: toNumber(row.menu_price),
    createdAt: toIsoString(row.created_at) ?? new Date(row.created_at).toISOString()
  };
}

export async function listFloorTables(): Promise<FloorTableRecord[]> {
  const [rows] = await pool.query<FloorTableRow[]>(
    `
      SELECT
        ft.table_number,
        ft.capacity,
        ft.location,
        ft.served_by_staff_member_id,
        r.reservation_id AS active_reservation_id,
        r.reservation_time AS active_reservation_time,
        rs.name AS active_reservation_status,
        r.party_size AS active_party_size
      FROM floor_table ft
      LEFT JOIN reservation r ON r.reservation_id = (
        SELECT r2.reservation_id
        FROM reservation r2
        JOIN reservation_status rs2
          ON rs2.reservation_status_id = r2.reservation_status_id
        WHERE r2.table_number = ft.table_number
          AND rs2.name IN ('pending', 'confirmed')
          AND r2.reservation_time >= DATE_SUB(NOW(), INTERVAL 2 HOUR)
        ORDER BY r2.reservation_time ASC
        LIMIT 1
      )
      LEFT JOIN reservation_status rs
        ON rs.reservation_status_id = r.reservation_status_id
      ORDER BY ft.table_number ASC
    `
  );

  return rows.map(mapFloorTable);
}

export async function listReservations(status?: string): Promise<ReservationRecord[]> {
  const [rows] = await pool.query<ReservationRow[]>(
    `
      SELECT
        r.reservation_id,
        r.table_number,
        r.reservation_time,
        r.party_size,
        rs.name AS reservation_status,
        ft.capacity,
        ft.location
      FROM reservation r
      JOIN reservation_status rs
        ON rs.reservation_status_id = r.reservation_status_id
      JOIN floor_table ft
        ON ft.table_number = r.table_number
      WHERE (? IS NULL OR rs.name = ?)
      ORDER BY r.reservation_time DESC
    `,
    [status ?? null, status ?? null]
  );

  return rows.map(mapReservation);
}

export async function getReservationById(reservationId: number): Promise<ReservationRecord | null> {
  const [rows] = await pool.query<ReservationRow[]>(
    `
      SELECT
        r.reservation_id,
        r.table_number,
        r.reservation_time,
        r.party_size,
        rs.name AS reservation_status,
        ft.capacity,
        ft.location
      FROM reservation r
      JOIN reservation_status rs
        ON rs.reservation_status_id = r.reservation_status_id
      JOIN floor_table ft
        ON ft.table_number = r.table_number
      WHERE r.reservation_id = ?
      LIMIT 1
    `,
    [reservationId]
  );

  const [row] = rows;
  return row ? mapReservation(row) : null;
}

export async function getReservationStatusIdByName(statusName: string): Promise<number | null> {
  const [rows] = await pool.query<ReservationStatusRow[]>(
    "SELECT reservation_status_id FROM reservation_status WHERE name = ? LIMIT 1",
    [statusName]
  );
  return rows[0]?.reservation_status_id ?? null;
}

export async function getTableByNumber(tableNumber: number): Promise<TableRecord | null> {
  const [rows] = await pool.query<TableRow[]>(
    `
      SELECT
        t.table_number,
        t.capacity,
        ft.location
      FROM \`tables\` t
      LEFT JOIN floor_table ft
        ON ft.table_number = t.table_number
      WHERE t.table_number = ?
      LIMIT 1
    `,
    [tableNumber]
  );

  const [row] = rows;
  if (!row) {
    return null;
  }

  return {
    tableNumber: row.table_number,
    capacity: row.capacity,
    location: row.location ?? "Unknown"
  };
}

export async function hasReservationOverlap(
  tableNumber: number,
  reservationTime: Date,
  excludeReservationId: number | null
): Promise<boolean> {
  const [rows] = await pool.query<CountRow[]>(
    `
      SELECT COUNT(*) AS total
      FROM reservation r
      JOIN reservation_status rs
        ON rs.reservation_status_id = r.reservation_status_id
      WHERE r.table_number = ?
        AND rs.name IN ('pending', 'confirmed')
        AND ABS(TIMESTAMPDIFF(MINUTE, r.reservation_time, ?)) < 120
        AND (? IS NULL OR r.reservation_id <> ?)
    `,
    [tableNumber, reservationTime, excludeReservationId, excludeReservationId]
  );

  return (rows[0]?.total ?? 0) > 0;
}

export async function createReservation(
  tableNumber: number,
  reservationTime: Date,
  reservationStatusId: number,
  partySize: number
): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `
      INSERT INTO reservation (table_number, reservation_time, reservation_status_id, party_size)
      VALUES (?, ?, ?, ?)
    `,
    [tableNumber, reservationTime, reservationStatusId, partySize]
  );

  return result.insertId;
}

export async function updateReservationStatus(
  reservationId: number,
  reservationStatusId: number
): Promise<void> {
  await pool.query(
    "UPDATE reservation SET reservation_status_id = ? WHERE reservation_id = ?",
    [reservationStatusId, reservationId]
  );
}

export async function createTableAssignment(
  tableNumber: number,
  reservationId: number | null,
  menuPrice: number | null
): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `
      INSERT INTO table_assignment (table_number, reservation_id, menu_price)
      VALUES (?, ?, ?)
    `,
    [tableNumber, reservationId, menuPrice]
  );
  return result.insertId;
}

export async function getTableAssignmentById(assignmentId: number): Promise<TableAssignmentRecord | null> {
  const [rows] = await pool.query<TableAssignmentRow[]>(
    `
      SELECT assignment_id, table_number, reservation_id, menu_price, created_at
      FROM table_assignment
      WHERE assignment_id = ?
      LIMIT 1
    `,
    [assignmentId]
  );

  const [row] = rows;
  return row ? mapTableAssignment(row) : null;
}
