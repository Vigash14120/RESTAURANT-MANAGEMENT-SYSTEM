export interface ApiErrorDetail {
  code: string;
  message: string;
  field?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetail[];
  };
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface HealthPayload {
  service: string;
  status: "ok";
  timestamp: string;
}

export interface RestaurantDto {
  restaurantId: number;
  phoneNumber: string;
  managerRestaurantId: number | null;
  statusId: number | null;
}

export interface TableDto {
  tableNumber: number;
  restaurantId: number;
  capacity: number;
}

export interface StaffMemberDto {
  staffMemberId: number;
  firstName: string;
  salary: number;
  employerStaffId: number | null;
  restaurantId: number;
}

export interface CreateStaffMemberRequest {
  firstName: string;
  salary: number;
  employerStaffId?: number;
  restaurantId: number;
}

export interface StaffDto {
  staffId: number;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface CreateStaffRequest {
  firstName: string;
  lastName: string;
}

export interface StaffShiftLogDto {
  shiftLogId: number;
  staffId: number;
  staffFirstName: string;
  staffLastName: string;
  shiftTime: string;
  createdAt: string;
}

export interface CreateStaffShiftLogRequest {
  shiftTime: string;
}

export interface JobAssignmentDto {
  assignmentId: number;
  staffId: number;
  staffFirstName: string;
  staffLastName: string;
  shiftTime: string;
  restaurantId: number;
  createdAt: string;
}

export interface CreateJobAssignmentRequest {
  staffId: number;
  shiftTime: string;
  restaurantId: number;
}

export interface EquipmentDto {
  equipmentId: number;
  assignmentId: number;
  assignmentStaffId: number;
  assignmentStaffName: string;
  name: string;
  createdAt: string;
}

export interface CreateEquipmentRequest {
  assignmentId: number;
  name: string;
}

export interface ReservationDto {
  reservationId: number;
  tableNumber: number;
  reservationTime: string;
  status: ReservationStatusName;
  partySize: number;
}

export const reservationStatusNames = ["pending", "confirmed", "cancelled", "completed"] as const;
export type ReservationStatusName = (typeof reservationStatusNames)[number];

export type FloorTableAvailability = "available" | "reserved";
export type FloorTableStatusFilter = FloorTableAvailability | ReservationStatusName;

export interface FloorTableDto {
  tableNumber: number;
  capacity: number;
  location: string;
  servedByStaffMemberId: number | null;
  activeReservationId: number | null;
  activeReservationTime: string | null;
  activeReservationStatus: ReservationStatusName | null;
  activePartySize: number | null;
  availability: FloorTableAvailability;
}

export interface ReservationDetailsDto {
  reservationId: number;
  tableNumber: number;
  reservationTime: string;
  status: ReservationStatusName;
  partySize: number;
  capacity: number;
  location: string;
}

export interface CreateReservationRequest {
  tableNumber: number;
  reservationTime: string;
  partySize: number;
  status?: ReservationStatusName;
}

export interface UpdateReservationStatusRequest {
  status: ReservationStatusName;
}

export interface CreateTableAssignmentRequest {
  tableNumber: number;
  reservationId?: number;
  menuPrice?: number;
}

export interface TableAssignmentDto {
  assignmentId: number;
  tableNumber: number;
  reservationId: number | null;
  menuPrice: number | null;
  createdAt: string;
}

export interface RestaurantSummaryDto {
  restaurantId: number;
  phoneNumber: string;
  status: string | null;
}

export interface CustomerOrderDto {
  customerOrderId: number;
  customerId: number;
  tableNumber: number;
  dishType: string;
  timeCreated: string;
}

export interface CreateCustomerOrderRequest {
  customerId: number;
  tableNumber: number;
  dishType: string;
}

export interface TicketDto {
  ticketId: number;
  customerOrderId: number;
  partySize: number;
  createdAt: string;
}

export interface CreateTicketRequest {
  customerOrderId: number;
  partySize: number;
}

export interface OrderTicketDto {
  orderTicketId: number;
  ticketId: number;
  customerOrderId: number;
  createdAt: string;
}

export interface CreateOrderTicketRequest {
  ticketId: number;
  customerOrderId: number;
}

export interface KitchenOrderDto {
  kitchenOrderId: number;
  tableNumber: number;
  staffMemberId: number;
  createdAt: string;
}

export interface CreateKitchenOrderRequest {
  tableNumber: number;
  staffMemberId: number;
}

export interface ServiceOrderDto {
  serviceOrderId: number;
  tableNumber: number;
  isAlcoholic: boolean;
  createdAt: string;
}

export interface CreateServiceOrderRequest {
  tableNumber: number;
  isAlcoholic: boolean;
}

export interface KitchenTicketLogDto {
  kitchenTicketLogId: number;
  customerId: number;
  emergencyId: string | null;
  dispatchTime: string | null;
  createdAt: string;
}

export interface CreateKitchenTicketLogRequest {
  customerId: number;
  emergencyId?: string;
  dispatchTime?: string;
}

export interface EmergencyRequestDto {
  orderId: number;
  orderTicketId: number;
  orderTime: string;
  createdAt: string;
}

export interface CreateEmergencyRequestInput {
  orderTicketId: number;
  orderTime: string;
}

export interface PaymentAreaDto {
  paymentAreaId: number;
  emergencyOrderId: number;
  createdAt: string;
}

export interface CreatePaymentAreaRequest {
  emergencyOrderId: number;
}

export interface MenuCategoryDto {
  categoryId: number;
  restaurantId: number;
  name: string;
  currentLocation: string | null;
  createdAt: string;
}

export interface CreateMenuCategoryRequest {
  restaurantId: number;
  name: string;
  currentLocation?: string;
}

export interface DishItemDto {
  itemId: number;
  restaurantId: number;
  categoryId: number;
  categoryName: string;
  itemName: string;
  description: string | null;
  isAlcoholic: boolean;
  isVegetarian: boolean;
  createdAt: string;
}

export interface CreateDishRequest {
  restaurantId: number;
  categoryId: number;
  categoryName: string;
  itemName: string;
  description?: string;
  isAlcoholic?: boolean;
  isVegetarian?: boolean;
}

export interface RecipeDto {
  recipeId: number;
  itemId: number;
  itemName: string;
  isAlcoholic: boolean;
  isVegetarian: boolean;
  instructions: string | null;
}

export interface CreateRecipeRequest {
  itemId: number;
  isAlcoholic?: boolean;
  isVegetarian?: boolean;
  instructions?: string;
}

export interface SupplierDto {
  supplierId: number;
  companyName: string;
  createdAt: string;
}

export interface CreateSupplierRequest {
  companyName: string;
}

export interface IngredientStockDto {
  ingredientId: number;
  stockLevel: number;
  createdAt: string;
}

export interface CreateIngredientStockRequest {
  stockLevel?: number;
}

export interface UpdateIngredientStockRequest {
  stockLevel: number;
}

export interface SupplierIngredientStockDto {
  supplierId: number;
  ingredientId: number;
  createdAt: string;
}

export interface CreateSupplierIngredientStockRequest {
  supplierId: number;
  ingredientId: number;
}

export interface SupplementMaintenanceLogDto {
  maintenanceLogId: number;
  supplierId: number;
  companyName: string;
  loggedAt: string;
  details: string | null;
}

export interface CreateSupplementMaintenanceLogRequest {
  supplierId: number;
  companyName: string;
  details?: string;
}

export interface DashboardKpisDto {
  totalReservations: number;
  activeReservations: number;
  totalTickets: number;
  kitchenQueue: number;
  serviceQueue: number;
  emergencyRequests: number;
  lowStockItems: number;
  totalSuppliers: number;
  totalStaff: number;
  totalStaffMembers: number;
  totalJobAssignments: number;
}

export interface DashboardSummaryDto {
  generatedAt: string;
  kpis: DashboardKpisDto;
  lowStockIngredients: IngredientStockDto[];
  latestReservations: ReservationDetailsDto[];
  latestTickets: TicketDto[];
  latestMaintenanceLogs: SupplementMaintenanceLogDto[];
  upcomingShifts: StaffShiftLogDto[];
}
