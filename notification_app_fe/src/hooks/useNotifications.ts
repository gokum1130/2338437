"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/services/loggingService";
import { notificationApi } from "@/services/notificationApi";
import type {
  Notification,
  NotificationType,
  PaginationMeta,
} from "@/types/notification";

type UseNotificationsState = {
  notifications: Notification[];
  pagination: PaginationMeta | null;
  loading: boolean;
  error: string | null;
  isAuthError: boolean;
};

export function useNotifications(
  page: number,
  limit: number,
  notification_type: NotificationType
) {
  const [state, setState] = useState<UseNotificationsState>({
    notifications: [],
    pagination: null,
    loading: true,
    error: null,
    isAuthError: false,
  });

  const fetchData = useCallback(
    async (showLoading = true) => {
      if (showLoading) {
        setState((prev) => ({
          ...prev,
          loading: true,
          error: null,
          isAuthError: false,
        }));
      }

      try {
        const { data } = await notificationApi.fetchNotifications({
          page,
          limit,
          notification_type,
        });
        setState({
          notifications: data.data,
          pagination: data.pagination,
          loading: false,
          error: null,
          isAuthError: false,
        });
      } catch (err) {
        const isAuthError = err instanceof ApiError && err.status === 401;
        setState({
          notifications: [],
          pagination: null,
          loading: false,
          error:
            err instanceof Error
              ? err.message
              : "Failed to load notifications",
          isAuthError,
        });
      }
    },
    [page, limit, notification_type]
  );

  useEffect(() => {
    fetchData(true);
    const interval = setInterval(() => fetchData(false), 15_000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const updateLocalRead = useCallback((id: number, read: boolean) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === id ? { ...n, read } : n
      ),
    }));
  }, []);

  const markAsRead = useCallback(
    async (id: number, read = true) => {
      updateLocalRead(id, read);
      try {
        await notificationApi.markRead(id, read);
      } catch {
        await fetchData(false);
      }
    },
    [fetchData, updateLocalRead]
  );

  return {
    ...state,
    refetch: () => fetchData(true),
    markAsRead,
  };
}
