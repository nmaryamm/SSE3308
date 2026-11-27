import { HttpError } from "../httpError.js";

export const TITLE_MAX_LENGTH = 100;

// Firestore auto-generated IDs are 20 letters/digits. Rejecting anything else
// blocks path tricks like "../" or "otherCollection/doc".
const TASK_ID_PATTERN = /^[A-Za-z0-9]{1,64}$/;

export function validateTaskId(id) {
  if (typeof id !== "string" || !TASK_ID_PATTERN.test(id)) {
    throw new HttpError(400, "Invalid task ID.");
  }
  return id;
}

function requireObject(body) {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    throw new HttpError(400, "Request body must be a JSON object.");
  }
  return body;
}

// Mass-assignment protection: only the listed fields may be sent.
// Anything else (uid, createdAt, completed on create, ...) is rejected.
function allowOnly(body, allowed) {
  const extra = Object.keys(body).filter(key => !allowed.includes(key));
  if (extra.length) {
    throw new HttpError(400, `Unexpected field(s): ${extra.slice(0, 5).join(", ")}.`);
  }
}

function validateTitle(title) {
  if (typeof title !== "string") {
    throw new HttpError(400, "Title must be text.");
  }
  const trimmed = title.trim();
  if (!trimmed || trimmed.length > TITLE_MAX_LENGTH) {
    throw new HttpError(400, `Title must contain 1-${TITLE_MAX_LENGTH} characters.`);
  }
  // Control characters (null bytes etc.) have no place in a task title.
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(trimmed)) {
    throw new HttpError(400, "Title contains invalid characters.");
  }
  return trimmed;
}

// POST /api/tasks  -> { title }
export function parseCreateTask(body) {
  requireObject(body);
  allowOnly(body, ["title"]);
  return { title: validateTitle(body.title) };
}

// PUT /api/tasks/:id -> { title }
export function parseUpdateTask(body) {
  requireObject(body);
  allowOnly(body, ["title"]);
  return { title: validateTitle(body.title) };
}

// PATCH /api/tasks/:id/complete -> {} (toggle) or { completed: true|false }
export function parseCompleteTask(body) {
  const data = body === undefined ? {} : requireObject(body);
  allowOnly(data, ["completed"]);
  if (data.completed !== undefined && typeof data.completed !== "boolean") {
    throw new HttpError(400, "completed must be true or false.");
  }
  return { completed: data.completed };
}
