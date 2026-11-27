// Shared helpers for the security tests.
// These tests ONLY run against the local Firebase emulators (started by `npm test`),
// so they never create accounts or data in the real Firebase project.
import { once } from "node:events";

if (!process.env.FIRESTORE_EMULATOR_HOST || !process.env.FIREBASE_AUTH_EMULATOR_HOST) {
  throw new Error("Security tests must run against the Firebase emulators. Use `npm test` in the server folder.");
}

export const PROJECT_ID = "demo-student-tasks";
const AUTH_HOST = process.env.FIREBASE_AUTH_EMULATOR_HOST;

// Starts the real Express app on a random port. `env` lets a test change settings (e.g. rate limit).
export async function startServer(env = {}) {
  Object.assign(process.env, { FIREBASE_PROJECT_ID: PROJECT_ID, RATE_LIMIT_MAX: "10000" }, env);
  const { createApp } = await import("../src/app.js");
  const server = createApp().listen(0, "127.0.0.1");
  await once(server, "listening");
  return {
    base: `http://127.0.0.1:${server.address().port}`,
    close: () => new Promise(resolve => server.close(resolve))
  };
}

export async function admin() {
  return import("../src/firebaseAdmin.js");
}

// Creates a new student account in the Auth emulator and returns its uid and ID token.
export async function signUp(name) {
  const email = `${name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@test.edu`;
  const response = await fetch(`http://${AUTH_HOST}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: "Secret123!", returnSecureToken: true })
  });
  const data = await response.json();
  if (!data.idToken) throw new Error(`Sign-up failed: ${JSON.stringify(data)}`);
  return { uid: data.localId, token: data.idToken, email };
}

// Sends a request and returns { status, headers, body } (body parsed as JSON when possible).
export async function api(base, method, path, { token, body, rawBody, headers = {} } = {}) {
  const finalHeaders = { ...headers };
  if (token) finalHeaders.Authorization = `Bearer ${token}`;
  let payload = rawBody;
  if (body !== undefined) {
    payload = JSON.stringify(body);
    finalHeaders["Content-Type"] ??= "application/json";
  }
  const response = await fetch(base + path, { method, headers: finalHeaders, body: payload });
  const text = await response.text();
  let parsed = text;
  try { parsed = text ? JSON.parse(text) : null; } catch { /* keep text */ }
  return { status: response.status, headers: response.headers, body: parsed, text };
}

const b64url = value => Buffer.from(typeof value === "string" ? value : JSON.stringify(value)).toString("base64url");

// Builds an UNSIGNED token that looks like a Firebase ID token, with any claims overridden.
export function fakeToken(overrides = {}, header = { alg: "none", typ: "JWT" }) {
  const now = Math.floor(Date.now() / 1000);
  const claims = {
    iss: `https://securetoken.google.com/${PROJECT_ID}`,
    aud: PROJECT_ID,
    auth_time: now - 10,
    iat: now - 10,
    exp: now + 3600,
    sub: "attacker-uid",
    user_id: "attacker-uid",
    ...overrides
  };
  return `${b64url(header)}.${b64url(claims)}.`;
}

// A task ID that has the right format but does not exist.
export const MISSING_ID = "AAAAAAAAAAAAAAAAAAAA";
