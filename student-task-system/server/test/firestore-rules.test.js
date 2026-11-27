// Direct Firestore access with the public Firebase config must be denied by firestore.rules.
// Uses the same Firebase browser library as the frontend (what an attacker would use).
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { startServer, api, PROJECT_ID } from "./helpers.js";

const frontend = createRequire(new URL("../../package.json", import.meta.url));
const { initializeApp, deleteApp } = frontend("firebase/app");
const { getAuth, connectAuthEmulator, createUserWithEmailAndPassword } = frontend("firebase/auth");
const fs = frontend("firebase/firestore");

describe("Direct Firestore access (firestore.rules)", () => {
  let server, app, db, user, token, ownTaskId;

  before(async () => {
    server = await startServer();
    app = initializeApp({ apiKey: "fake-api-key", projectId: PROJECT_ID }, `attacker-${Date.now()}`);
    const auth = getAuth(app);
    connectAuthEmulator(auth, `http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}`, { disableWarnings: true });
    db = fs.getFirestore(app);
    const [host, port] = process.env.FIRESTORE_EMULATOR_HOST.split(":");
    fs.connectFirestoreEmulator(db, host, Number(port));
    ({ user } = await createUserWithEmailAndPassword(auth, `rules-${Date.now()}@test.edu`, "Secret123!"));
    token = await user.getIdToken();
    const r = await api(server.base, "POST", "/api/tasks", { token, body: { title: "made via Express" } });
    assert.equal(r.status, 201, "Express (Admin SDK) can still write");
    ownTaskId = r.body.task.id;
  });
  after(async () => {
    await fs.terminate(db);
    await deleteApp(app);
    await server.close();
  });

  const expectDenied = async action => {
    await assert.rejects(action, error => error.code === "permission-denied");
  };

  it("logged-in student cannot list their own tasks directly", () =>
    expectDenied(() => fs.getDocs(fs.query(fs.collection(db, "tasks"), fs.where("uid", "==", user.uid)))));
  it("cannot list every task", () => expectDenied(() => fs.getDocs(fs.collection(db, "tasks"))));
  it("cannot read a task by ID", () => expectDenied(() => fs.getDoc(fs.doc(db, "tasks", ownTaskId))));
  it("cannot create a task", () =>
    expectDenied(() => fs.addDoc(fs.collection(db, "tasks"), { uid: user.uid, title: "direct", completed: false })));
  it("cannot update a task", () => expectDenied(() => fs.updateDoc(fs.doc(db, "tasks", ownTaskId), { completed: true })));
  it("cannot delete a task", () => expectDenied(() => fs.deleteDoc(fs.doc(db, "tasks", ownTaskId))));
  it("cannot write any other collection", () =>
    expectDenied(() => fs.setDoc(fs.doc(db, "users", user.uid), { role: "admin" })));

  it("the task is unchanged and still works through Express", async () => {
    const r = await api(server.base, "GET", `/api/tasks/${ownTaskId}`, { token });
    assert.equal(r.status, 200);
    assert.equal(r.body.task.completed, false);
  });
});
