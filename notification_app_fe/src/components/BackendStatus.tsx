"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { loggingService, type ApiLogEntry } from "@/services/loggingService";
import { API_BASE_URL } from "@/config/api";

export default function BackendStatus() {
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<ApiLogEntry | null>(null);
  const [health, setHealth] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handlePingBackend() {
    setLoading(true);
    setError(null);
    setLog(null);
    setHealth(null);

    try {
      const { data, log: entry } = await loggingService.checkHealth();
      setHealth(data.status);
      setLog(entry);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Backend unreachable. Start notification_app_be on port 3001."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ mt: 3, maxWidth: 480 }}>
      <Stack spacing={2}>
        <Typography variant="body2" color="text.secondary">
          API base: {API_BASE_URL}
        </Typography>
        <Button
          variant="contained"
          onClick={handlePingBackend}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
        >
          Ping backend (logging_middleware)
        </Button>
        {health && (
          <Alert severity="success">Backend health: {health}</Alert>
        )}
        {log && (
          <Alert severity="info">
            Last request: {log.method} {log.path} — {log.status} ({log.durationMs}ms).
            Check backend terminal for logging_middleware output.
          </Alert>
        )}
        {error && <Alert severity="error">{error}</Alert>}
      </Stack>
    </Box>
  );
}
