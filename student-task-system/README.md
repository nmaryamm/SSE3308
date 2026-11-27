# Student Task System

A web app where students register, log in, and manage their own study tasks (add, rename, complete, delete).

| Part | Technology |
|---|---|
| Frontend | React + Vite (`src/`) |
| Login | Firebase Authentication (email + password) |
| Backend API | Node.js + Express (`server/`) |
| Database | Cloud Firestore, accessed **only** by the backend through the Firebase Admin SDK |

```
Browser (React) ──login──▶ Firebase Authentication
      │
      │  HTTPS + "Authorization: Bearer <Firebase ID token>"
      ▼
Express API (server/) ──Admin SDK──▶ Cloud Firestore
  verifies the token, checks task ownership,     (firestore.rules deny all
  validates input, rate limits                    direct browser access)
```

## Security design

- **Every `/api` request needs a valid Firebase ID token.** The student's uid is taken from the verified token, never from the request.
- **Ownership check:** a task can only be read or changed by the student who created it. Someone else's task returns `404`, exactly like a task that does not exist.
- **Input validation:** titles must be 1–100 characters; any unexpected field (`uid`, `completed` on create, `createdAt`, ...) is rejected with `400`.
- **Firestore rules deny all direct access** (`firestore.rules`). The Admin SDK ignores rules, so all checks live in Express.
- Helmet security headers, CORS restricted to the frontend's address, JSON bodies limited to 10 KB, rate limit of 100 requests per 15 minutes per IP, and generic error messages (details are only logged on the server).
- The service account key lives only in `server/.env` (git-ignored) or in Render's environment settings.

## API

| Method | Path | Body | Result |
|---|---|---|---|
| `POST` | `/api/tasks` | `{ "title": "..." }` | `201 { task }` |
| `GET` | `/api/tasks` | – | `200 { tasks: [...] }` (newest first) |
| `GET` | `/api/tasks/:id` | – | `200 { task }` |
| `PUT` | `/api/tasks/:id` | `{ "title": "..." }` | `200 { task }` |
| `PATCH` | `/api/tasks/:id/complete` | none (toggle) or `{ "completed": true/false }` | `200 { task }` |
| `DELETE` | `/api/tasks/:id` | – | `204` |
| `GET` | `/health` | – | `200 { "status": "ok" }` (no login needed) |

Errors are always `{ "error": "message" }` with status `400`, `401`, `404`, `413`, `429` or `500`.

## Run locally (GitHub Codespaces)

1. **Service account key:** Firebase Console → Project settings → Service accounts → *Generate new private key*. Do not put the downloaded file in this project.
2. **Backend** (terminal 1):
   ```bash
   cd student-task-system/server
   npm install
   cp .env.example .env    # then fill in FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY
   npm run dev             # http://localhost:3000/health
   ```
3. **Frontend** (terminal 2):
   ```bash
   cd student-task-system
   npm install
   npm run dev             # open the port 5173 link from the Ports tab
   ```
   During development Vite forwards `/api` to `localhost:3000`, so no extra settings are needed.

## Security tests

```bash
cd student-task-system/server
npm test            # 95 tests on the Firebase emulators, two student accounts (never touches real data)
npm run test:live   # 5 forged-token tests against the real project (reads .env, changes nothing)
```

The tests cover unauthenticated access, invalid/expired/forged tokens, reading/changing/deleting another student's tasks (IDOR), fake uid injection, mass assignment, XSS payloads, malformed and oversized requests, rate limiting, direct Firestore access and information leakage.

## Deploy

**Firestore rules** (free Spark plan is enough):
```bash
cd student-task-system
firebase deploy --only firestore:rules
```

**Backend – Render Web Service**

| Setting | Value |
|---|---|
| Root Directory | `student-task-system/server` |
| Build Command | `npm ci` |
| Start Command | `npm start` |
| Health Check Path | `/health` |
| Environment | `NODE_VERSION=22`, `NODE_ENV=production`, `TRUST_PROXY=1`, `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `ALLOWED_ORIGINS` (the frontend's address) |

**Frontend – Render Static Site**

| Setting | Value |
|---|---|
| Root Directory | `student-task-system` |
| Build Command | `npm ci && npm run build` |
| Publish Directory | `dist` |
| Environment | `NODE_VERSION=22`, `VITE_API_URL` (the backend's address) |

Render's free web services sleep after about 15 minutes without traffic; the first request afterwards can take up to a minute.

## Folder overview

```
src/                 React frontend (api.js sends requests to the backend)
server/src/          Express API (auth middleware, validation, routes, error handler)
server/test/         Automated security tests
firestore.rules      Denies all direct Firestore access
functions/           Old Cloud Functions version (no longer used or deployed)
```
