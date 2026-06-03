const express = require("express");
const loggingMiddleware = require("./middleware/logging_middleware");
const NotificationStreamHandler = require("./stream");
const { NOTIFICATION_TYPES } = require("./priority");

const SAMPLE_STREAM = [
  { type: NOTIFICATION_TYPES.EVENT, message: "Tech talk at 4 PM" },
  { type: NOTIFICATION_TYPES.RESULT, message: "Mid-sem grades published" },
  { type: NOTIFICATION_TYPES.PLACEMENT, message: "Amazon SDE offer" },
  { type: NOTIFICATION_TYPES.EVENT, message: "Hackathon registration open" },
  { type: NOTIFICATION_TYPES.RESULT, message: "Assignment scores updated" },
  { type: NOTIFICATION_TYPES.EVENT, message: "Guest lecture cancelled" },
  { type: NOTIFICATION_TYPES.PLACEMENT, message: "Microsoft internship offer" },
  { type: NOTIFICATION_TYPES.EVENT, message: "Sports day schedule" },
  { type: NOTIFICATION_TYPES.RESULT, message: "Lab viva results out" },
  { type: NOTIFICATION_TYPES.EVENT, message: "Library extended hours" },
  { type: NOTIFICATION_TYPES.PLACEMENT, message: "Google placement offer" },
  { type: NOTIFICATION_TYPES.RESULT, message: "End-sem results declared" },
  { type: NOTIFICATION_TYPES.EVENT, message: "Cultural fest tomorrow" },
  { type: NOTIFICATION_TYPES.PLACEMENT, message: "Flipkart offer letter" },
  { type: NOTIFICATION_TYPES.EVENT, message: "Fee payment reminder" },
];

async function runDemo() {
  const handler = new NotificationStreamHandler();
  const app = express();

  app.use(express.json());
  app.use(loggingMiddleware);

  app.post("/notifications/stream", (req, res) => {
    const added = handler.push(req.body);
    res.status(201).json({ added, stats: handler.getStats() });
  });

  app.get("/notifications/top", (_req, res) => {
    res.json({
      stats: handler.getStats(),
      notifications: handler.getTop10(),
    });
  });

  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  console.log("=== Notification Stream Demo ===\n");
  console.log(`Streaming ${SAMPLE_STREAM.length} notifications...\n`);

  for (const notification of SAMPLE_STREAM) {
    await fetch(`${baseUrl}/notifications/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notification),
    });
  }

  const topResponse = await fetch(`${baseUrl}/notifications/top`);
  const topPayload = await topResponse.json();

  console.log("\n=== TOP 10 NOTIFICATIONS (by priority) ===\n");
  topPayload.notifications.forEach((item, index) => {
    console.log(
      `${index + 1}. [${item.type.toUpperCase()}] w=${item.weight} — ${item.message}`
    );
  });

  console.log("\n=== STREAM STATS ===");
  console.log(JSON.stringify(topPayload.stats, null, 2));

  server.close();
}

runDemo().catch((error) => {
  console.error("Stream demo failed:", error);
  process.exit(1);
});
