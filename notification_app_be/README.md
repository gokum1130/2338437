# notification_app_be

Backend service for the notification application.

## Structure

- `src/index.js` — application entry point
- `src/priority.js` — priority sorting (Placement > Result > Event)
- `src/stream.js` — stream handler; keeps top 10 notifications from continuous input
- `src/demo_stream.js` — demo script with logging middleware output
- `src/middleware/logging_middleware.js` — logs HTTP method, URL, status code, and response time

## Priority Weights

| Type       | Weight |
|------------|--------|
| Placement  | 3      |
| Result     | 2      |
| Event      | 1      |

Use `sortByPriority(notifications)` to sort a list by descending priority.

## Stream API

- `POST /notifications/stream` — ingest one notification `{ "type": "placement|result|event", "message": "..." }`
- `GET /notifications/top` — return current top 10 by priority (requests logged via middleware)

Run the stream demo (logs + top 10 output):

```bash
npm run demo:stream
```

## Run

```bash
npm install
npm run dev
```

Health check: `GET http://localhost:3001/health` (port 3001 when frontend uses 3000)
