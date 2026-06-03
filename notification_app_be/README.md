# notification_app_be

Backend service for the notification application.

## Structure

- `src/index.js` — application entry point
- `src/priority.js` — priority sorting (Placement > Result > Event)
- `src/middleware/logging_middleware.js` — logs HTTP method, URL, status code, and response time

## Priority Weights

| Type       | Weight |
|------------|--------|
| Placement  | 3      |
| Result     | 2      |
| Event      | 1      |

Use `sortByPriority(notifications)` to sort a list by descending priority.

## Run

```bash
npm install
npm run dev
```

Health check: `GET http://localhost:3000/health`
