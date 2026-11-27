import { HttpError } from "../httpError.js";

export function notFound(_req, _res, next) {
  next(new HttpError(404, "Not found."));
}

// One place that turns every error into a JSON response.
// Unexpected errors are logged on the server but never sent to the client.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  let status = 500;
  let message = "Something went wrong. Please try again later.";

  if (err instanceof HttpError) {
    status = err.status;
    message = err.message;
  } else if (err.type === "entity.too.large") {
    status = 413;
    message = "Request body is too large.";
  } else if (err.type === "entity.parse.failed") {
    status = 400;
    message = "Request body must be valid JSON.";
  } else if (err.status >= 400 && err.status < 500) {
    status = err.status;
    message = "Invalid request.";
  }

  if (status >= 500) {
    console.error(`[${req.method} ${req.originalUrl}]`, err);
  }

  res.status(status).json({ error: message });
}
