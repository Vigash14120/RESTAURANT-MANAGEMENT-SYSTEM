import type { ApiSuccessResponse } from "@rms/shared-types";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import { Router } from "express";

import {
  createDishSchema,
  createEquipmentSchema,
  createJobAssignmentSchema,
  createMenuCategorySchema,
  createRecipeSchema,
  createStaffMemberSchema,
  createStaffSchema,
  createStaffShiftLogSchema,
  idParamSchema
} from "./schemas.js";
import {
  createDishFlow,
  createEquipmentFlow,
  createJobAssignmentFlow,
  createMenuCategoryFlow,
  createRecipeFlow,
  createStaffFlow,
  createStaffMemberFlow,
  createStaffShiftLogFlow,
  getDashboardSummaryFlow,
  listDishesFlow,
  listEquipmentFlow,
  listJobAssignmentsFlow,
  listMenuCategoriesFlow,
  listRecipesFlow,
  listRestaurantsFlow,
  listStaffFlow,
  listStaffMembersFlow,
  listStaffShiftLogsFlow
} from "./service.js";

type AsyncRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

function asyncHandler(handler: AsyncRouteHandler): RequestHandler {
  return (req, res, next) => {
    void handler(req, res, next).catch(next);
  };
}

export const staffingDashboardRouter = Router();

staffingDashboardRouter.get(
  "/restaurants",
  asyncHandler(async (_req, res) => {
    const data = await listRestaurantsFlow();
    const response: ApiSuccessResponse<typeof data> = { success: true, data };
    res.status(200).json(response);
  })
);

staffingDashboardRouter.get(
  "/staff",
  asyncHandler(async (_req, res) => {
    const data = await listStaffFlow();
    const response: ApiSuccessResponse<typeof data> = { success: true, data };
    res.status(200).json(response);
  })
);

staffingDashboardRouter.post(
  "/staff",
  asyncHandler(async (req, res) => {
    const body = createStaffSchema.parse(req.body);
    const data = await createStaffFlow(body);
    const response: ApiSuccessResponse<typeof data> = { success: true, data };
    res.status(201).json(response);
  })
);

staffingDashboardRouter.get(
  "/staff-members",
  asyncHandler(async (_req, res) => {
    const data = await listStaffMembersFlow();
    const response: ApiSuccessResponse<typeof data> = { success: true, data };
    res.status(200).json(response);
  })
);

staffingDashboardRouter.post(
  "/staff-members",
  asyncHandler(async (req, res) => {
    const body = createStaffMemberSchema.parse(req.body);
    const data = await createStaffMemberFlow(body);
    const response: ApiSuccessResponse<typeof data> = { success: true, data };
    res.status(201).json(response);
  })
);

staffingDashboardRouter.get(
  "/staff-shift-logs",
  asyncHandler(async (_req, res) => {
    const data = await listStaffShiftLogsFlow();
    const response: ApiSuccessResponse<typeof data> = { success: true, data };
    res.status(200).json(response);
  })
);

staffingDashboardRouter.post(
  "/staff/:id/shift-logs",
  asyncHandler(async (req, res) => {
    const { id } = idParamSchema.parse(req.params);
    const body = createStaffShiftLogSchema.parse(req.body);
    const data = await createStaffShiftLogFlow(id, body);
    const response: ApiSuccessResponse<typeof data> = { success: true, data };
    res.status(201).json(response);
  })
);

staffingDashboardRouter.get(
  "/job-assignments",
  asyncHandler(async (_req, res) => {
    const data = await listJobAssignmentsFlow();
    const response: ApiSuccessResponse<typeof data> = { success: true, data };
    res.status(200).json(response);
  })
);

staffingDashboardRouter.post(
  "/job-assignments",
  asyncHandler(async (req, res) => {
    const body = createJobAssignmentSchema.parse(req.body);
    const data = await createJobAssignmentFlow(body);
    const response: ApiSuccessResponse<typeof data> = { success: true, data };
    res.status(201).json(response);
  })
);

staffingDashboardRouter.get(
  "/equipment",
  asyncHandler(async (_req, res) => {
    const data = await listEquipmentFlow();
    const response: ApiSuccessResponse<typeof data> = { success: true, data };
    res.status(200).json(response);
  })
);

staffingDashboardRouter.post(
  "/equipment",
  asyncHandler(async (req, res) => {
    const body = createEquipmentSchema.parse(req.body);
    const data = await createEquipmentFlow(body);
    const response: ApiSuccessResponse<typeof data> = { success: true, data };
    res.status(201).json(response);
  })
);

staffingDashboardRouter.get(
  "/menu-categories",
  asyncHandler(async (_req, res) => {
    const data = await listMenuCategoriesFlow();
    const response: ApiSuccessResponse<typeof data> = { success: true, data };
    res.status(200).json(response);
  })
);

staffingDashboardRouter.post(
  "/menu-categories",
  asyncHandler(async (req, res) => {
    const body = createMenuCategorySchema.parse(req.body);
    const data = await createMenuCategoryFlow(body);
    const response: ApiSuccessResponse<typeof data> = { success: true, data };
    res.status(201).json(response);
  })
);

staffingDashboardRouter.get(
  "/dishes",
  asyncHandler(async (_req, res) => {
    const data = await listDishesFlow();
    const response: ApiSuccessResponse<typeof data> = { success: true, data };
    res.status(200).json(response);
  })
);

staffingDashboardRouter.post(
  "/dishes",
  asyncHandler(async (req, res) => {
    const body = createDishSchema.parse(req.body);
    const data = await createDishFlow(body);
    const response: ApiSuccessResponse<typeof data> = { success: true, data };
    res.status(201).json(response);
  })
);

staffingDashboardRouter.get(
  "/recipes",
  asyncHandler(async (_req, res) => {
    const data = await listRecipesFlow();
    const response: ApiSuccessResponse<typeof data> = { success: true, data };
    res.status(200).json(response);
  })
);

staffingDashboardRouter.post(
  "/recipes",
  asyncHandler(async (req, res) => {
    const body = createRecipeSchema.parse(req.body);
    const data = await createRecipeFlow(body);
    const response: ApiSuccessResponse<typeof data> = { success: true, data };
    res.status(201).json(response);
  })
);

staffingDashboardRouter.get(
  "/dashboard/summary",
  asyncHandler(async (_req, res) => {
    const data = await getDashboardSummaryFlow();
    const response: ApiSuccessResponse<typeof data> = { success: true, data };
    res.status(200).json(response);
  })
);
