"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Pagination from "@mui/material/Pagination";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NotificationErrorState from "@/components/notifications/NotificationErrorState";
import NotificationFilters from "@/components/notifications/NotificationFilters";
import NotificationGrid from "@/components/notifications/NotificationGrid";
import NotificationSkeleton from "@/components/notifications/NotificationSkeleton";
import { useNotifications } from "@/hooks/useNotifications";
import type { NotificationType } from "@/types/notification";

export default function AllNotificationsView() {
  const [notificationType, setNotificationType] =
    useState<NotificationType>("all");
  const [topN, setTopN] = useState(10);
  const [page, setPage] = useState(1);

  const { notifications, pagination, loading, error, isAuthError, refetch, markAsRead } =
    useNotifications({
      page,
      limit: topN,
      notification_type: notificationType,
    });

  const handleTypeChange = (type: NotificationType) => {
    setNotificationType(type);
    setPage(1);
  };

  const handleTopNChange = (n: number) => {
    setTopN(n);
    setPage(1);
  };

  const handleToggleRead = (id: number, currentlyUnread: boolean) => {
    markAsRead(id, currentlyUnread);
  };

  return (
    <Paper elevation={2} sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        sx={{
          mb: 3,
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" sx={{ mb: 1 }}>
            All Notifications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Responsive dashboard — tap a card to toggle read / unread
          </Typography>
        </Box>
        {loading && <CircularProgress size={28} aria-label="Loading" />}
      </Stack>

      <NotificationFilters
        notificationType={notificationType}
        topN={topN}
        onTypeChange={handleTypeChange}
        onTopNChange={handleTopNChange}
      />

      {error && (
        <NotificationErrorState
          message={error}
          isAuthError={isAuthError}
          onRetry={refetch}
        />
      )}

      {loading && !error && <NotificationSkeleton count={topN > 6 ? 6 : topN} />}

      {!loading && !error && notifications.length === 0 && (
        <Typography color="text.secondary" align="center" sx={{ py: 6 }}>
          No notifications match your filters.
        </Typography>
      )}

      {!loading && !error && notifications.length > 0 && (
        <>
          <NotificationGrid
            notifications={notifications}
            onToggleRead={handleToggleRead}
          />

          {pagination && pagination.totalPages > 1 && (
            <Stack sx={{ mt: 4, alignItems: "center" }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                showFirstButton
                showLastButton
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                Showing page {pagination.page} of {pagination.totalPages} (
                {pagination.total} total)
              </Typography>
            </Stack>
          )}
        </>
      )}
    </Paper>
  );
}
