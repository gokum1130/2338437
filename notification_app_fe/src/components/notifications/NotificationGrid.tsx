"use client";

import Box from "@mui/material/Box";
import NotificationCard from "@/components/notifications/NotificationCard";
import type { Notification } from "@/types/notification";

type Props = {
  notifications: Notification[];
  onToggleRead: (id: number, read: boolean) => void;
};

export default function NotificationGrid({ notifications, onToggleRead }: Props) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        },
        gap: 2,
      }}
    >
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onToggleRead={onToggleRead}
        />
      ))}
    </Box>
  );
}
