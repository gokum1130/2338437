# Notification App

Monorepo-style project with a Node.js backend and Next.js frontend for notification services.

## Project Structure

```
.
├── .gitignore
├── README.md
├── notification_system_design.md
├── notification_app_be/
└── notification_app_fe/
    ├── package.json
    └── src/
        ├── index.js
        ├── priority.js
        ├── stream.js
        ├── demo_stream.js
        └── middleware/
            └── logging_middleware.js
```

## Backend (`notification_app_be`)

Express-based API with request logging middleware.

### Setup

```bash
cd notification_app_be
npm install
npm run dev
```

### Scripts

- `npm start` — run the server
- `npm run dev` — run with file watch (Node 18+)

## Frontend (`notification_app_fe`)

Next.js + MUI on **http://localhost:3000**. Backend API on **http://localhost:3001**.

```bash
cd notification_app_fe
npm install
cp .env.example .env.local   # add NEXT_PUBLIC_ACCESS_TOKEN if backend uses auth
npm run dev
```

**Access token:** set `NEXT_PUBLIC_ACCESS_TOKEN` in `notification_app_fe/.env.local` (must match `ACCESS_TOKEN` in `notification_app_be/.env`). See [notification_app_fe/README.md](notification_app_fe/README.md).
