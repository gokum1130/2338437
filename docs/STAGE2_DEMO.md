# Stage 2 Demo — Screen Recording Checklist

## Before recording

```bash
# Terminal 1
cd notification_app_be
npm run dev

# Terminal 2
cd notification_app_fe
npm run dev
```

Open http://localhost:3000

## What to show (30–60 seconds)

1. **Dashboard** — All Notifications grid loads
2. **Type filter** — switch Placement / Result / Event
3. **Top n** — change 5 → 10 → 15
4. **Pagination** — next page if visible
5. **Read / unread** — tap card; unread = bright blue highlight
6. **Error handling** (optional) — stop backend, show error + Retry

## Record on Windows

- `Win + Alt + R` or Xbox Game Bar (`Win + G`) → Capture → Record

## Demo video file location
https://drive.google.com/file/d/1J7Lj90lBL63XZPddEBJfQm6Y7dpyZjwV/view?usp=sharing

## Final push

```bash
git add .
git commit -m "fix(fe): prevent infinite re-fetch loop in useNotifications"
git push origin main
```
