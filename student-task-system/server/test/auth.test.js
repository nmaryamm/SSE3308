// Unauthenticated access, invalid / expired / forged tokens, disabled and deleted accounts.
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { startServer, signUp, api, admin, fakeToken, MISSING_ID } from "./helpers.js";

const ENDPOINTS = [
  ["GET", "/api/tasks"],
  ["POST", "/api/tasks", { title: "x" }],
  ["GET", `/api/tasks/${MISSING_ID}`],
  ["PUT", `/api/tasks/${MISSING_ID}`, { title: "x" }],
  ["PATCH", `/api/tasks/${MISSING_ID}/complete`],
  ["DELETE", `/api/tasks/${MISSING_ID}`]
];

describe("Authentication", () => {
  let server;
  before(async () => { server = await startServer(); });
  after(() => server.close());

  for (const [method, path, body] of ENDPOINTS) {
    it(`${method} ${path} without a token -> 401`, async () => {
      const r = await api(server.base, method, path, { body });
      assert.equal(r.status, 401);
      assert.deepEqual(r.body, { error: "Authentication required." });
    });
  }

  const badHeaders = {
    "Basic auth instead of Bearer": "Basic YWxpY2U6c2VjcmV0",
    "Bearer with no token": "Bearer ",
    "lower-case bearer": "bearer abc.def.ghi",
    "token containing spaces": "Bearer abc def",
    "two tokens": "Bearer a.b.c, Bearer d.e.f",
    "script injection in header": "Bearer <script>alert(1)</script>"
  };
  for (const [name, value] of Object.entries(badHeaders)) {
    it(`malformed Authorization header (${name}) -> 401`, async () => {
      const r = await api(server.base, "GET", "/api/tasks", { headers: { Authorization: value } });
      assert.equal(r.status, 401);
    });
  }

  it("random garbage token -> 401 with a generic message", async () => {
    const r = await api(server.base, "GET", "/api/tasks", { token: "abc.def.ghi" });
    assert.equal(r.status, 401);
    assert.deepEqual(r.body, { error: "Invalid or expired token." });
  });

  it("expired token -> 401", async () => {
    const past = Math.floor(Date.now() / 1000) - 7200;
    const r = await api(server.base, "GET", "/api/tasks", { token: fakeToken({ iat: past, auth_time: past, exp: past + 3600 }) });
    assert.equal(r.status, 401);
  });

  it("token issued for a different Firebase project -> 401", async () => {
    const r = await api(server.base, "GET", "/api/tasks", {
      token: fakeToken({ aud: "some-other-project", iss: "https://securetoken.google.com/some-other-project" })
    });
    assert.equal(r.status, 401);
  });

  it("token with a wrong issuer -> 401", async () => {
    const r = await api(server.base, "GET", "/api/tasks", { token: fakeToken({ iss: "https://evil.example.com" }) });
    assert.equal(r.status, 401);
  });

  it("token with an empty user id -> 401", async () => {
    const r = await api(server.base, "GET", "/api/tasks", { token: fakeToken({ sub: "", user_id: "" }) });
    assert.equal(r.status, 401);
  });

  it("valid token -> 200 (control test)", async () => {
    const student = await signUp("valid");
    const r = await api(server.base, "GET", "/api/tasks", { token: student.token });
    assert.equal(r.status, 200);
  });

  it("token of a DISABLED account -> 401", async () => {
    const student = await signUp("disabled");
    const { adminAuth } = await admin();
    await adminAuth.updateUser(student.uid, { disabled: true });
    const r = await api(server.base, "GET", "/api/tasks", { token: student.token });
    assert.equal(r.status, 401);
  });

  it("token of a DELETED account -> 401", async () => {
    const student = await signUp("deleted");
    const { adminAuth } = await admin();
    await adminAuth.deleteUser(student.uid);
    const r = await api(server.base, "GET", "/api/tasks", { token: student.token });
    assert.equal(r.status, 401);
  });

  it("oversized Authorization header is rejected without crashing", async () => {
    const r = await api(server.base, "GET", "/api/tasks", { headers: { Authorization: `Bearer ${"a".repeat(20000)}` } });
    assert.ok([401, 431].includes(r.status), `got ${r.status}`);
    const health = await api(server.base, "GET", "/health");
    assert.equal(health.status, 200, "server still alive");
  });
});
