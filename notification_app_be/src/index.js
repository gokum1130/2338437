const express = require("express");
const loggingMiddleware = require("./middleware/logging_middleware");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(loggingMiddleware);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Notification app backend running on port ${PORT}`);
});
