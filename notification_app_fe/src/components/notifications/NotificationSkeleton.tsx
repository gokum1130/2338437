"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

type Props = {
  count?: number;
};

export default function NotificationSkeleton({ count = 6 }: Props) {
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
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index}>
          <CardContent>
            <Stack spacing={1.5}>
              <Skeleton variant="rounded" width={80} height={24} />
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="60%" />
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
