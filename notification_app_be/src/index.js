const express = require("express");
const loggingMiddleware = require("./middleware/logging_middleware");
const NotificationStreamHandler = require("./stream");

const app = express();
const PORT = process.env.PORT || 3000;
const streamHandler = new NotificationStreamHandler();

app.use(express.json());
app.use(loggingMiddleware);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/notifications/stream", (req, res) => {
  try {
    const added = streamHandler.push(req.body);
    res.status(201).json({
      added,
      stats: streamHandler.getStats(),
      top: streamHandler.getTop10(),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/notifications/top", (_req, res) => {
  res.json({
    stats: streamHandler.getStats(),
    notifications: streamHandler.getTop10(),
  });
});

app.listen(PORT, () => {
  console.log(`Notification app backend running on port ${PORT}`);
});
