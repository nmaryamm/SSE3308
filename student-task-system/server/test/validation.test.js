// Mass assignment, malformed and oversized requests, and XSS payloads.
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { startServer, signUp, api } from "./helpers.js";

describe("Input validation", () => {
  let server, student, taskId;
  before(async () => {
    server = await startServer();
    student = await signUp("validator");
    const r = await api(server.base, "POST", "/api/tasks", { token: student.token, body: { title: "Valid task" } });
    taskId = r.body.task.id;
  });
  after(() => server.close());
  const send = (method, path, options) => api(server.base, method, path, { token: student.token, ...options });

  describe("Mass assignment (extra fields are rejected)", () => {
    const createBodies = {
      "completed: true on create": { title: "x", completed: true },
      "createdAt": { title: "x", createdAt: "2000-01-01" },
      "id": { title: "x", id: "chosen-id" },
      "uid": { title: "x", uid: "someone-else" },
      "isAdmin": { title: "x", isAdmin: true },
      "__proto__ (prototype pollution)": JSON.parse('{"title":"x","__proto__":{"isAdmin":true}}'),
      "constructor": { title: "x", constructor: { prototype: { isAdmin: true } } }
    };
    for (const [name, body] of Object.entries(createBodies)) {
      it(`POST with ${name} -> 400`, async () => {
        assert.equal((await send("POST", "/api/tasks", { body })).status, 400);
      });
    }

    it("PUT with completed / uid -> 400", async () => {
      assert.equal((await send("PUT", `/api/tasks/${taskId}`, { body: { title: "y", completed: true } })).status, 400);
      assert.equal((await send("PUT", `/api/tasks/${taskId}`, { body: { title: "y", uid: "x" } })).status, 400);
    });

    it("PATCH complete with title / uid -> 400", async () => {
      assert.equal((await send("PATCH", `/api/tasks/${taskId}/complete`, { body: { title: "y" } })).status, 400);
      assert.equal((await send("PATCH", `/api/tasks/${taskId}/complete`, { body: { completed: true, uid: "x" } })).status, 400);
    });

    it("the task was not changed by any rejected request", async () => {
      const r = await send("GET", `/api/tasks/${taskId}`);
      assert.equal(r.body.task.title, "Valid task");
      assert.equal(r.body.task.completed, false);
      assert.equal(Object.prototype.isAdmin, undefined, "Object prototype not polluted");
    });
  });

  describe("Malformed requests", () => {
    const badBodies = {
      "broken JSON": { rawBody: '{"title": "x"', headers: { "Content-Type": "application/json" } },
      "JSON string instead of object": { rawBody: '"just a string"', headers: { "Content-Type": "application/json" } },
      "JSON null": { rawBody: "null", headers: { "Content-Type": "application/json" } },
      "JSON array": { body: [{ title: "x" }] },
      "plain-text body": { rawBody: "title=x", headers: { "Content-Type": "text/plain" } },
      "form-encoded body": { rawBody: "title=x", headers: { "Content-Type": "application/x-www-form-urlencoded" } },
      "no body at all": {},
      "title is a number": { body: { title: 12345 } },
      "title is an object": { body: { title: { $gt: "" } } },
      "title is an array": { body: { title: ["a", "b"] } },
      "title is null": { body: { title: null } },
      "title is empty": { body: { title: "" } },
      "title is only spaces": { body: { title: "     " } },
      "title is 101 characters": { body: { title: "a".repeat(101) } },
      "title has a null byte": { body: { title: "abc\u0000def" } }
    };
    for (const [name, options] of Object.entries(badBodies)) {
      it(`POST ${name} -> 400`, async () => {
        const r = await send("POST", "/api/tasks", options);
        assert.equal(r.status, 400, `got ${r.status}: ${r.text}`);
        assert.equal(typeof r.body.error, "string");
      });
    }

    it("PATCH complete with completed: \"true\" (string) -> 400", async () => {
      assert.equal((await send("PATCH", `/api/tasks/${taskId}/complete`, { body: { completed: "true" } })).status, 400);
    });

    it("unsupported method on a task (POST /api/tasks/:id) -> 404", async () => {
      assert.equal((await send("POST", `/api/tasks/${taskId}`, { body: { title: "x" } })).status, 404);
    });
  });

  describe("Oversized requests", () => {
    it("body over 10 KB -> 413", async () => {
      const r = await send("POST", "/api/tasks", { body: { title: "a".repeat(20 * 1024) } });
      assert.equal(r.status, 413);
      assert.deepEqual(r.body, { error: "Request body is too large." });
    });

    it("1 MB body -> 413 and the server keeps running", async () => {
      const r = await send("POST", "/api/tasks", { rawBody: "x".repeat(1024 * 1024), headers: { "Content-Type": "application/json" } });
      assert.equal(r.status, 413);
      assert.equal((await api(server.base, "GET", "/health")).status, 200);
    });

    it("title of exactly 100 characters is accepted (boundary)", async () => {
      assert.equal((await send("POST", "/api/tasks", { body: { title: "b".repeat(100) } })).status, 201);
    });

    it("non-English titles and emoji are accepted", async () => {
      const r = await send("POST", "/api/tasks", { body: { title: "Siapkan tugasan 📚 — 作业" } });
      assert.equal(r.status, 201);
      assert.equal(r.body.task.title, "Siapkan tugasan 📚 — 作业");
    });
  });

  describe("XSS payloads", () => {
    const payloads = [
      "<script>alert('xss')</script>",
      "<img src=x onerror=alert(1)>",
      "\"><svg onload=alert(document.cookie)>",
      "javascript:alert(1)",
      "{{constructor.constructor('alert(1)')()}}"
    ];
    for (const payload of payloads) {
      it(`stored as plain text and returned as JSON: ${payload.slice(0, 30)}`, async () => {
        const r = await send("POST", "/api/tasks", { body: { title: payload } });
        assert.equal(r.status, 201);
        assert.equal(r.body.task.title, payload, "stored exactly, never interpreted");
        assert.match(r.headers.get("content-type"), /^application\/json/);
        assert.equal(r.headers.get("x-content-type-options"), "nosniff");
      });
    }

    it("frontend never renders task text as HTML (no dangerouslySetInnerHTML / innerHTML / eval)", async () => {
      const srcDir = new URL("../../src/", import.meta.url);
      const files = (await readdir(srcDir, { recursive: true })).filter(file => /\.(jsx?|tsx?)$/.test(file));
      assert.ok(files.length > 0);
      for (const file of files) {
        const code = await readFile(new URL(file, srcDir), "utf8");
        assert.doesNotMatch(code, /dangerouslySetInnerHTML|\.innerHTML\s*=|\beval\(|new Function\(/, `unsafe HTML rendering in src/${file}`);
      }
    });
  });
});
