// Reads settings from environment variables (server/.env locally, Render dashboard in production).
// "https://a.com/, https://b.com" -> ["https://a.com", "https://b.com"] (trailing slashes removed so they match browser Origins)
const list = value => (value || "").split(",").map(item => item.trim().replace(/\/+$/, "")).filter(Boolean);
const number = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const config = {
  port: number(process.env.PORT, 3000),
  isProduction: process.env.NODE_ENV === "production",
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // Keys pasted into .env or Render keep "\n" as two characters; turn them back into real newlines.
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  allowedOrigins: list(process.env.ALLOWED_ORIGINS || "http://localhost:5173"),
  rateLimitWindowMs: number(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  rateLimitMax: number(process.env.RATE_LIMIT_MAX, 100),
  // Render sits behind one proxy; needed so rate limiting sees the real client IP.
  trustProxy: number(process.env.TRUST_PROXY, 0),
  usingEmulators: Boolean(process.env.FIRESTORE_EMULATOR_HOST || process.env.FIREBASE_AUTH_EMULATOR_HOST)
};
