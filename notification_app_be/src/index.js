const express = require("express");
const loggingMiddleware = require("./middleware/logging_middleware");
const authMiddleware = require("./middleware/auth_middleware");
const NotificationStreamHandler = require("./stream");
const NotificationStore = require("./notificationStore");

const app = express();
const PORT = process.env.PORT || 3001;
const FE_ORIGIN = process.env.FE_ORIGIN || "http://localhost:3000";
const streamHandler = new NotificationStreamHandler();
const notificationStore = new NotificationStore();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", FE_ORIGIN);
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-access-token"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());
app.use(loggingMiddleware);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/notifications/stream", authMiddleware, (req, res) => {
  try {
    const added = streamHandler.push(req.body);
    notificationStore.add(req.body);
    res.status(201).json({
      added,
      stats: streamHandler.getStats(),
      top: streamHandler.getTop10(),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/notifications/top", authMiddleware, (_req, res) => {
  res.json({
    stats: streamHandler.getStats(),
    notifications: streamHandler.getTop10(),
  });
});

app.get("/notifications", authMiddleware, (req, res) => {
  const { page, limit, notification_type } = req.query;
  const result = notificationStore.list({
    page,
    limit,
    notification_type,
  });
  res.json(result);
});

app.patch("/notifications/:id/read", authMiddleware, (req, res) => {
  const { read = true } = req.body ?? {};
  const updated = notificationStore.setReadState(req.params.id, read);

  if (!updated) {
    return res.status(404).json({ error: "Notification not found" });
  }

  res.json({ notification: updated });
});

app.listen(PORT, () => {
  console.log(`Notification app backend running on port ${PORT}`);
  if (process.env.ACCESS_TOKEN) {
    console.log("ACCESS_TOKEN auth enabled on protected routes");
  }
});
