"use client";

import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type Props = {
  message: string;
  isAuthError?: boolean;
  onRetry: () => void;
};

export default function NotificationErrorState({
  message,
  isAuthError,
  onRetry,
}: Props) {
  return (
    <Alert severity="error" sx={{ mb: 3 }}>
      <AlertTitle>{isAuthError ? "Authentication failed" : "Could not load notifications"}</AlertTitle>
      <Stack spacing={1}>
        <Typography variant="body2">{message}</Typography>
        {isAuthError && (
          <Typography variant="body2" color="text.secondary">
            Set <code>NEXT_PUBLIC_ACCESS_TOKEN</code> in{" "}
            <code>notification_app_fe/.env.local</code> to match backend{" "}
            <code>ACCESS_TOKEN</code> in <code>notification_app_be/.env</code>.
          </Typography>
        )}
        <Button variant="outlined" color="inherit" size="small" onClick={onRetry}>
          Retry
        </Button>
      </Stack>
    </Alert>
  );
}
