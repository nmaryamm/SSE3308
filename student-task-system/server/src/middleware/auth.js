import { adminAuth } from "../firebaseAdmin.js";
import { HttpError } from "../httpError.js";

// Requires "Authorization: Bearer <Firebase ID token>".
// The user's UID comes ONLY from the verified token, never from the request body or URL.
export async function requireAuth(req, _res, next) {
  const header = req.get("authorization") || "";
  const match = header.match(/^Bearer ([A-Za-z0-9._-]+)$/);
  if (!match) {
    return next(new HttpError(401, "Authentication required."));
  }

  try {
    // checkRevoked = true also rejects tokens of disabled or signed-out-everywhere accounts.
    const decoded = await adminAuth.verifyIdToken(match[1], true);
    req.uid = decoded.uid;
    return next();
  } catch {
    // Same message for every failure so attackers learn nothing about why.
    return next(new HttpError(401, "Invalid or expired token."));
  }
}
