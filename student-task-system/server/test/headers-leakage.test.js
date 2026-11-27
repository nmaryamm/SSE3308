// Security headers, CORS, and information leakage in errors.
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { startServer, signUp, api } from "./helpers.js";

describe("Headers, CORS and information leakage", () => {
  let server, student;
  before(async () => {
    server = await startServer({ ALLOWED_ORIGINS: "http://localhost:5173" });
    student = await signUp("leak");
  });
  after(() => server.close());

  it("Helmet security headers are present and X-Powered-By is hidden", async () => {
    const r = await api(server.base, "GET", "/health");
    assert.equal(r.headers.get("x-powered-by"), null);
    assert.equal(r.headers.get("x-content-type-options"), "nosniff");
    assert.ok(r.headers.get("content-security-policy"));
    assert.ok(r.headers.get("strict-transport-security"));
    assert.equal(r.headers.get("x-frame-options"), "SAMEORIGIN");
  });

  it("CORS: the allowed frontend origin is accepted", async () => {
    const r = await api(server.base, "GET", "/health", { headers: { Origin: "http://localhost:5173" } });
    assert.equal(r.headers.get("access-control-allow-origin"), "http://localhost:5173");
  });

  it("CORS: an unknown website gets no permission (simple request and preflight)", async () => {
    const simple = await api(server.base, "GET", "/api/tasks", { headers: { Origin: "https://evil.example.com" } });
    assert.equal(simple.headers.get("access-control-allow-origin"), null);
    const preflight = await api(server.base, "OPTIONS", "/api/tasks", {
      headers: { Origin: "https://evil.example.com", "Access-Control-Request-Method": "DELETE", "Access-Control-Request-Headers": "authorization" }
    });
    assert.equal(preflight.headers.get("access-control-allow-origin"), null);
  });

  it("unknown routes return a generic 404 with no framework details", async () => {
    for (const path of ["/", "/admin", "/api", "/api/users", "/.env", "/server/.env", "/src/firebaseAdmin.js", "/package.json"]) {
      const r = await api(server.base, "GET", path);
      assert.equal(r.status, 404, path);
      assert.deepEqual(r.body, { error: "Not found." }, path);
    }
  });

  it("error responses contain only an 'error' message (no stack trace, paths or library names)", async () => {
    const responses = [
      await api(server.base, "GET", "/api/tasks"),
      await api(server.base, "GET", "/api/tasks", { token: "a.b.c" }),
      await api(server.base, "POST", "/api/tasks", { token: student.token, rawBody: "{bad json", headers: { "Content-Type": "application/json" } }),
      await api(server.base, "GET", "/api/tasks/!!!", { token: student.token })
    ];
    for (const r of responses) {
      assert.deepEqual(Object.keys(r.body), ["error"]);
      assert.doesNotMatch(r.text, /stack|at \w+ \(|node_modules|\/workspaces|firebase-admin|Firestore|SyntaxError|express/i);
    }
  });

  it("unexpected server errors (500) are hidden behind a generic message", async () => {
    const { errorHandler } = await import("../src/middleware/errors.js");
    const result = {};
    const res = { status(code) { result.status = code; return this; }, json(body) { result.body = body; } };
    const originalLog = console.error;
    console.error = () => {}; // the real handler logs the error on the server; keep test output clean
    try {
      errorHandler(new Error("FAILED_PRECONDITION: secret internal database detail at /srv/app"), { method: "GET", originalUrl: "/x" }, res, () => {});
    } finally {
      console.error = originalLog;
    }
    assert.equal(result.status, 500);
    assert.deepEqual(result.body, { error: "Something went wrong. Please try again later." });
  });

  it("task responses expose only id, title, completed and dates (no uid)", async () => {
    const r = await api(server.base, "POST", "/api/tasks", { token: student.token, body: { title: "check fields" } });
    assert.deepEqual(Object.keys(r.body.task).sort(), ["completed", "createdAt", "id", "title", "updatedAt"]);
    assert.ok(!r.text.includes(student.uid));
  });
});
