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

const accents = ["pink", "blue", "purple", "orange"];

const Icon = ({ name }) => {
 const paths = {
  grid: <><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>,
  list: <><path d="M9 6h11M9 12h11M9 18h11" /><circle cx="4.5" cy="6" r="1" /><circle cx="4.5" cy="12" r="1" /><circle cx="4.5" cy="18" r="1" /></>,
  clock: <><circle cx="12" cy="12" r="8" /><path d="M12 8v4l2.5 2.5" /></>,
  check: <><circle cx="12" cy="12" r="8" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>,
  logout: <><path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" /><path d="M10 16l-4-4 4-4M6 12h10" /></>,
  search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.2 4.2" /></>,
  book: <><path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v15H7.5A2.5 2.5 0 0 0 5 20.5v-15Z" /><path d="M5 20.5A2.5 2.5 0 0 1 7.5 18H19v3H7.5" /></>,
  trash: <><path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12" /></>,
  plus: <path d="M12 5v14M5 12h14" />
 };
 return (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
   {paths[name]}
  </svg>
 );
};

// createdAt is a Firestore Timestamp (null for a moment while the server sets it).
const formatDate = timestamp => {
 if (!timestamp?.toDate) return "Just now";
 return timestamp.toDate().toLocaleDateString(undefined, { day: "numeric", month: "short" });
};

export default function Dashboard({ user }) {
 const [tasks, setTasks] = useState([]);
 const [loading, setLoading] = useState(true);
 const [title, setTitle] = useState("");
 const [adding, setAdding] = useState(false);
 const [filter, setFilter] = useState("all");
 const [search, setSearch] = useState("");
 const [error, setError] = useState("");

 // Real-time: Firestore pushes every change to this student's tasks straight to the page.
 // firestore.rules only allow reading tasks whose uid matches the logged-in user.
 useEffect(() => {
  const q = query(
   collection(db, "tasks"),
   where("uid", "==", user.uid)
  );
  return onSnapshot(q, snapshot => {
   setTasks(snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .sort((a, b) => (b.createdAt?.toMillis?.() ?? Infinity) - (a.createdAt?.toMillis?.() ?? Infinity)));
   setLoading(false);
  }, error => {
   console.error("Task listener error:", error);
   setError("Unable to load your tasks. Please try again.");
   setLoading(false);
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
 const recentTasks = tasks.slice(0, 4);
 const name = user.email?.split("@")[0] || "Student";

 // Changes go through Cloud Functions (functions/index.js); the list updates itself via onSnapshot.
 const addTask = async event => {
  event.preventDefault();
  const taskTitle = title.trim();
  if (!taskTitle || adding) return;
  setAdding(true);
  try {
   const createTask = httpsCallable(functions, "createTask");
   await createTask({ title: taskTitle });
   setTitle("");
   setError("");
  } catch (error) {
   setError(error.message || "Unable to add this task.");
  } finally {
   setAdding(false);
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

 const navItems = [
  { id: "all", label: "Dashboard", icon: "grid" },
  { id: "active", label: "To do", icon: "clock", badge: pendingCount },
  { id: "completed", label: "Completed", icon: "check" }
 ];

 // Concentric ring geometry
 const ring = (r, pct) => {
  const c = 2 * Math.PI * r;
  return { strokeDasharray: c, strokeDashoffset: c - (c * pct) / 100 };
 };
 const pendingPct = tasks.length ? 100 - progress : 0;

 return (
  <div className="layout">
   <aside className="sidebar">
    <div className="brand">Study<span>Space</span></div>
    <nav className="side-nav" aria-label="Main">
     {navItems.map(item => (
      <button
       key={item.id}
       type="button"
       className={`side-link${filter === item.id ? " active" : ""}`}
       onClick={() => setFilter(item.id)}
      >
       <Icon name={item.icon} />
       <span>{item.label}</span>
       {item.badge > 0 && <span className="side-badge">{item.badge}</span>}
      </button>
     ))}
    </nav>

    <div className="side-section">
     <p className="side-heading">Recent</p>
     {recentTasks.length ? recentTasks.map((task, i) => (
      <p className="side-project" key={task.id}>
       <span className={`dot ${accents[i % 4]}`} />
       <span className="side-project-name">{task.title}</span>
      </p>
     )) : <p className="side-empty">No tasks yet</p>}
    </div>

    <button type="button" className="side-link logout" onClick={() => signOut(auth)}>
     <Icon name="logout" /><span>Log out</span>
    </button>
   </aside>

   <main className="main">
    <header className="topbar">
     <h1>Dashboard</h1>
     <div className="topbar-right">
      <label className="search">
       <Icon name="search" />
       <input
        type="search"
        value={search}
        onChange={event => setSearch(event.target.value)}
        placeholder="Search tasks"
        aria-label="Search your tasks"
       />
      </label>
      <div className="profile">
       <span className="avatar" aria-hidden="true">{name.charAt(0).toUpperCase()}</span>
       <span className="profile-name">{name}</span>
      </div>
     </div>
    </header>

    <div className="content">
     <div className="content-main">
      <section className="highlights" aria-label="Task summary">
       <article className="card highlight featured">
        <span className="tile"><Icon name="book" /></span>
        <div><p className="highlight-title">Total Tasks</p><p className="highlight-sub">{tasks.length} {tasks.length === 1 ? "Task" : "Tasks"}</p></div>
       </article>
       <article className="card highlight">
        <span className="tile pink"><Icon name="clock" /></span>
        <div><p className="highlight-title">To do</p><p className="highlight-sub">{pendingCount} Pending</p></div>
       </article>
       <article className="card highlight">
        <span className="tile pink"><Icon name="check" /></span>
        <div><p className="highlight-title">Completed</p><p className="highlight-sub">{completedCount} Done</p></div>
       </article>
      </section>

      <section className="card panel" aria-labelledby="tasks-heading">
       <div className="panel-head">
        <h2 id="tasks-heading">My Tasks</h2>
        <div className="pills" role="group" aria-label="Filter tasks">
         {filters.map(item => (
          <button
           key={item.id}
           type="button"
           className={`pill${filter === item.id ? " active" : ""}`}
           aria-pressed={filter === item.id}
           onClick={() => setFilter(item.id)}
          >
           {item.label}
          </button>
         ))}
        </div>
       </div>

       <form className="task-form" onSubmit={addTask}>
        <input
         value={title}
         onChange={event => setTitle(event.target.value)}
         placeholder="Add a new task..."
         aria-label="New task"
         maxLength={100}
        />
        <button type="submit" className="btn-primary" disabled={!title.trim() || adding}>
         <Icon name="plus" /> {adding ? "Adding..." : "Add Task"}
        </button>
       </form>

       {error && <p className="error-message" role="alert">{error}</p>}

       {loading ? (
        <p className="loading-state" role="status">Loading your tasks...</p>
       ) : visibleTasks.length ? (
        <ul className="task-list">
         {visibleTasks.map((task, i) => {
          const accent = accents[i % 4];
          return (
           <li className={`task-row${task.completed ? " completed" : ""}`} key={task.id}>
            <button
             type="button"
             className={`task-check ${accent}${task.completed ? " checked" : ""}`}
             onClick={() => toggleTask(task.id)}
             aria-label={`${task.completed ? "Mark incomplete" : "Mark complete"}: ${task.title}`}
             aria-pressed={task.completed}
            >
             {task.completed ? (
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
               <path d="m3 8 3.2 3.2L13 4.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
             ) : <Icon name="book" />}
            </button>
            <div className="task-copy">
             <p className="task-title">{task.title}</p>
             <p className="task-meta">
              <Icon name="clock" /> {formatDate(task.createdAt)}
             </p>
            </div>
            <span className={`status ${task.completed ? "done" : "todo"}`}>
             {task.completed ? "Completed" : "In progress"}
            </span>
            <button type="button" className="icon-btn" onClick={() => deleteTask(task.id)} aria-label={`Delete ${task.title}`}>
             <Icon name="trash" />
            </button>
           </li>
          );
         })}
        </ul>
       ) : (
        <div className="empty-state">
         <span className="tile pink" aria-hidden="true"><Icon name="list" /></span>
         <h3>{search ? "No matching tasks" : filter === "completed" ? "Nothing completed yet" : filter === "active" ? "You’re all caught up" : "A fresh start"}</h3>
         <p>{search ? "Try another search, or clear the search field." : filter === "all" ? "Add a task above and make today count." : "Try another filter or add a new task."}</p>
        </div>
       )}
      </section>
     </div>

     <aside className="content-side">
      <section className="card panel" aria-labelledby="stat-heading">
       <div className="panel-head">
        <h2 id="stat-heading">Task Statistic</h2>
        <span className="pill active static">This week</span>
       </div>
       <div className="legend">
        <div><strong>{progress}%</strong><span><i className="dot pink" />Completed</span></div>
        <div><strong>{pendingPct}%</strong><span><i className="dot blue" />To do</span></div>
        <div><strong>{tasks.length}</strong><span><i className="dot purple" />Total</span></div>
       </div>
       <div className="rings" role="img" aria-label={`${progress}% of tasks completed`}>
        <svg viewBox="0 0 200 200">
         <circle className="ring-track" cx="100" cy="100" r="84" />
         <circle className="ring pink" cx="100" cy="100" r="84" style={ring(84, progress)} />
         <circle className="ring-track" cx="100" cy="100" r="64" />
         <circle className="ring blue" cx="100" cy="100" r="64" style={ring(64, pendingPct)} />
         <circle className="ring-track" cx="100" cy="100" r="44" />
         <circle className="ring purple" cx="100" cy="100" r="44" style={ring(44, tasks.length ? 100 : 0)} />
        </svg>
        <p className="rings-center">{progress}%</p>
       </div>
       <p className="rings-caption">
        {tasks.length === 0
         ? "Add your first task to start building momentum."
         : progress === 100
          ? "Fantastic work. Every task is done!"
          : `${pendingCount} task${pendingCount === 1 ? "" : "s"} left. Keep going!`}
       </p>
      </section>

      <section className="card panel" aria-labelledby="recent-heading">
       <div className="panel-head">
        <h2 id="recent-heading">Recent Tasks</h2>
       </div>
       {recentTasks.length ? (
        <ul className="recent-list">
         {recentTasks.map((task, i) => (
          <li key={task.id}>
           <span className={`num ${accents[i % 4]}`}>{i + 1}</span>
           <div className="recent-copy">
            <p>{task.title}</p>
            <span>{formatDate(task.createdAt)}</span>
           </div>
           <span className={`recent-status ${task.completed ? "done" : ""}`}>{task.completed ? "Done" : "To do"}</span>
          </li>
         ))}
        </ul>
       ) : <p className="muted small">Your newest tasks will show up here.</p>}
      </section>
     </aside>
    </div>
   </main>
  </div>
 );
}
