import { Router, Request, Response, NextFunction } from "express";

import * as service from "./service.js";
import {
  createSupplierSchema,
  createIngredientStockSchema,
  updateIngredientStockSchema,
  createSupplierIngredientStockSchema,
  createSupplementMaintenanceLogSchema,
  idParamSchema
} from "./schemas.js";

export const inventoryMaintenanceRouter = Router();

// Suppliers
inventoryMaintenanceRouter.post(
  "/suppliers",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = createSupplierSchema.parse(req.body);
      const data = await service.createSupplierFlow(input);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
);

inventoryMaintenanceRouter.get(
  "/suppliers",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await service.listSuppliersFlow();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
);

// Ingredient Stock
inventoryMaintenanceRouter.post(
  "/ingredient-stock",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = createIngredientStockSchema.parse(req.body);
      const data = await service.createIngredientStockFlow(input);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
);

inventoryMaintenanceRouter.get(
  "/ingredient-stock",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await service.listIngredientStocksFlow();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
);

inventoryMaintenanceRouter.patch(
  "/ingredient-stock/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = idParamSchema.parse(req.params);
      const input = updateIngredientStockSchema.parse(req.body);
      const data = await service.updateIngredientStockFlow(id, input);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
);

// Supplier-Ingredient Links
inventoryMaintenanceRouter.post(
  "/supplier-ingredient-stock",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = createSupplierIngredientStockSchema.parse(req.body);
      await service.createSupplierIngredientStockFlow(input);
      res.status(201).json({ success: true, data: null });
    } catch (error) {
      next(error);
    }
  }
);

inventoryMaintenanceRouter.get(
  "/supplier-ingredient-stock",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await service.listSupplierIngredientStocksFlow();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
);

// Supplement Maintenance Logs
inventoryMaintenanceRouter.post(
  "/maintenance-logs",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = createSupplementMaintenanceLogSchema.parse(req.body);
      const data = await service.createSupplementMaintenanceLogFlow(input);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
);

inventoryMaintenanceRouter.get(
  "/maintenance-logs",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await service.listSupplementMaintenanceLogsFlow();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
);
