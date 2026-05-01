import { z } from "zod";

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

export const createStaffSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1)
});

export const createStaffMemberSchema = z.object({
  firstName: z.string().trim().min(1),
  salary: z.coerce.number().min(0),
  employerStaffId: z.coerce.number().int().positive().optional(),
  restaurantId: z.coerce.number().int().positive()
});

export const createStaffShiftLogSchema = z.object({
  shiftTime: z.string().datetime()
});

export const createJobAssignmentSchema = z.object({
  staffId: z.coerce.number().int().positive(),
  shiftTime: z.string().datetime(),
  restaurantId: z.coerce.number().int().positive()
});

export const createEquipmentSchema = z.object({
  assignmentId: z.coerce.number().int().positive(),
  name: z.string().trim().min(1)
});

export const createMenuCategorySchema = z.object({
  restaurantId: z.coerce.number().int().positive(),
  name: z.string().trim().min(1),
  currentLocation: z.string().trim().min(1).optional()
});

export const createDishSchema = z.object({
  restaurantId: z.coerce.number().int().positive(),
  categoryId: z.coerce.number().int().positive(),
  categoryName: z.string().trim().min(1),
  itemName: z.string().trim().min(1),
  description: z.string().trim().min(1).optional(),
  isAlcoholic: z.boolean().optional(),
  isVegetarian: z.boolean().optional()
});

export const createRecipeSchema = z.object({
  itemId: z.coerce.number().int().positive(),
  isAlcoholic: z.boolean().optional(),
  isVegetarian: z.boolean().optional(),
  instructions: z.string().trim().min(1).optional()
});

export type IdParams = z.infer<typeof idParamSchema>;
export type CreateStaffInput = z.infer<typeof createStaffSchema>;
export type CreateStaffMemberInput = z.infer<typeof createStaffMemberSchema>;
export type CreateStaffShiftLogInput = z.infer<typeof createStaffShiftLogSchema>;
export type CreateJobAssignmentInput = z.infer<typeof createJobAssignmentSchema>;
export type CreateEquipmentInput = z.infer<typeof createEquipmentSchema>;
export type CreateMenuCategoryInput = z.infer<typeof createMenuCategorySchema>;
export type CreateDishInput = z.infer<typeof createDishSchema>;
export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;
