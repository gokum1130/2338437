export type NotificationType = "placement" | "result" | "event" | "all";

export type Notification = {
  id: number;
  type: string;
  message: string;
  timestamp: string;
  weight: number;
  read: boolean;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type NotificationsResponse = {
  data: Notification[];
  pagination: PaginationMeta;
};

export type NotificationQueryParams = {
  page: number;
  limit: number;
  notification_type: NotificationType;
};
