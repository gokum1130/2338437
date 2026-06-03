import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import BackendStatus from "@/components/BackendStatus";

export default function Home() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Notification App
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Stage 2 frontend — Next.js + Material UI. Running on{" "}
          <Box component="strong" sx={{ color: "text.primary" }}>
            http://localhost:3000
          </Box>
          .
        </Typography>
        <BackendStatus />
      </Paper>
    </Container>
  );
}
