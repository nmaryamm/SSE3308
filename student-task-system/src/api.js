import { auth } from "./firebase";

// Local development: leave VITE_API_URL empty; Vite forwards /api to the Express server (see vite.config.js).
// Production: set VITE_API_URL to your Render address, e.g. https://student-task-api.onrender.com
const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
if (import.meta.env.PROD && !API_URL) {
 console.error("VITE_API_URL was not set when this site was built, so task requests cannot reach the API.");
}

// Sends a request to the Express API with the logged-in user's Firebase ID token.
async function request(path, { method = "GET", body } = {}, retried = false) {
 const user = auth.currentUser;
 if (!user) throw new Error("Please log in again.");

 // getIdToken() returns a valid token and refreshes it automatically when it is about to expire.
 const token = await user.getIdToken(retried);
 const headers = { Authorization: `Bearer ${token}` };
 if (body !== undefined) headers["Content-Type"] = "application/json";

 let response;
 try {
  response = await fetch(`${API_URL}${path}`, {
   method,
   headers,
   body: body === undefined ? undefined : JSON.stringify(body)
  });
 } catch {
  throw new Error("Cannot reach the server. Please check your connection and try again.");
 }

 // Token rejected: force a fresh token once and try again.
 if (response.status === 401 && !retried) {
  return request(path, { method, body }, true);
 }

 if (response.status === 204) return null;
 const data = await response.json().catch(() => null);
 if (!response.ok) {
  throw new Error(data?.error || `Request failed (${response.status}).`);
 }
 return data;
}

const taskPath = id => `/api/tasks/${encodeURIComponent(id)}`;

export const taskApi = {
 list: async () => (await request("/api/tasks")).tasks,
 create: async title => (await request("/api/tasks", { method: "POST", body: { title } })).task,
 rename: async (id, title) => (await request(taskPath(id), { method: "PUT", body: { title } })).task,
 toggle: async id => (await request(`${taskPath(id)}/complete`, { method: "PATCH" })).task,
 remove: id => request(taskPath(id), { method: "DELETE" })
};
