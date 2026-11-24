# Student Task System

A React app for creating, completing, and deleting personal study tasks. Firebase Authentication handles accounts, Firestore streams each signed-in user's tasks, and callable Cloud Functions perform task changes.

## Run locally

1. Install frontend dependencies with `npm install`.
2. Install function dependencies with `npm --prefix functions install`.
3. Configure the Firebase project settings in `src/firebase.js`.
4. Enable Email/Password sign-in in Firebase Authentication.
5. Start the frontend with `npm run dev`.

## Deploy Firebase resources

Select your Firebase project with `firebase use <project-id>`, then run:

```sh
firebase deploy --only firestore:rules,functions
```

Firestore rules allow signed-in users to read only their own tasks. Task writes are intentionally routed through the authenticated callable functions in `functions/index.js`.
