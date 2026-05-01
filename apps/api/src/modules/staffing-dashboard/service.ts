import type {
  DashboardSummaryDto,
  DishItemDto,
  EquipmentDto,
  JobAssignmentDto,
  MenuCategoryDto,
  RecipeDto,
  RestaurantSummaryDto,
  StaffDto,
  StaffMemberDto,
  StaffShiftLogDto
} from "@rms/shared-types";

import { ApiHttpError } from "../../middleware/error-handler.js";
import type {
  CreateDishInput,
  CreateEquipmentInput,
  CreateJobAssignmentInput,
  CreateMenuCategoryInput,
  CreateRecipeInput,
  CreateStaffInput,
  CreateStaffMemberInput,
  CreateStaffShiftLogInput
} from "./schemas.js";
import {
  createDish,
  createEquipment,
  createJobAssignment,
  createMenuCategory,
  createRecipe,
  createStaff,
  createStaffMember,
  createStaffShiftLog,
  getDashboardKpis,
  getDishById,
  getEquipmentById,
  getJobAssignmentById,
  getJobAssignmentByRestaurantId,
  getMenuCategoryById,
  getMenuCategoryByRestaurantId,
  getRecipeById,
  getRecipeByItemId,
  getRestaurantById,
  getStaffById,
  getStaffMemberById,
  getStaffShiftLogById,
  listDashboardLatestMaintenanceLogs,
  listDashboardLatestReservations,
  listDashboardLatestTickets,
  listDashboardLowStockIngredients,
  listDashboardUpcomingShifts,
  listDishes,
  listEquipment,
  listJobAssignments,
  listMenuCategories,
  listRecipes,
  listRestaurants,
  listStaff,
  listStaffMembers,
  listStaffShiftLogs
} from "./repository.js";

const lowStockThreshold = 20;

export async function createStaffFlow(input: CreateStaffInput): Promise<StaffDto> {
  const staffId = await createStaff(input.firstName, input.lastName);
  const staff = await getStaffById(staffId);
  if (!staff) {
    throw new ApiHttpError(500, "STAFF_CREATE_FAILED", "Failed to load created staff record.");
  }
  return staff;
}

export async function listStaffFlow(): Promise<StaffDto[]> {
  return listStaff();
}

export async function createStaffMemberFlow(input: CreateStaffMemberInput): Promise<StaffMemberDto> {
  const restaurant = await getRestaurantById(input.restaurantId);
  if (!restaurant) {
    throw new ApiHttpError(404, "RESTAURANT_NOT_FOUND", `Restaurant ${input.restaurantId} was not found.`);
  }

  if (input.employerStaffId !== undefined) {
    const employer = await getStaffById(input.employerStaffId);
    if (!employer) {
      throw new ApiHttpError(404, "EMPLOYER_STAFF_NOT_FOUND", `Staff ${input.employerStaffId} was not found.`);
    }
  }

  const staffMemberId = await createStaffMember(
    input.firstName,
    input.salary,
    input.employerStaffId ?? null,
    input.restaurantId
  );
  const staffMember = await getStaffMemberById(staffMemberId);
  if (!staffMember) {
    throw new ApiHttpError(500, "STAFF_MEMBER_CREATE_FAILED", "Failed to load created staff member.");
  }
  return staffMember;
}

export async function listStaffMembersFlow(): Promise<StaffMemberDto[]> {
  return listStaffMembers();
}

export async function createStaffShiftLogFlow(staffId: number, input: CreateStaffShiftLogInput): Promise<StaffShiftLogDto> {
  const staff = await getStaffById(staffId);
  if (!staff) {
    throw new ApiHttpError(404, "STAFF_NOT_FOUND", `Staff ${staffId} was not found.`);
  }

  const shiftTime = new Date(input.shiftTime);
  if (Number.isNaN(shiftTime.getTime())) {
    throw new ApiHttpError(400, "INVALID_SHIFT_TIME", "Shift time is invalid.");
  }

  const shiftLogId = await createStaffShiftLog(staffId, shiftTime);
  const shiftLog = await getStaffShiftLogById(shiftLogId);
  if (!shiftLog) {
    throw new ApiHttpError(500, "SHIFT_LOG_CREATE_FAILED", "Failed to load created shift log.");
  }
  return shiftLog;
}

export async function listStaffShiftLogsFlow(): Promise<StaffShiftLogDto[]> {
  return listStaffShiftLogs();
}

export async function createJobAssignmentFlow(input: CreateJobAssignmentInput): Promise<JobAssignmentDto> {
  const staff = await getStaffById(input.staffId);
  if (!staff) {
    throw new ApiHttpError(404, "STAFF_NOT_FOUND", `Staff ${input.staffId} was not found.`);
  }

  const restaurant = await getRestaurantById(input.restaurantId);
  if (!restaurant) {
    throw new ApiHttpError(404, "RESTAURANT_NOT_FOUND", `Restaurant ${input.restaurantId} was not found.`);
  }

  const existingAssignment = await getJobAssignmentByRestaurantId(input.restaurantId);
  if (existingAssignment) {
    throw new ApiHttpError(
      409,
      "ASSIGNMENT_EXISTS_FOR_RESTAURANT",
      `Restaurant ${input.restaurantId} already has assignment ${existingAssignment.assignmentId}.`
    );
  }

  const shiftTime = new Date(input.shiftTime);
  if (Number.isNaN(shiftTime.getTime())) {
    throw new ApiHttpError(400, "INVALID_SHIFT_TIME", "Shift time is invalid.");
  }

  const assignmentId = await createJobAssignment(input.staffId, shiftTime, input.restaurantId);
  const assignment = await getJobAssignmentById(assignmentId);
  if (!assignment) {
    throw new ApiHttpError(500, "JOB_ASSIGNMENT_CREATE_FAILED", "Failed to load created job assignment.");
  }
  return assignment;
}

export async function listJobAssignmentsFlow(): Promise<JobAssignmentDto[]> {
  return listJobAssignments();
}

export async function createEquipmentFlow(input: CreateEquipmentInput): Promise<EquipmentDto> {
  const assignment = await getJobAssignmentById(input.assignmentId);
  if (!assignment) {
    throw new ApiHttpError(404, "ASSIGNMENT_NOT_FOUND", `Assignment ${input.assignmentId} was not found.`);
  }

  const equipmentId = await createEquipment(input.assignmentId, input.name);
  const equipment = await getEquipmentById(equipmentId);
  if (!equipment) {
    throw new ApiHttpError(500, "EQUIPMENT_CREATE_FAILED", "Failed to load created equipment.");
  }
  return equipment;
}

export async function listEquipmentFlow(): Promise<EquipmentDto[]> {
  return listEquipment();
}

export async function listRestaurantsFlow(): Promise<RestaurantSummaryDto[]> {
  return listRestaurants();
}

export async function createMenuCategoryFlow(input: CreateMenuCategoryInput): Promise<MenuCategoryDto> {
  const restaurant = await getRestaurantById(input.restaurantId);
  if (!restaurant) {
    throw new ApiHttpError(404, "RESTAURANT_NOT_FOUND", `Restaurant ${input.restaurantId} was not found.`);
  }

  const existingCategory = await getMenuCategoryByRestaurantId(input.restaurantId);
  if (existingCategory) {
    throw new ApiHttpError(
      409,
      "MENU_CATEGORY_EXISTS",
      `Restaurant ${input.restaurantId} already has menu category ${existingCategory.categoryId}.`
    );
  }

  const categoryId = await createMenuCategory(input.restaurantId, input.name, input.currentLocation ?? null);
  const category = await getMenuCategoryById(categoryId);
  if (!category) {
    throw new ApiHttpError(500, "MENU_CATEGORY_CREATE_FAILED", "Failed to load created menu category.");
  }
  return category;
}

export async function listMenuCategoriesFlow(): Promise<MenuCategoryDto[]> {
  return listMenuCategories();
}

export async function createDishFlow(input: CreateDishInput): Promise<DishItemDto> {
  const restaurant = await getRestaurantById(input.restaurantId);
  if (!restaurant) {
    throw new ApiHttpError(404, "RESTAURANT_NOT_FOUND", `Restaurant ${input.restaurantId} was not found.`);
  }

  const category = await getMenuCategoryById(input.categoryId);
  if (!category) {
    throw new ApiHttpError(404, "MENU_CATEGORY_NOT_FOUND", `Menu category ${input.categoryId} was not found.`);
  }
  if (category.restaurantId !== input.restaurantId) {
    throw new ApiHttpError(
      409,
      "MENU_CATEGORY_RESTAURANT_MISMATCH",
      "Menu category does not belong to the provided restaurant."
    );
  }

  const itemId = await createDish(
    input.restaurantId,
    input.categoryId,
    input.categoryName,
    input.itemName,
    input.description ?? null,
    input.isAlcoholic ?? false,
    input.isVegetarian ?? false
  );
  const dish = await getDishById(itemId);
  if (!dish) {
    throw new ApiHttpError(500, "DISH_CREATE_FAILED", "Failed to load created dish.");
  }
  return dish;
}

export async function listDishesFlow(): Promise<DishItemDto[]> {
  return listDishes();
}

export async function createRecipeFlow(input: CreateRecipeInput): Promise<RecipeDto> {
  const dish = await getDishById(input.itemId);
  if (!dish) {
    throw new ApiHttpError(404, "DISH_NOT_FOUND", `Dish ${input.itemId} was not found.`);
  }

  const existingRecipe = await getRecipeByItemId(input.itemId);
  if (existingRecipe) {
    throw new ApiHttpError(409, "RECIPE_EXISTS", `Dish ${input.itemId} already has a recipe.`);
  }

  const recipeId = await createRecipe(
    input.itemId,
    input.isAlcoholic ?? false,
    input.isVegetarian ?? false,
    input.instructions ?? null
  );
  const recipe = await getRecipeById(recipeId);
  if (!recipe) {
    throw new ApiHttpError(500, "RECIPE_CREATE_FAILED", "Failed to load created recipe.");
  }
  return recipe;
}

export async function listRecipesFlow(): Promise<RecipeDto[]> {
  return listRecipes();
}

export async function getDashboardSummaryFlow(): Promise<DashboardSummaryDto> {
  const [kpis, lowStockIngredients, latestReservations, latestTickets, latestMaintenanceLogs, upcomingShifts] =
    await Promise.all([
      getDashboardKpis(lowStockThreshold),
      listDashboardLowStockIngredients(lowStockThreshold),
      listDashboardLatestReservations(),
      listDashboardLatestTickets(),
      listDashboardLatestMaintenanceLogs(),
      listDashboardUpcomingShifts()
    ]);

  return {
    generatedAt: new Date().toISOString(),
    kpis,
    lowStockIngredients,
    latestReservations,
    latestTickets,
    latestMaintenanceLogs,
    upcomingShifts
  };
}
