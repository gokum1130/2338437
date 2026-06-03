# Notification System Design

Design document for a priority-aware notification platform that ingests a continuous stream of campus notifications and surfaces the most important items to users.

---

## System Approach

The system follows a **stream-and-rank** model:

1. **Ingest** — Notifications arrive continuously via a stream endpoint (`POST /notifications/stream`). Each item carries a type (`placement`, `result`, or `event`) and a message payload.

2. **Weight & Rank** — Every notification is assigned a fixed priority weight. Higher-weight types always outrank lower-weight types regardless of arrival order.

3. **Hold Top N** — A bounded in-memory buffer retains only the top 10 notifications by priority. Lower-priority items are evicted when the buffer is full.

4. **Serve & Observe** — Clients fetch the current top 10 via `GET /notifications/top`. All HTTP traffic passes through a logging middleware that records method, URL, status code, and response time for observability.

### Priority Model

| Type       | Weight | Rationale                                      |
|------------|--------|------------------------------------------------|
| Placement  | 3      | Highest impact — job offers and career outcomes |
| Result     | 2      | Academic outcomes — grades and exam results     |
| Event      | 1      | Informational — talks, reminders, schedules     |

**Rule:** Placement > Result > Event

### Architecture (Stage 1)

```
┌─────────────┐     POST /notifications/stream     ┌──────────────────────┐
│   Producer  │ ─────────────────────────────────► │  Express API Server  │
│  (stream)   │                                    │  + logging middleware │
└─────────────┘                                    └──────────┬───────────┘
                                                               │
                                                               ▼
                                                    ┌──────────────────────┐
                                                    │ NotificationStream   │
                                                    │ Handler (top 10)     │
                                                    │  → priority.js       │
                                                    └──────────┬───────────┘
                                                               │
                     GET /notifications/top                    │
┌─────────────┐ ◄──────────────────────────────────────────────┘
│   Client    │
└─────────────┘
```

### Key Components

| Component              | Location                                      | Responsibility                          |
|------------------------|-----------------------------------------------|-----------------------------------------|
| `priority.js`          | `notification_app_be/src/priority.js`         | Weight map and sort helpers             |
| `stream.js`            | `notification_app_be/src/stream.js`           | Bounded buffer, top-10 retention        |
| `logging_middleware.js`| `notification_app_be/src/middleware/`         | Request/response logging                |
| `index.js`             | `notification_app_be/src/index.js`            | HTTP entry point and route wiring       |
| `demo_stream.js`       | `notification_app_be/src/demo_stream.js`      | End-to-end stream simulation            |

---

## Complexities

### 1. Continuous Stream vs. Bounded Memory

Notifications arrive indefinitely, but only 10 can be held at once. The handler must re-sort on every push and evict the lowest-priority entries — including items that arrived earlier but ranked higher at the time.

### 2. Priority Tie-Breaking

When two notifications share the same type (and therefore the same weight), Stage 1 does not define a secondary sort key. Order among equals is non-deterministic (depends on sort stability and insertion order). Future stages may add timestamp-based tie-breaking.

### 3. In-Memory State

Stage 1 stores notifications in process memory. A server restart clears the buffer. There is no persistence, replication, or multi-instance coordination.

### 4. Single-Node Assumption

The stream handler is a singleton within one Node.js process. Horizontal scaling would require a shared store (e.g. Redis sorted set) and a distributed locking or partitioning strategy.

### 5. No Deduplication

Identical messages pushed multiple times are treated as separate entries. Deduplication by content hash or external ID is out of scope for Stage 1.

### 6. Observability Scope

Logging middleware covers HTTP-layer metrics only. Stream-internal events (evictions, re-ranks) are not logged separately in Stage 1.

### 7. Validation & Error Handling

Unknown notification types throw at weight lookup time. Malformed payloads return `400` from the API. There is no schema validation library in Stage 1.

---

## Stage 1

Stage 1 delivers a **working backend prototype** with project scaffolding, core priority logic, stream handling, and basic observability.

### Goals

- Establish repo structure with `.gitignore` and backend folder layout
- Implement weight-based priority sorting (Placement > Result > Event)
- Build a stream handler that retains the top 10 notifications from continuous input
- Integrate HTTP logging middleware on all API routes
- Provide a runnable demo (`npm run demo:stream`) with documented output

### Deliverables

| Commit | Description                                              |
|--------|----------------------------------------------------------|
| 1      | Project structure, `.gitignore`, logging middleware      |
| 2      | Core priority sorting logic (`priority.js`)              |
| 3      | Stream handler + top-10 retention + demo with logs       |
| 4      | This design document                                     |

### API Endpoints (Stage 1)

| Method | Path                     | Description                        |
|--------|--------------------------|------------------------------------|
| GET    | `/health`                | Health check                       |
| POST   | `/notifications/stream`  | Ingest one notification          |
| GET    | `/notifications/top`     | Return current top 10 by priority  |

### Example Flow

1. Producer sends 15 notifications (mix of placement, result, event).
2. Stream handler accepts each via `push()`, re-sorts, keeps top 10.
3. Client calls `GET /notifications/top` and receives 4 placements, 4 results, 2 events.
4. Logging middleware records all 16 HTTP requests (15 POST + 1 GET).

### Out of Scope (Later Stages)

- Database persistence (PostgreSQL, MongoDB)
- WebSocket or SSE real-time push to clients
- Distributed stream processing (Kafka, Redis Streams)

---

## Stage 2

Stage 2 adds the **Next.js + MUI frontend** and a **paginated notifications API**.

### Frontend

- Responsive card grid (`notification_app_fe`)
- Query params: `page`, `limit`, `notification_type`
- Top **n** selector (5 / 10 / 15 / 20)
- Read / unread toggle with bright dynamic styling on unread cards
- Loading skeletons, error UI with retry, 15s live refresh

### API Endpoints (Stage 2)

| Method | Path                         | Description                              |
|--------|------------------------------|------------------------------------------|
| GET    | `/notifications`               | Paginated list (`page`, `limit`, `notification_type`) |
| PATCH  | `/notifications/:id/read`      | Set `{ "read": true \| false }`          |

Protected routes accept optional `Authorization: Bearer <token>` when `ACCESS_TOKEN` is set on the backend.

### Access Token

| Location | Variable |
|----------|----------|
| Frontend | `NEXT_PUBLIC_ACCESS_TOKEN` in `notification_app_fe/.env.local` |
| Backend  | `ACCESS_TOKEN` in `notification_app_be/.env` |

### How to Run

```bash
# Backend (port 3001)
cd notification_app_be
npm install
npm run dev

# Frontend (port 3000)
cd notification_app_fe
npm install
npm run dev
```
