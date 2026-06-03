# Notification App

Monorepo-style project with a Node.js backend for notification services.

## Project Structure

```
.
├── .gitignore
├── README.md
├── notification_system_design.md
└── notification_app_be/
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
