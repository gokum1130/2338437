import { API_BASE_URL, getAuthHeaders } from "@/config/api";

export type ApiLogEntry = {
  method: string;
  path: string;
  status: number;
  durationMs: number;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Wraps fetch calls to the backend so each request passes through
 * Express logging_middleware (server-side logs) while mirroring
 * a summary on the frontend console.
 */
export async function apiRequest<T>(
  path: string,
  init?: RequestInit
): Promise<{ data: T; log: ApiLogEntry }> {
  const method = init?.method ?? "GET";
  const url = `${API_BASE_URL}${path}`;
  const start = Date.now();

  console.log(
    `[FE Logging] ${method} ${path} -> triggers backend logging_middleware`
  );

  const response = await fetch(url, {
    ...init,
    headers: {
      ...getAuthHeaders(),
      ...init?.headers,
    },
  });

  const durationMs = Date.now() - start;
  const log: ApiLogEntry = { method, path, status: response.status, durationMs };

  console.log(
    `[FE Logging] ${method} ${path} ${response.status} - ${durationMs}ms`
  );

  if (!response.ok) {
    let message = `API ${response.status} on ${path}`;
    try {
      const body = (await response.json()) as { error?: string };
      if (body.error) {
        message = body.error;
      }
    } catch {
      // ignore parse errors
    }
    throw new ApiError(message, response.status);
  }

  const data = (await response.json()) as T;
  return { data, log };
}

export const loggingService = {
  checkHealth: () => apiRequest<{ status: string }>("/health"),
};
