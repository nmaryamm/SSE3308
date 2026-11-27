// Two students: Bob must not be able to see, change or delete Alice's tasks (IDOR),
// and nobody can choose which uid a task belongs to (fake UID injection).
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { startServer, signUp, api, admin, MISSING_ID } from "./helpers.js";

describe("Access control between two students", () => {
  let server, alice, bob, aliceTask;
  const seen = []; // every response Bob receives, checked for leaks at the end

  before(async () => {
    server = await startServer();
    alice = await signUp("alice");
    bob = await signUp("bob");
    const r = await api(server.base, "POST", "/api/tasks", { token: alice.token, body: { title: "Alice private essay" } });
    assert.equal(r.status, 201);
    aliceTask = r.body.task;
  });
  after(() => server.close());

  const asBob = async (method, path, body) => {
    const r = await api(server.base, method, path, { token: bob.token, body });
    seen.push(r.text);
    return r;
  };

  const aliceTaskUnchanged = async () => {
    const r = await api(server.base, "GET", `/api/tasks/${aliceTask.id}`, { token: alice.token });
    assert.equal(r.status, 200);
    assert.equal(r.body.task.title, "Alice private essay");
    assert.equal(r.body.task.completed, false);
  };

  it("Bob's task list does not contain Alice's task", async () => {
    const r = await asBob("GET", "/api/tasks");
    assert.equal(r.status, 200);
    assert.ok(!r.body.tasks.some(task => task.id === aliceTask.id));
  });

  it("Bob cannot READ Alice's task by ID -> 404", async () => {
    const r = await asBob("GET", `/api/tasks/${aliceTask.id}`);
    assert.equal(r.status, 404);
  });

  it("Bob cannot RENAME Alice's task -> 404, task unchanged", async () => {
    const r = await asBob("PUT", `/api/tasks/${aliceTask.id}`, { title: "hacked by bob" });
    assert.equal(r.status, 404);
    await aliceTaskUnchanged();
  });

  it("Bob cannot COMPLETE Alice's task (toggle or explicit) -> 404, task unchanged", async () => {
    assert.equal((await asBob("PATCH", `/api/tasks/${aliceTask.id}/complete`)).status, 404);
    assert.equal((await asBob("PATCH", `/api/tasks/${aliceTask.id}/complete`, { completed: true })).status, 404);
    await aliceTaskUnchanged();
  });

  it("Bob cannot DELETE Alice's task -> 404, task still exists", async () => {
    const r = await asBob("DELETE", `/api/tasks/${aliceTask.id}`);
    assert.equal(r.status, 404);
    await aliceTaskUnchanged();
  });

  it("IDOR probing: another student's task looks exactly like a task that does not exist", async () => {
    const other = await asBob("GET", `/api/tasks/${aliceTask.id}`);
    const missing = await asBob("GET", `/api/tasks/${MISSING_ID}`);
    assert.equal(other.status, missing.status);
    assert.deepEqual(other.body, missing.body);
  });

  for (const badId of ["..", "..%2F..%2Fusers", "abc%2Fdef", "abc def", "a".repeat(65), "%00", "<script>", "tasks.json"]) {
    it(`invalid / path-traversal task ID "${badId.slice(0, 20)}" -> 400 or 404, never 200`, async () => {
      const r = await asBob("GET", `/api/tasks/${badId}`);
      assert.ok([400, 404].includes(r.status), `got ${r.status}`);
    });
  }

  it("fake UID injection: sending another student's uid in the body is rejected (400)", async () => {
    const r = await asBob("POST", "/api/tasks", { title: "planted", uid: alice.uid });
    assert.equal(r.status, 400);
    const list = await api(server.base, "GET", "/api/tasks", { token: alice.token });
    assert.ok(!list.body.tasks.some(task => task.title === "planted"));
  });

  it("fake UID injection: ?uid= in the URL is ignored", async () => {
    const r = await asBob("GET", `/api/tasks?uid=${alice.uid}`);
    assert.equal(r.status, 200);
    assert.ok(!r.body.tasks.some(task => task.id === aliceTask.id));
  });

  it("fake UID injection: X-User-Id / X-Uid headers are ignored, task belongs to the token owner", async () => {
    const r = await api(server.base, "POST", "/api/tasks", {
      token: bob.token, body: { title: "header trick" }, headers: { "X-User-Id": alice.uid, "X-Uid": alice.uid }
    });
    assert.equal(r.status, 201);
    const { db } = await admin();
    const stored = await db.collection("tasks").doc(r.body.task.id).get();
    assert.equal(stored.get("uid"), bob.uid, "stored uid must come from the verified token");
  });

  it("no response ever reveals a uid", async () => {
    for (const text of seen) {
      assert.ok(!text.includes(alice.uid) && !text.includes(bob.uid), `leaked uid in: ${text.slice(0, 120)}`);
    }
  });

  it("Alice can still use her own task normally (control test)", async () => {
    const r = await api(server.base, "PATCH", `/api/tasks/${aliceTask.id}/complete`, { token: alice.token });
    assert.equal(r.status, 200);
    assert.equal(r.body.task.completed, true);
    assert.equal((await api(server.base, "DELETE", `/api/tasks/${aliceTask.id}`, { token: alice.token })).status, 204);
  });
});
