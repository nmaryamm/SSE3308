import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { auth, db, functions } from "../firebase";

const filters = [
  { id: "all", label: "All tasks" },
  { id: "active", label: "To do" },
  { id: "completed", label: "Completed" }
];

export default function Dashboard({ user }) {
 const [tasks, setTasks] = useState([]);
 const [title, setTitle] = useState("");
 const [filter, setFilter] = useState("all");
 const [search, setSearch] = useState("");
 const [error, setError] = useState("");

 useEffect(() => {
 const q = query(
 collection(db, "tasks"),
 where("uid", "==", user.uid)
 );
 return onSnapshot(q, snapshot => {
 setTasks(snapshot.docs.map(doc => ({
 id: doc.id,
 ...doc.data()
 })));
 }, error => {
 console.error("Task listener error:", error);
 setError("Unable to load your tasks. Please try again.");
 });
 }, [user.uid]);

 const completedCount = tasks.filter(task => task.completed).length;
 const pendingCount = tasks.length - completedCount;
 const progress = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;
 const visibleTasks = tasks.filter(task => {
  const matchesFilter = filter === "all"
   || (filter === "active" && !task.completed)
   || (filter === "completed" && task.completed);
  return matchesFilter && task.title.toLowerCase().includes(search.trim().toLowerCase());
 });

 const addTask = async event => {
  event.preventDefault();
  const taskTitle = title.trim();
  if (!taskTitle) return;

 try {
 const createTask = httpsCallable(functions, "createTask");
 await createTask({ title: taskTitle });
 setTitle("");
 setError("");
 } catch (error) {
 setError(error.message || "Unable to add this task.");
 }
 };

 const toggleTask = async taskId => {
 try {
 const toggle = httpsCallable(functions, "toggleTask");
 await toggle({ taskId });
 setError("");
 } catch (error) {
 setError(error.message || "Unable to update this task.");
 }
 };

 const deleteTask = async taskId => {
 try {
 const remove = httpsCallable(functions, "deleteTask");
 await remove({ taskId });
 setError("");
 } catch (error) {
 setError(error.message || "Unable to delete this task.");
 }
 };

 return (
 <main className="app-shell dashboard-shell">
  <header className="topbar">
   <div className="brand-lockup">
    <span className="brand-mark" aria-hidden="true">
     <svg viewBox="0 0 24 24" fill="none">
      <path d="m3.5 9.2 8.5-4 8.5 4-8.5 4-8.5-4Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M7 11v4.1c2.8 2.1 7.2 2.1 10 0V11m3.5-1.8v5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
     </svg>
    </span>
    <span>StudySpace</span>
   </div>
   <div className="topbar-actions">
    <div className="profile-chip">
     <span className="avatar" aria-hidden="true">{(user.email || "S").charAt(0).toUpperCase()}</span>
     <span className="profile-email">{user.email}</span>
    </div>
    <button className="text-button" onClick={() => signOut(auth)}>Sign out</button>
   </div>
  </header>

  <section className="dashboard-intro" aria-labelledby="dashboard-title">
   <div>
    <p className="eyebrow"><span className="eyebrow-dot" /> Student workspace</p>
    <h1 id="dashboard-title">Your study space</h1>
    <p className="muted">A little progress each day adds up. Welcome back, <strong>{user.email?.split("@")[0]}</strong>.</p>
   </div>
   <label className="task-search">
    <svg className="search-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
     <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.8" />
     <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
    <input
     type="search"
     value={search}
     onChange={event => setSearch(event.target.value)}
     placeholder="Search your tasks"
     aria-label="Search your tasks"
    />
   </label>
  </section>

  <section className="stats-grid" aria-label="Task summary">
   <article className="glass-card stat-card" style={{ "--stat-glow": "#e6e2ff" }}>
    <p className="stat-label">Total tasks</p>
    <p className="stat-value">{tasks.length}</p>
    <span className="stat-note">In your workspace</span>
   </article>
   <article className="glass-card stat-card" style={{ "--stat-glow": "#d9f3e8" }}>
    <p className="stat-label">Completed</p>
    <p className="stat-value">{completedCount}</p>
    <span className="stat-note">One step at a time</span>
   </article>
   <article className="glass-card stat-card" style={{ "--stat-glow": "#ffe6dd" }}>
    <p className="stat-label">To do</p>
    <p className="stat-value">{pendingCount}</p>
    <span className="stat-note">Ready when you are</span>
   </article>
  </section>

  <div className="dashboard-grid">
   <section className="glass-card task-panel" aria-labelledby="tasks-heading">
    <div className="section-heading">
     <div>
      <h2 id="tasks-heading">My tasks</h2>
      <p className="section-subtitle">Keep track of what you want to get done.</p>
     </div>
     <span className="task-count" aria-label={`${visibleTasks.length} visible tasks`}>{visibleTasks.length}</span>
    </div>

    <div className="filter-row" role="group" aria-label="Filter tasks">
     {filters.map(item => (
      <button
       key={item.id}
       type="button"
       className={`filter-button${filter === item.id ? " active" : ""}`}
       aria-pressed={filter === item.id}
       onClick={() => setFilter(item.id)}
      >
       {item.label}
      </button>
     ))}
    </div>

    <form className="task-form" onSubmit={addTask}>
     <input
      value={title}
      onChange={event => setTitle(event.target.value)}
      placeholder="Add a task to your list..."
      aria-label="New task"
     />
     <button type="submit" disabled={!title.trim()}>Add task <span aria-hidden="true">+</span></button>
    </form>

    {error && <p className="error-message" role="alert">{error}</p>}

    {visibleTasks.length ? (
     <ul className="task-list">
      {visibleTasks.map(task => (
       <li className={`task-row${task.completed ? " completed" : ""}`} key={task.id}>
        <div className="task-row-main">
         <button
          type="button"
          className={`task-check${task.completed ? " checked" : ""}`}
          onClick={() => toggleTask(task.id)}
          aria-label={`${task.completed ? "Mark incomplete" : "Mark complete"}: ${task.title}`}
          aria-pressed={task.completed}
         >
          {task.completed && (
           <svg className="checkmark" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="m3 8 3.2 3.2L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
           </svg>
          )}
         </button>
         <div className="task-copy">
          <p className="task-title">{task.title}</p>
          <span className="task-status"><span className="status-dot" />{task.completed ? "Completed" : "In progress"}</span>
         </div>
        </div>
        <div className="task-actions">
         <button type="button" className="delete-button" onClick={() => deleteTask(task.id)} aria-label={`Delete ${task.title}`}>Delete</button>
        </div>
       </li>
      ))}
     </ul>
    ) : (
     <div className="empty-state">
      <span className="empty-icon" aria-hidden="true">✦</span>
      <h3>{search ? "No matching tasks" : filter === "completed" ? "Nothing completed yet" : filter === "active" ? "You’re all caught up" : "A fresh start"}</h3>
      <p>{search ? "Try another search, or clear the search field." : filter === "all" ? "Add a task above and make today count." : "Try another filter or add a new task."}</p>
     </div>
    )}
   </section>

   <aside>
    <section className="glass-card progress-panel" aria-labelledby="progress-heading">
     <div className="progress-heading">
      <div>
       <h2 id="progress-heading">Your progress</h2>
       <p className="section-subtitle">A snapshot of your tasks</p>
      </div>
      <span className="progress-badge">This week</span>
     </div>
     <div
      className="progress-ring"
      role="img"
      aria-label={`${progress}% of tasks completed`}
      style={{ background: `conic-gradient(#7769e9 ${progress}%, #e8e7f1 ${progress}% 100%)` }}
     >
      <div className="progress-ring-center">
       <p className="progress-number">{progress}%</p>
       <p className="progress-caption">completed</p>
      </div>
     </div>
     <p className="progress-message">
      {tasks.length === 0
       ? "Add your first task and start building momentum."
       : progress === 100
        ? "Fantastic work. You’ve completed every task!"
        : "Keep going. Every finished task is progress."}
     </p>
     <div className="progress-stats">
      <div className="progress-stat"><span>Completed tasks</span><strong>{completedCount}</strong></div>
      <div className="progress-stat"><span>Still to do</span><strong>{pendingCount}</strong></div>
     </div>
    </section>

    <section className="study-note" aria-label="Study reminder">
     <p className="eyebrow">A gentle reminder</p>
     <h2>Small steps make big semesters.</h2>
     <p>Pick one task, give it your focus, and celebrate when it’s done.</p>
    </section>
   </aside>
  </div>
 </main>
 );
}
