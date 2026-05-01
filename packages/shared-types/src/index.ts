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

export interface ReservationDto {
  reservationId: number;
  tableNumber: number;
  reservationTime: string;
  status: string;
}
