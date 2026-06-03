"use client";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import { NOTIFICATION_TYPE_OPTIONS, TOP_N_OPTIONS } from "@/constants/notifications";
import type { NotificationType } from "@/types/notification";

type Props = {
  notificationType: NotificationType;
  topN: number;
  onTypeChange: (type: NotificationType) => void;
  onTopNChange: (n: number) => void;
};

export default function NotificationFilters({
  notificationType,
  topN,
  onTypeChange,
  onTopNChange,
}: Props) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      sx={{ mb: 3 }}
    >
      <FormControl fullWidth size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="type-filter-label">Notification type</InputLabel>
        <Select
          labelId="type-filter-label"
          label="Notification type"
          value={notificationType}
          onChange={(e) => onTypeChange(e.target.value as NotificationType)}
        >
          {NOTIFICATION_TYPE_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="top-n-label">Top n notifications</InputLabel>
        <Select
          labelId="top-n-label"
          label="Top n notifications"
          value={topN}
          onChange={(e) => onTopNChange(Number(e.target.value))}
        >
          {TOP_N_OPTIONS.map((n) => (
            <MenuItem key={n} value={n}>
              Top {n}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}
