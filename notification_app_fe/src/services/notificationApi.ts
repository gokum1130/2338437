import { apiRequest } from "@/services/loggingService";
import type {
  Notification,
  NotificationQueryParams,
  NotificationsResponse,
} from "@/types/notification";

function buildQuery(params: NotificationQueryParams): string {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));

  if (params.notification_type && params.notification_type !== "all") {
    search.set("notification_type", params.notification_type);
  }

  return `/notifications?${search.toString()}`;
}

export const notificationApi = {
  fetchNotifications: (params: NotificationQueryParams) =>
    apiRequest<NotificationsResponse>(buildQuery(params)),

  markRead: (id: number, read = true) =>
    apiRequest<{ notification: Notification }>(
      `/notifications/${id}/read`,
      {
        method: "PATCH",
        body: JSON.stringify({ read }),
      }
    ),
};
