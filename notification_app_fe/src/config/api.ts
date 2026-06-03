export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/**
 * Access token for protected API routes.
 * Set in notification_app_fe/.env.local:
 *   NEXT_PUBLIC_ACCESS_TOKEN=your-token-here
 * Must match backend ACCESS_TOKEN in notification_app_be/.env
 */
export const ACCESS_TOKEN = process.env.NEXT_PUBLIC_ACCESS_TOKEN ?? "";

export function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (ACCESS_TOKEN) {
    headers.Authorization = `Bearer ${ACCESS_TOKEN}`;
  }

  return headers;
}
