import { Router } from "express";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "../firebaseAdmin.js";
import { HttpError } from "../httpError.js";
import { requireAuth } from "../middleware/auth.js";
import { validateTaskId, parseCreateTask, parseUpdateTask, parseCompleteTask } from "../validation/task.js";

const tasks = db.collection("tasks");
const router = Router();

// Every route below needs a valid Firebase ID token.
router.use(requireAuth);

// Only the fields the frontend needs. The owner's uid is never sent back.
const toJson = doc => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title,
    completed: Boolean(data.completed),
    createdAt: data.createdAt?.toDate?.().toISOString() ?? null,
    updatedAt: data.updatedAt?.toDate?.().toISOString() ?? null
  };
};

// Ownership check used by every "/:id" route.
// Returns 404 for both "does not exist" and "belongs to someone else",
// so nobody can find out whether another student's task ID is real (prevents IDOR probing).
async function getOwnedTask(uid, rawId) {
  const ref = tasks.doc(validateTaskId(rawId));
  const snapshot = await ref.get();
  if (!snapshot.exists || snapshot.get("uid") !== uid) {
    throw new HttpError(404, "Task not found.");
  }
  return { ref, snapshot };
}

// POST /api/tasks
router.post("/", async (req, res) => {
  const { title } = parseCreateTask(req.body);
  const ref = await tasks.add({
    uid: req.uid, // from the verified token, never from the request
    title,
    completed: false,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  });
  res.status(201).json({ task: toJson(await ref.get()) });
});

// GET /api/tasks
router.get("/", async (req, res) => {
  const snapshot = await tasks.where("uid", "==", req.uid).get();
  // Sorted here (newest first) so Firestore does not need a composite index.
  const list = snapshot.docs.map(toJson).sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  res.json({ tasks: list });
});

// GET /api/tasks/:id
router.get("/:id", async (req, res) => {
  const { snapshot } = await getOwnedTask(req.uid, req.params.id);
  res.json({ task: toJson(snapshot) });
});

// PUT /api/tasks/:id  (edit the title)
router.put("/:id", async (req, res) => {
  const { title } = parseUpdateTask(req.body);
  const { ref } = await getOwnedTask(req.uid, req.params.id);
  await ref.update({ title, updatedAt: FieldValue.serverTimestamp() });
  res.json({ task: toJson(await ref.get()) });
});

// PATCH /api/tasks/:id/complete  (toggle, or set { completed: true|false })
router.patch("/:id/complete", async (req, res) => {
  const { completed } = parseCompleteTask(req.body);
  const { ref, snapshot } = await getOwnedTask(req.uid, req.params.id);
  const next = completed ?? !snapshot.get("completed");
  await ref.update({ completed: next, updatedAt: FieldValue.serverTimestamp() });
  res.json({ task: toJson(await ref.get()) });
});

// DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
  const { ref } = await getOwnedTask(req.uid, req.params.id);
  await ref.delete();
  res.status(204).end();
});

export default router;
