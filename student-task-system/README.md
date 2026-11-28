# Student Task System

A web app where students register, log in, and manage their own study tasks (add, complete, delete).

| Part | Technology |
|---|---|
| Frontend | React + Vite (`src/`) |
| Login | Firebase Authentication (email + password) |
| Task changes | Callable Cloud Functions in `asia-southeast1` (`functions/index.js`) |
| Database | Cloud Firestore |

## How it works

- **Reading:** the dashboard listens to Firestore with `onSnapshot`, so changes appear instantly. `firestore.rules` only let a signed-in student read tasks whose `uid` matches their own.
- **Writing:** the browser cannot write to Firestore directly (rules deny it). Adding, completing and deleting tasks go through the `createTask`, `toggleTask` and `deleteTask` functions, which check that the student is logged in, validate the title (1–100 characters) and confirm the task belongs to them.

## Run locally

```bash
cd student-task-system
npm install
npm --prefix functions install
npm run dev            # open the port 5173 link
```

Email/Password sign-in must be enabled in Firebase Console → Authentication → Sign-in method.

### Try everything on the emulators (no billing needed)

```bash
firebase emulators:start --only auth,firestore,functions --project demo-student-tasks
```

## Deploy

Cloud Functions require the **Blaze** (pay-as-you-go) plan with an open billing account linked to the project.

```bash
firebase use lab7-223593
firebase deploy --only functions,firestore:rules
```

Publish the website with Firebase Hosting (live at https://lab7-223593.web.app):

```bash
npm run build
firebase deploy --only hosting
```
