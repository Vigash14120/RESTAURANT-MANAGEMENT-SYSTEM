import type { RowDataPacket, ResultSetHeader } from "mysql2";

import type {
  DashboardKpisDto,
  DishItemDto,
  EquipmentDto,
  IngredientStockDto,
  JobAssignmentDto,
  MenuCategoryDto,
  ReservationDetailsDto,
  RestaurantSummaryDto,
  RecipeDto,
  StaffDto,
  StaffMemberDto,
  StaffShiftLogDto,
  SupplementMaintenanceLogDto,
  TicketDto
} from "@rms/shared-types";

import { pool } from "../../db/mysql.js";

interface RestaurantRow extends RowDataPacket {
  restaurant_id: number;
  phone_number: string;
  status: string | null;
}

interface StaffRow extends RowDataPacket {
  staff_id: number;
  first_name: string;
  last_name: string;
  created_at: string | Date;
}

interface StaffMemberRow extends RowDataPacket {
  staff_member_id: number;
  first_name: string;
  salary: string | number;
  employer_staff_id: number | null;
  restaurant_id: number;
}

interface StaffShiftLogRow extends RowDataPacket {
  shift_log_id: number;
  staff_id: number;
  staff_first_name: string;
  staff_last_name: string;
  shift_time: string | Date;
  created_at: string | Date;
}

interface JobAssignmentRow extends RowDataPacket {
  assignment_id: number;
  staff_id: number;
  staff_first_name: string;
  staff_last_name: string;
  shift_time: string | Date;
  restaurant_id: number;
  created_at: string | Date;
}

interface EquipmentRow extends RowDataPacket {
  equipment_id: number;
  assignment_id: number;
  assignment_staff_id: number;
  assignment_staff_name: string;
  name: string;
  created_at: string | Date;
}

interface MenuCategoryRow extends RowDataPacket {
  category_id: number;
  restaurant_id: number;
  name: string;
  current_location: string | null;
  created_at: string | Date;
}

interface DishRow extends RowDataPacket {
  item_id: number;
  restaurant_id: number;
  category_id: number;
  category_name: string;
  item_name: string;
  description: string | null;
  is_alcoholic: number;
  is_vegetarian: number;
  created_at: string | Date;
}

interface RecipeRow extends RowDataPacket {
  recipe_id: number;
  item_id: number;
  item_name: string;
  is_alcoholic: number;
  is_vegetarian: number;
  instructions: string | null;
}

interface DashboardKpisRow extends RowDataPacket {
  total_reservations: number;
  active_reservations: number;
  total_tickets: number;
  kitchen_queue: number;
  service_queue: number;
  emergency_requests: number;
  low_stock_items: number;
  total_suppliers: number;
  total_staff: number;
  total_staff_members: number;
  total_job_assignments: number;
}

interface ReservationRow extends RowDataPacket {
  reservation_id: number;
  table_number: number;
  reservation_time: string | Date;
  status: string;
  party_size: number;
  capacity: number;
  location: string;
}

interface TicketRow extends RowDataPacket {
  ticket_id: number;
  customer_order_id: number;
  party_size: number;
  created_at: string | Date;
}

interface IngredientStockRow extends RowDataPacket {
  ingredient_id: number;
  stock_level: string | number;
  created_at: string | Date;
}

interface MaintenanceLogRow extends RowDataPacket {
  maintenance_log_id: number;
  supplier_id: number;
  company_name: string;
  logged_at: string | Date;
  details: string | null;
}

function safeIsoString(value: string | Date): string {
  const dateValue = value instanceof Date ? value : new Date(value);
  return Number.isNaN(dateValue.getTime()) ? String(value) : dateValue.toISOString();
}

function toNumber(value: string | number): number {
  return typeof value === "number" ? value : Number(value);
}

function mapRestaurant(row: RestaurantRow): RestaurantSummaryDto {
  return {
    restaurantId: row.restaurant_id,
    phoneNumber: row.phone_number,
    status: row.status
  };
}

function mapStaff(row: StaffRow): StaffDto {
  return {
    staffId: row.staff_id,
    firstName: row.first_name,
    lastName: row.last_name,
    createdAt: safeIsoString(row.created_at)
  };
}

function mapStaffMember(row: StaffMemberRow): StaffMemberDto {
  return {
    staffMemberId: row.staff_member_id,
    firstName: row.first_name,
    salary: toNumber(row.salary),
    employerStaffId: row.employer_staff_id,
    restaurantId: row.restaurant_id
  };
}

function mapStaffShiftLog(row: StaffShiftLogRow): StaffShiftLogDto {
  return {
    shiftLogId: row.shift_log_id,
    staffId: row.staff_id,
    staffFirstName: row.staff_first_name,
    staffLastName: row.staff_last_name,
    shiftTime: safeIsoString(row.shift_time),
    createdAt: safeIsoString(row.created_at)
  };
}

function mapJobAssignment(row: JobAssignmentRow): JobAssignmentDto {
  return {
    assignmentId: row.assignment_id,
    staffId: row.staff_id,
    staffFirstName: row.staff_first_name,
    staffLastName: row.staff_last_name,
    shiftTime: safeIsoString(row.shift_time),
    restaurantId: row.restaurant_id,
    createdAt: safeIsoString(row.created_at)
  };
}

function mapEquipment(row: EquipmentRow): EquipmentDto {
  return {
    equipmentId: row.equipment_id,
    assignmentId: row.assignment_id,
    assignmentStaffId: row.assignment_staff_id,
    assignmentStaffName: row.assignment_staff_name,
    name: row.name,
    createdAt: safeIsoString(row.created_at)
  };
}

function mapMenuCategory(row: MenuCategoryRow): MenuCategoryDto {
  return {
    categoryId: row.category_id,
    restaurantId: row.restaurant_id,
    name: row.name,
    currentLocation: row.current_location,
    createdAt: safeIsoString(row.created_at)
  };
}

function mapDish(row: DishRow): DishItemDto {
  return {
    itemId: row.item_id,
    restaurantId: row.restaurant_id,
    categoryId: row.category_id,
    categoryName: row.category_name,
    itemName: row.item_name,
    description: row.description,
    isAlcoholic: Boolean(row.is_alcoholic),
    isVegetarian: Boolean(row.is_vegetarian),
    createdAt: safeIsoString(row.created_at)
  };
}

function mapRecipe(row: RecipeRow): RecipeDto {
  return {
    recipeId: row.recipe_id,
    itemId: row.item_id,
    itemName: row.item_name,
    isAlcoholic: Boolean(row.is_alcoholic),
    isVegetarian: Boolean(row.is_vegetarian),
    instructions: row.instructions
  };
}

function mapReservation(row: ReservationRow): ReservationDetailsDto {
  return {
    reservationId: row.reservation_id,
    tableNumber: row.table_number,
    reservationTime: safeIsoString(row.reservation_time),
    status: row.status === "pending" || row.status === "confirmed" || row.status === "cancelled" || row.status === "completed"
      ? row.status
      : "pending",
    partySize: row.party_size,
    capacity: row.capacity,
    location: row.location
  };
}

function mapTicket(row: TicketRow): TicketDto {
  return {
    ticketId: row.ticket_id,
    customerOrderId: row.customer_order_id,
    partySize: row.party_size,
    createdAt: safeIsoString(row.created_at)
  };
}

function mapIngredientStock(row: IngredientStockRow): IngredientStockDto {
  return {
    ingredientId: row.ingredient_id,
    stockLevel: toNumber(row.stock_level),
    createdAt: safeIsoString(row.created_at)
  };
}

function mapMaintenanceLog(row: MaintenanceLogRow): SupplementMaintenanceLogDto {
  return {
    maintenanceLogId: row.maintenance_log_id,
    supplierId: row.supplier_id,
    companyName: row.company_name,
    loggedAt: safeIsoString(row.logged_at),
    details: row.details
  };
}

export async function listRestaurants(): Promise<RestaurantSummaryDto[]> {
  const [rows] = await pool.query<RestaurantRow[]>(
    `
      SELECT r.restaurant_id, r.phone_number, rs.name AS status
      FROM restaurant r
      LEFT JOIN restaurant_status rs
        ON rs.status_id = r.status_id
      ORDER BY r.restaurant_id ASC
    `
  );
  return rows.map(mapRestaurant);
}

export async function getRestaurantById(restaurantId: number): Promise<RestaurantSummaryDto | null> {
  const [rows] = await pool.query<RestaurantRow[]>(
    `
      SELECT r.restaurant_id, r.phone_number, rs.name AS status
      FROM restaurant r
      LEFT JOIN restaurant_status rs
        ON rs.status_id = r.status_id
      WHERE r.restaurant_id = ?
      LIMIT 1
    `,
    [restaurantId]
  );
  const [row] = rows;
  return row ? mapRestaurant(row) : null;
}

export async function createStaff(firstName: string, lastName: string): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO staff (first_name, last_name) VALUES (?, ?)",
    [firstName, lastName]
  );
  return result.insertId;
}

export async function getStaffById(staffId: number): Promise<StaffDto | null> {
  const [rows] = await pool.query<StaffRow[]>(
    "SELECT staff_id, first_name, last_name, created_at FROM staff WHERE staff_id = ? LIMIT 1",
    [staffId]
  );
  const [row] = rows;
  return row ? mapStaff(row) : null;
}

export async function listStaff(): Promise<StaffDto[]> {
  const [rows] = await pool.query<StaffRow[]>(
    "SELECT staff_id, first_name, last_name, created_at FROM staff ORDER BY staff_id ASC"
  );
  return rows.map(mapStaff);
}

export async function createStaffMember(
  firstName: string,
  salary: number,
  employerStaffId: number | null,
  restaurantId: number
): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `
      INSERT INTO staff_member (first_name, salary, employer_staff_id, restaurant_id)
      VALUES (?, ?, ?, ?)
    `,
    [firstName, salary, employerStaffId, restaurantId]
  );
  return result.insertId;
}

export async function getStaffMemberById(staffMemberId: number): Promise<StaffMemberDto | null> {
  const [rows] = await pool.query<StaffMemberRow[]>(
    `
      SELECT staff_member_id, first_name, salary, employer_staff_id, restaurant_id
      FROM staff_member
      WHERE staff_member_id = ?
      LIMIT 1
    `,
    [staffMemberId]
  );
  const [row] = rows;
  return row ? mapStaffMember(row) : null;
}

export async function listStaffMembers(): Promise<StaffMemberDto[]> {
  const [rows] = await pool.query<StaffMemberRow[]>(
    `
      SELECT staff_member_id, first_name, salary, employer_staff_id, restaurant_id
      FROM staff_member
      ORDER BY staff_member_id ASC
    `
  );
  return rows.map(mapStaffMember);
}

export async function createStaffShiftLog(staffId: number, shiftTime: Date): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO staff_shift_log (staff_id, shift_time) VALUES (?, ?)",
    [staffId, shiftTime]
  );
  return result.insertId;
}

export async function getStaffShiftLogById(shiftLogId: number): Promise<StaffShiftLogDto | null> {
  const [rows] = await pool.query<StaffShiftLogRow[]>(
    `
      SELECT
        ssl.shift_log_id,
        ssl.staff_id,
        s.first_name AS staff_first_name,
        s.last_name AS staff_last_name,
        ssl.shift_time,
        ssl.created_at
      FROM staff_shift_log ssl
      JOIN staff s
        ON s.staff_id = ssl.staff_id
      WHERE ssl.shift_log_id = ?
      LIMIT 1
    `,
    [shiftLogId]
  );
  const [row] = rows;
  return row ? mapStaffShiftLog(row) : null;
}

export async function listStaffShiftLogs(limit = 25): Promise<StaffShiftLogDto[]> {
  const [rows] = await pool.query<StaffShiftLogRow[]>(
    `
      SELECT
        ssl.shift_log_id,
        ssl.staff_id,
        s.first_name AS staff_first_name,
        s.last_name AS staff_last_name,
        ssl.shift_time,
        ssl.created_at
      FROM staff_shift_log ssl
      JOIN staff s
        ON s.staff_id = ssl.staff_id
      ORDER BY ssl.shift_time DESC
      LIMIT ?
    `,
    [limit]
  );
  return rows.map(mapStaffShiftLog);
}

export async function createJobAssignment(staffId: number, shiftTime: Date, restaurantId: number): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO job_assignment (staff_id, shift_time, restaurant_id) VALUES (?, ?, ?)",
    [staffId, shiftTime, restaurantId]
  );
  return result.insertId;
}

export async function getJobAssignmentById(assignmentId: number): Promise<JobAssignmentDto | null> {
  const [rows] = await pool.query<JobAssignmentRow[]>(
    `
      SELECT
        ja.assignment_id,
        ja.staff_id,
        s.first_name AS staff_first_name,
        s.last_name AS staff_last_name,
        ja.shift_time,
        ja.restaurant_id,
        ja.created_at
      FROM job_assignment ja
      JOIN staff s
        ON s.staff_id = ja.staff_id
      WHERE ja.assignment_id = ?
      LIMIT 1
    `,
    [assignmentId]
  );
  const [row] = rows;
  return row ? mapJobAssignment(row) : null;
}

export async function getJobAssignmentByRestaurantId(restaurantId: number): Promise<JobAssignmentDto | null> {
  const [rows] = await pool.query<JobAssignmentRow[]>(
    `
      SELECT
        ja.assignment_id,
        ja.staff_id,
        s.first_name AS staff_first_name,
        s.last_name AS staff_last_name,
        ja.shift_time,
        ja.restaurant_id,
        ja.created_at
      FROM job_assignment ja
      JOIN staff s
        ON s.staff_id = ja.staff_id
      WHERE ja.restaurant_id = ?
      LIMIT 1
    `,
    [restaurantId]
  );
  const [row] = rows;
  return row ? mapJobAssignment(row) : null;
}

export async function listJobAssignments(): Promise<JobAssignmentDto[]> {
  const [rows] = await pool.query<JobAssignmentRow[]>(
    `
      SELECT
        ja.assignment_id,
        ja.staff_id,
        s.first_name AS staff_first_name,
        s.last_name AS staff_last_name,
        ja.shift_time,
        ja.restaurant_id,
        ja.created_at
      FROM job_assignment ja
      JOIN staff s
        ON s.staff_id = ja.staff_id
      ORDER BY ja.created_at DESC
    `
  );
  return rows.map(mapJobAssignment);
}

export async function createEquipment(assignmentId: number, name: string): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO equipment (assignment_id, name) VALUES (?, ?)",
    [assignmentId, name]
  );
  return result.insertId;
}

export async function getEquipmentById(equipmentId: number): Promise<EquipmentDto | null> {
  const [rows] = await pool.query<EquipmentRow[]>(
    `
      SELECT
        e.equipment_id,
        e.assignment_id,
        ja.staff_id AS assignment_staff_id,
        CONCAT(s.first_name, ' ', s.last_name) AS assignment_staff_name,
        e.name,
        e.created_at
      FROM equipment e
      JOIN job_assignment ja
        ON ja.assignment_id = e.assignment_id
      JOIN staff s
        ON s.staff_id = ja.staff_id
      WHERE e.equipment_id = ?
      LIMIT 1
    `,
    [equipmentId]
  );
  const [row] = rows;
  return row ? mapEquipment(row) : null;
}

export async function listEquipment(): Promise<EquipmentDto[]> {
  const [rows] = await pool.query<EquipmentRow[]>(
    `
      SELECT
        e.equipment_id,
        e.assignment_id,
        ja.staff_id AS assignment_staff_id,
        CONCAT(s.first_name, ' ', s.last_name) AS assignment_staff_name,
        e.name,
        e.created_at
      FROM equipment e
      JOIN job_assignment ja
        ON ja.assignment_id = e.assignment_id
      JOIN staff s
        ON s.staff_id = ja.staff_id
      ORDER BY e.created_at DESC
    `
  );
  return rows.map(mapEquipment);
}

export async function createMenuCategory(
  restaurantId: number,
  name: string,
  currentLocation: string | null
): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO menu_category (restaurant_id, name, current_location) VALUES (?, ?, ?)",
    [restaurantId, name, currentLocation]
  );
  return result.insertId;
}

export async function getMenuCategoryById(categoryId: number): Promise<MenuCategoryDto | null> {
  const [rows] = await pool.query<MenuCategoryRow[]>(
    `
      SELECT category_id, restaurant_id, name, current_location, created_at
      FROM menu_category
      WHERE category_id = ?
      LIMIT 1
    `,
    [categoryId]
  );
  const [row] = rows;
  return row ? mapMenuCategory(row) : null;
}

export async function getMenuCategoryByRestaurantId(restaurantId: number): Promise<MenuCategoryDto | null> {
  const [rows] = await pool.query<MenuCategoryRow[]>(
    `
      SELECT category_id, restaurant_id, name, current_location, created_at
      FROM menu_category
      WHERE restaurant_id = ?
      LIMIT 1
    `,
    [restaurantId]
  );
  const [row] = rows;
  return row ? mapMenuCategory(row) : null;
}

export async function listMenuCategories(): Promise<MenuCategoryDto[]> {
  const [rows] = await pool.query<MenuCategoryRow[]>(
    `
      SELECT category_id, restaurant_id, name, current_location, created_at
      FROM menu_category
      ORDER BY category_id ASC
    `
  );
  return rows.map(mapMenuCategory);
}

export async function createDish(
  restaurantId: number,
  categoryId: number,
  categoryName: string,
  itemName: string,
  description: string | null,
  isAlcoholic: boolean,
  isVegetarian: boolean
): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `
      INSERT INTO dish (
        restaurant_id,
        category_id,
        category_name,
        item_name,
        description,
        is_alcoholic,
        is_vegetarian
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [restaurantId, categoryId, categoryName, itemName, description, isAlcoholic, isVegetarian]
  );
  return result.insertId;
}

export async function getDishById(itemId: number): Promise<DishItemDto | null> {
  const [rows] = await pool.query<DishRow[]>(
    `
      SELECT
        item_id,
        restaurant_id,
        category_id,
        category_name,
        item_name,
        description,
        is_alcoholic,
        is_vegetarian,
        created_at
      FROM dish
      WHERE item_id = ?
      LIMIT 1
    `,
    [itemId]
  );
  const [row] = rows;
  return row ? mapDish(row) : null;
}

export async function listDishes(): Promise<DishItemDto[]> {
  const [rows] = await pool.query<DishRow[]>(
    `
      SELECT
        item_id,
        restaurant_id,
        category_id,
        category_name,
        item_name,
        description,
        is_alcoholic,
        is_vegetarian,
        created_at
      FROM dish
      ORDER BY item_id DESC
    `
  );
  return rows.map(mapDish);
}

export async function createRecipe(
  itemId: number,
  isAlcoholic: boolean,
  isVegetarian: boolean,
  instructions: string | null
): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO recipe (item_id, is_alcoholic, is_vegetarian, instructions) VALUES (?, ?, ?, ?)",
    [itemId, isAlcoholic, isVegetarian, instructions]
  );
  return result.insertId;
}

export async function getRecipeById(recipeId: number): Promise<RecipeDto | null> {
  const [rows] = await pool.query<RecipeRow[]>(
    `
      SELECT
        r.recipe_id,
        r.item_id,
        d.item_name,
        r.is_alcoholic,
        r.is_vegetarian,
        r.instructions
      FROM recipe r
      JOIN dish d
        ON d.item_id = r.item_id
      WHERE r.recipe_id = ?
      LIMIT 1
    `,
    [recipeId]
  );
  const [row] = rows;
  return row ? mapRecipe(row) : null;
}

export async function getRecipeByItemId(itemId: number): Promise<RecipeDto | null> {
  const [rows] = await pool.query<RecipeRow[]>(
    `
      SELECT
        r.recipe_id,
        r.item_id,
        d.item_name,
        r.is_alcoholic,
        r.is_vegetarian,
        r.instructions
      FROM recipe r
      JOIN dish d
        ON d.item_id = r.item_id
      WHERE r.item_id = ?
      LIMIT 1
    `,
    [itemId]
  );
  const [row] = rows;
  return row ? mapRecipe(row) : null;
}

export async function listRecipes(): Promise<RecipeDto[]> {
  const [rows] = await pool.query<RecipeRow[]>(
    `
      SELECT
        r.recipe_id,
        r.item_id,
        d.item_name,
        r.is_alcoholic,
        r.is_vegetarian,
        r.instructions
      FROM recipe r
      JOIN dish d
        ON d.item_id = r.item_id
      ORDER BY r.recipe_id DESC
    `
  );
  return rows.map(mapRecipe);
}

export async function getDashboardKpis(lowStockThreshold: number): Promise<DashboardKpisDto> {
  const [rows] = await pool.query<DashboardKpisRow[]>(
    `
      SELECT
        (SELECT COUNT(*) FROM reservation) AS total_reservations,
        (
          SELECT COUNT(*)
          FROM reservation r
          JOIN reservation_status rs
            ON rs.reservation_status_id = r.reservation_status_id
          WHERE rs.name IN ('pending', 'confirmed')
        ) AS active_reservations,
        (SELECT COUNT(*) FROM ticket) AS total_tickets,
        (SELECT COUNT(*) FROM kitchen_order) AS kitchen_queue,
        (SELECT COUNT(*) FROM service_order) AS service_queue,
        (SELECT COUNT(*) FROM emergency_request) AS emergency_requests,
        (SELECT COUNT(*) FROM ingredient_stock WHERE stock_level < ?) AS low_stock_items,
        (SELECT COUNT(*) FROM supplier) AS total_suppliers,
        (SELECT COUNT(*) FROM staff) AS total_staff,
        (SELECT COUNT(*) FROM staff_member) AS total_staff_members,
        (SELECT COUNT(*) FROM job_assignment) AS total_job_assignments
    `,
    [lowStockThreshold]
  );

  const [row] = rows;
  if (!row) {
    return {
      totalReservations: 0,
      activeReservations: 0,
      totalTickets: 0,
      kitchenQueue: 0,
      serviceQueue: 0,
      emergencyRequests: 0,
      lowStockItems: 0,
      totalSuppliers: 0,
      totalStaff: 0,
      totalStaffMembers: 0,
      totalJobAssignments: 0
    };
  }

  return {
    totalReservations: row.total_reservations,
    activeReservations: row.active_reservations,
    totalTickets: row.total_tickets,
    kitchenQueue: row.kitchen_queue,
    serviceQueue: row.service_queue,
    emergencyRequests: row.emergency_requests,
    lowStockItems: row.low_stock_items,
    totalSuppliers: row.total_suppliers,
    totalStaff: row.total_staff,
    totalStaffMembers: row.total_staff_members,
    totalJobAssignments: row.total_job_assignments
  };
}

export async function listDashboardLowStockIngredients(
  lowStockThreshold: number,
  limit = 5
): Promise<IngredientStockDto[]> {
  const [rows] = await pool.query<IngredientStockRow[]>(
    `
      SELECT ingredient_id, stock_level, created_at
      FROM ingredient_stock
      WHERE stock_level < ?
      ORDER BY stock_level ASC, ingredient_id ASC
      LIMIT ?
    `,
    [lowStockThreshold, limit]
  );
  return rows.map(mapIngredientStock);
}

export async function listDashboardLatestReservations(limit = 5): Promise<ReservationDetailsDto[]> {
  const [rows] = await pool.query<ReservationRow[]>(
    `
      SELECT
        r.reservation_id,
        r.table_number,
        r.reservation_time,
        rs.name AS status,
        r.party_size,
        ft.capacity,
        ft.location
      FROM reservation r
      JOIN reservation_status rs
        ON rs.reservation_status_id = r.reservation_status_id
      JOIN floor_table ft
        ON ft.table_number = r.table_number
      ORDER BY r.reservation_time DESC
      LIMIT ?
    `,
    [limit]
  );
  return rows.map(mapReservation);
}

export async function listDashboardLatestTickets(limit = 5): Promise<TicketDto[]> {
  const [rows] = await pool.query<TicketRow[]>(
    `
      SELECT ticket_id, customer_order_id, party_size, created_at
      FROM ticket
      ORDER BY created_at DESC
      LIMIT ?
    `,
    [limit]
  );
  return rows.map(mapTicket);
}

export async function listDashboardLatestMaintenanceLogs(limit = 5): Promise<SupplementMaintenanceLogDto[]> {
  const [rows] = await pool.query<MaintenanceLogRow[]>(
    `
      SELECT maintenance_log_id, supplier_id, company_name, logged_at, details
      FROM supplement_maintenance_log
      ORDER BY logged_at DESC
      LIMIT ?
    `,
    [limit]
  );
  return rows.map(mapMaintenanceLog);
}

export async function listDashboardUpcomingShifts(limit = 5): Promise<StaffShiftLogDto[]> {
  const [rows] = await pool.query<StaffShiftLogRow[]>(
    `
      SELECT
        ssl.shift_log_id,
        ssl.staff_id,
        s.first_name AS staff_first_name,
        s.last_name AS staff_last_name,
        ssl.shift_time,
        ssl.created_at
      FROM staff_shift_log ssl
      JOIN staff s
        ON s.staff_id = ssl.staff_id
      ORDER BY ABS(TIMESTAMPDIFF(SECOND, ssl.shift_time, NOW())) ASC, ssl.shift_time ASC
      LIMIT ?
    `,
    [limit]
  );
  return rows.map(mapStaffShiftLog);
}
