import { API_BASE_URL } from "@/config/api";

export type ApiLogEntry = {
  method: string;
  path: string;
  status: number;
  durationMs: number;
};

/**
 * Wraps fetch calls to the backend so each request passes through
 * Express logging_middleware (server-side logs) while mirroring
 * a summary on the frontend console.
 */
async function request<T>(
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
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const durationMs = Date.now() - start;
  const log: ApiLogEntry = { method, path, status: response.status, durationMs };

  console.log(
    `[FE Logging] ${method} ${path} ${response.status} - ${durationMs}ms`
  );

  if (!response.ok) {
    throw new Error(`API ${response.status} on ${path}`);
  }

  const data = (await response.json()) as T;
  return { data, log };
}

export const loggingService = {
  checkHealth: () => request<{ status: string }>("/health"),

  getTopNotifications: () =>
    request<{
      stats: { totalReceived: number; held: number; limit: number };
      notifications: Array<{
        id: number;
        type: string;
        message: string;
        weight: number;
      }>;
    }>("/notifications/top"),

  pushNotification: (body: { type: string; message: string }) =>
    request("/notifications/stream", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};
