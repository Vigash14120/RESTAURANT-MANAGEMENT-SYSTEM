import type { ApiResponse, ApiSuccessResponse } from "@rms/shared-types";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

export async function fetchApi<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers
    }
  });

  const payload = (await response.json()) as ApiResponse<T>;
  return payload;
}

export function isApiSuccess<T>(payload: ApiResponse<T>): payload is ApiSuccessResponse<T> {
  return payload.success;
}
