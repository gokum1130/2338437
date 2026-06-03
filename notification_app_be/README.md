# notification_app_be

Backend service for the notification application.

## Structure

- `src/index.js` — application entry point
- `src/middleware/logging_middleware.js` — logs HTTP method, URL, status code, and response time

## Run

```bash
npm install
npm run dev
```

Health check: `GET http://localhost:3000/health`
