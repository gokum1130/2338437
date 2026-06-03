"use client";

import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha, keyframes } from "@mui/material/styles";
import type { Notification } from "@/types/notification";

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(21, 101, 192, 0.35); }
  50% { box-shadow: 0 0 0 8px rgba(21, 101, 192, 0); }
`;

const TYPE_COLORS: Record<string, "primary" | "secondary" | "default"> = {
  placement: "primary",
  result: "secondary",
  event: "default",
};

type Props = {
  notification: Notification;
  onToggleRead: (id: number, read: boolean) => void;
};

export default function NotificationCard({ notification, onToggleRead }: Props) {
  const isUnread = !notification.read;

  return (
    <Card
      elevation={isUnread ? 4 : 1}
      sx={(theme) => ({
        height: "100%",
        borderLeft: 4,
        borderColor: isUnread
          ? theme.palette.primary.main
          : theme.palette.divider,
        bgcolor: isUnread
          ? alpha(theme.palette.primary.main, 0.12)
          : theme.palette.background.paper,
        transition: "background-color 0.35s ease, box-shadow 0.35s ease, transform 0.2s ease",
        animation: isUnread ? `${pulse} 2.5s ease-in-out infinite` : "none",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: theme.shadows[6],
        },
      })}
    >
      <CardActionArea
        onClick={() => onToggleRead(notification.id, isUnread)}
        sx={{ height: "100%", alignItems: "stretch" }}
      >
        <CardContent>
          <Stack spacing={1.5}>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <Chip
                label={notification.type}
                color={TYPE_COLORS[notification.type] ?? "default"}
                size="small"
              />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: isUnread ? 700 : 400,
                  color: isUnread ? "primary.main" : "text.secondary",
                }}
              >
                {isUnread ? "UNREAD" : "READ"}
              </Typography>
            </Stack>
            <Typography
              variant="body1"
              sx={{
                fontWeight: isUnread ? 700 : 400,
                color: isUnread ? "text.primary" : "text.secondary",
              }}
            >
              {notification.message}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Priority weight: {notification.weight} ·{" "}
              {new Date(notification.timestamp).toLocaleString()}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
