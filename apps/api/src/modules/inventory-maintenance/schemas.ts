import { z } from "zod";

export const createSupplierSchema = z.object({
  companyName: z.string().trim().min(1),
});

export const createIngredientStockSchema = z.object({
  stockLevel: z.coerce.number().min(0).optional(),
});

export const updateIngredientStockSchema = z.object({
  stockLevel: z.coerce.number().min(0),
});

export const createSupplierIngredientStockSchema = z.object({
  supplierId: z.coerce.number().int().positive(),
  ingredientId: z.coerce.number().int().positive(),
});

export const createSupplementMaintenanceLogSchema = z.object({
  supplierId: z.coerce.number().int().positive(),
  companyName: z.string().trim().min(1),
  details: z.string().optional(),
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;
export type CreateIngredientStockInput = z.infer<typeof createIngredientStockSchema>;
export type UpdateIngredientStockInput = z.infer<typeof updateIngredientStockSchema>;
export type CreateSupplierIngredientStockInput = z.infer<typeof createSupplierIngredientStockSchema>;
export type CreateSupplementMaintenanceLogInput = z.infer<typeof createSupplementMaintenanceLogSchema>;
export type IdParams = z.infer<typeof idParamSchema>;
