import Container from "@mui/material/Container";
import AllNotificationsView from "@/components/notifications/AllNotificationsView";

export default function Home() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <AllNotificationsView />
    </Container>
  );
}
