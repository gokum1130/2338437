# notification_app_fe

Next.js frontend for the notification application (Stage 2).

## Stack

- Next.js 15 (App Router)
- React 19
- Material UI (MUI)

## Structure

```
src/
├── app/              # Next.js routes
├── components/       # ThemeRegistry, BackendStatus
├── config/           # API base URL
├── services/         # loggingService (backend logging_middleware bridge)
└── theme/            # MUI theme
```

## Ports

| Service  | URL                      |
|----------|--------------------------|
| Frontend | http://localhost:3000    |
| Backend  | http://localhost:3001    |

The backend runs on **3001** so the frontend can use the default Next.js port **3000**.

## Setup

```bash
npm install
cp .env.example .env.local   # optional
npm run dev
```

Open http://localhost:3000 and use **Ping backend** to trigger `loggingService`, which calls the API and activates backend `logging_middleware`.

## Logging service

`src/services/loggingService.ts` wraps all backend `fetch` calls. Each request:

1. Logs on the frontend console (`[FE Logging]`)
2. Hits the Express API, which runs `logging_middleware` on the server
