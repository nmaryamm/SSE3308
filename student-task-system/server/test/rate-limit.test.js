// Rate limiting (runs in its own process, so the low limit does not affect other tests).
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { startServer, signUp, api } from "./helpers.js";

describe("Rate limiting", () => {
  const LIMIT = 5;
  let server, student;
  before(async () => {
    student = await signUp("ratelimit");
    server = await startServer({ RATE_LIMIT_MAX: String(LIMIT) });
  });
  after(() => server.close());

  it(`allows ${LIMIT} requests, then blocks with 429 (even token-guessing requests count)`, async () => {
    for (let i = 0; i < LIMIT; i++) {
      const r = await api(server.base, "GET", "/api/tasks", { token: `guess.${i}.token` });
      assert.equal(r.status, 401, `request ${i + 1}`);
      assert.ok(r.headers.get("ratelimit") || r.headers.get("ratelimit-policy"), "RateLimit headers sent");
    }
    const blocked = await api(server.base, "GET", "/api/tasks", { token: "guess.again.token" });
    assert.equal(blocked.status, 429);
    assert.deepEqual(blocked.body, { error: "Too many requests. Please slow down and try again later." });
  });

  it("a valid student from the same IP is also blocked until the window resets", async () => {
    const r = await api(server.base, "POST", "/api/tasks", { token: student.token, body: { title: "spam" } });
    assert.equal(r.status, 429);
  });

  it("the health check is not rate limited (Render can still check the server)", async () => {
    assert.equal((await api(server.base, "GET", "/health")).status, 200);
  });
});
