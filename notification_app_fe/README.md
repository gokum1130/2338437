# notification_app_fe

Next.js + MUI frontend for the notification application.

## Ports

| Service  | URL                   |
|----------|-----------------------|
| Frontend | http://localhost:3000 |
| Backend  | http://localhost:3001 |

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Where to enter the access token

Create **`notification_app_fe/.env.local`** (this file is git-ignored):

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ACCESS_TOKEN=your-secret-token-here
```

If the backend requires auth, set the **same value** in **`notification_app_be/.env`**:

```env
ACCESS_TOKEN=your-secret-token-here
```

Leave both empty for open dev mode (no token required).

## Features (Stage 2)

- Responsive **All Notifications** card grid
- Live API with pagination (`page`, `limit`) and `notification_type` filter
- **Top n** dropdown (5 / 10 / 15 / 20)
- Read / unread visual states (bright highlight + pulse on unread)
- Loading skeletons, error fallback with retry
- Auto-refresh every 15 seconds

## Record demo video

1. Start backend: `cd notification_app_be && npm run dev`
2. Start frontend: `cd notification_app_fe && npm run dev`
3. Open http://localhost:3000
4. Windows: `Win + G` → Record screen
5. Show filters, pagination, tap cards to toggle read/unread
