const { onCall, HttpsError } =
 require("firebase-functions/v2/https");
const { initializeApp } =
 require("firebase-admin/app");
const { getFirestore, FieldValue } =
 require("firebase-admin/firestore");
initializeApp();
const db = getFirestore();
// CREATE TASK
exports.createTask = onCall(
 { region: "asia-southeast1" },
 async (request) => {
 if (!request.auth) {
 throw new HttpsError(
 "unauthenticated", "Please login first."
 );
 }
 const uid = request.auth.uid;
 const title = request.data.title;
 if (
 typeof title !== "string" ||
 !title.trim() ||
 title.trim().length > 100
 ) {
 throw new HttpsError(
 "invalid-argument",
 "Task title must contain 1-100 characters."
 );
 }
 const task = {
 uid,
 title: title.trim(),
 completed: false,
 createdAt: FieldValue.serverTimestamp()
 };
 const doc = await db.collection("tasks").add(task);
 return {
 success: true,
 message: "Task created successfully!",
 taskId: doc.id
 };
 }
);
// TOGGLE TASK STATUS
exports.toggleTask = onCall(
 { region: "asia-southeast1" },
 async (request) => {
 if (!request.auth) {
 throw new HttpsError(
 "unauthenticated", "Please login first."
 );
 }
 const uid = request.auth.uid;
 const taskId = request.data.taskId;
 if (typeof taskId !== "string" || !taskId.trim()) {
 throw new HttpsError(
 "invalid-argument", "Invalid task ID."
 );
 }
 const ref = db.collection("tasks").doc(taskId);
 const doc = await ref.get();
 if (!doc.exists || doc.data().uid !== uid) {
 throw new HttpsError("not-found", "Task not found.");
 }
 const newStatus = !doc.data().completed;
 await ref.update({ completed: newStatus });
  return { success: true, completed: newStatus };
 }
);
// DELETE TASK
exports.deleteTask = onCall(
 { region: "asia-southeast1" },
 async (request) => {
 if (!request.auth) {
 throw new HttpsError(
 "unauthenticated", "Please login first."
 );
 }
 const uid = request.auth.uid;
 const taskId = request.data.taskId;
 if (typeof taskId !== "string" || !taskId.trim()) {
 throw new HttpsError(
 "invalid-argument", "Invalid task ID."
 );
 }
 const ref = db.collection("tasks").doc(taskId);
 const doc = await ref.get();
 if (!doc.exists || doc.data().uid !== uid) {
 throw new HttpsError("not-found", "Task not found.");
 }
 await ref.delete();
 return {
 success: true,
 message: "Task deleted successfully!"
 };
 }
);