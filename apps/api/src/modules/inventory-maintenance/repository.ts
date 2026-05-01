import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../../db/mysql.js";
import {
  SupplierDto,
  IngredientStockDto,
  SupplierIngredientStockDto,
  SupplementMaintenanceLogDto
} from "@rms/shared-types";

interface SupplierRow extends RowDataPacket {
  supplier_id: number;
  company_name: string;
  created_at: string | Date;
}

interface IngredientStockRow extends RowDataPacket {
  ingredient_id: number;
  stock_level: number;
  created_at: string | Date;
}

interface SupplierIngredientStockRow extends RowDataPacket {
  supplier_id: number;
  ingredient_id: number;
  created_at: string | Date;
}

interface SupplementMaintenanceLogRow extends RowDataPacket {
  maintenance_log_id: number;
  supplier_id: number;
  company_name: string;
  logged_at: string | Date;
  details: string | null;
}

function safeIsoString(value: string | Date): string {
  if (!value) return new Date().toISOString();
  const dateValue = value instanceof Date ? value : new Date(value);
  return Number.isNaN(dateValue.getTime()) ? String(value) : dateValue.toISOString();
}

// Supplier Mappers & Repositories
function mapSupplier(row: SupplierRow): SupplierDto {
  return {
    supplierId: row.supplier_id,
    companyName: row.company_name,
    createdAt: safeIsoString(row.created_at)
  };
}

export async function createSupplier(companyName: string): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO supplier (company_name) VALUES (?)",
    [companyName]
  );
  return result.insertId;
}

export async function getSupplierById(id: number): Promise<SupplierDto | null> {
  const [rows] = await pool.query<SupplierRow[]>(
    "SELECT * FROM supplier WHERE supplier_id = ? LIMIT 1",
    [id]
  );
  return rows[0] ? mapSupplier(rows[0]) : null;
}

export async function listSuppliers(): Promise<SupplierDto[]> {
  const [rows] = await pool.query<SupplierRow[]>("SELECT * FROM supplier ORDER BY company_name ASC");
  return rows.map(mapSupplier);
}

// Ingredient Stock Mappers & Repositories
function mapIngredientStock(row: IngredientStockRow): IngredientStockDto {
  return {
    ingredientId: row.ingredient_id,
    stockLevel: Number(row.stock_level),
    createdAt: safeIsoString(row.created_at)
  };
}

export async function createIngredientStock(stockLevel: number = 0): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO ingredient_stock (stock_level) VALUES (?)",
    [stockLevel]
  );
  return result.insertId;
}

export async function getIngredientStockById(id: number): Promise<IngredientStockDto | null> {
  const [rows] = await pool.query<IngredientStockRow[]>(
    "SELECT * FROM ingredient_stock WHERE ingredient_id = ? LIMIT 1",
    [id]
  );
  return rows[0] ? mapIngredientStock(rows[0]) : null;
}

export async function listIngredientStocks(): Promise<IngredientStockDto[]> {
  const [rows] = await pool.query<IngredientStockRow[]>("SELECT * FROM ingredient_stock ORDER BY ingredient_id ASC");
  return rows.map(mapIngredientStock);
}

export async function updateIngredientStock(id: number, stockLevel: number): Promise<void> {
  await pool.query(
    "UPDATE ingredient_stock SET stock_level = ? WHERE ingredient_id = ?",
    [stockLevel, id]
  );
}

// Supplier Ingredient Stock Mappers & Repositories
function mapSupplierIngredientStock(row: SupplierIngredientStockRow): SupplierIngredientStockDto {
  return {
    supplierId: row.supplier_id,
    ingredientId: row.ingredient_id,
    createdAt: safeIsoString(row.created_at)
  };
}

export async function createSupplierIngredientStock(supplierId: number, ingredientId: number): Promise<void> {
  await pool.query(
    "INSERT INTO supplier_ingredient_stock (supplier_id, ingredient_id) VALUES (?, ?)",
    [supplierId, ingredientId]
  );
}

export async function listSupplierIngredientStocks(): Promise<SupplierIngredientStockDto[]> {
  const [rows] = await pool.query<SupplierIngredientStockRow[]>("SELECT * FROM supplier_ingredient_stock ORDER BY created_at DESC");
  return rows.map(mapSupplierIngredientStock);
}

// Supplement Maintenance Log Mappers & Repositories
function mapSupplementMaintenanceLog(row: SupplementMaintenanceLogRow): SupplementMaintenanceLogDto {
  return {
    maintenanceLogId: row.maintenance_log_id,
    supplierId: row.supplier_id,
    companyName: row.company_name,
    loggedAt: safeIsoString(row.logged_at),
    details: row.details
  };
}

export async function createSupplementMaintenanceLog(supplierId: number, companyName: string, details: string | null): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO supplement_maintenance_log (supplier_id, company_name, details) VALUES (?, ?, ?)",
    [supplierId, companyName, details]
  );
  return result.insertId;
}

export async function listSupplementMaintenanceLogs(): Promise<SupplementMaintenanceLogDto[]> {
  const [rows] = await pool.query<SupplementMaintenanceLogRow[]>("SELECT * FROM supplement_maintenance_log ORDER BY logged_at DESC");
  return rows.map(mapSupplementMaintenanceLog);
}
