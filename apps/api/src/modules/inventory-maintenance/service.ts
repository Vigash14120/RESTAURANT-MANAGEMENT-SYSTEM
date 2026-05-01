import {
  SupplierDto,
  IngredientStockDto,
  SupplierIngredientStockDto,
  SupplementMaintenanceLogDto
} from "@rms/shared-types";

import * as repository from "./repository.js";
import {
  CreateSupplierInput,
  CreateIngredientStockInput,
  UpdateIngredientStockInput,
  CreateSupplierIngredientStockInput,
  CreateSupplementMaintenanceLogInput
} from "./schemas.js";

export async function createSupplierFlow(input: CreateSupplierInput): Promise<SupplierDto> {
  const id = await repository.createSupplier(input.companyName);
  const supplier = await repository.getSupplierById(id);
  if (!supplier) throw new Error("Failed to retrieve created supplier.");
  return supplier;
}

export async function listSuppliersFlow(): Promise<SupplierDto[]> {
  return repository.listSuppliers();
}

export async function createIngredientStockFlow(input: CreateIngredientStockInput): Promise<IngredientStockDto> {
  const id = await repository.createIngredientStock(input.stockLevel);
  const stock = await repository.getIngredientStockById(id);
  if (!stock) throw new Error("Failed to retrieve created ingredient stock.");
  return stock;
}

export async function updateIngredientStockFlow(id: number, input: UpdateIngredientStockInput): Promise<IngredientStockDto> {
  await repository.updateIngredientStock(id, input.stockLevel);
  const stock = await repository.getIngredientStockById(id);
  if (!stock) throw new Error("Ingredient stock not found.");
  return stock;
}

export async function listIngredientStocksFlow(): Promise<IngredientStockDto[]> {
  return repository.listIngredientStocks();
}

export async function createSupplierIngredientStockFlow(input: CreateSupplierIngredientStockInput): Promise<void> {
  await repository.createSupplierIngredientStock(input.supplierId, input.ingredientId);
}

export async function listSupplierIngredientStocksFlow(): Promise<SupplierIngredientStockDto[]> {
  return repository.listSupplierIngredientStocks();
}

export async function createSupplementMaintenanceLogFlow(input: CreateSupplementMaintenanceLogInput): Promise<SupplementMaintenanceLogDto> {
  const id = await repository.createSupplementMaintenanceLog(input.supplierId, input.companyName, input.details ?? null);
  // Re-fetch using a new repository method or directly map. Since we don't have getSupplementMaintenanceLogById, we can list and filter or map manually.
  // We'll just map manually for simplicity since we have all data.
  return {
    maintenanceLogId: id,
    supplierId: input.supplierId,
    companyName: input.companyName,
    loggedAt: new Date().toISOString(),
    details: input.details ?? null
  };
}

export async function listSupplementMaintenanceLogsFlow(): Promise<SupplementMaintenanceLogDto[]> {
  return repository.listSupplementMaintenanceLogs();
}
