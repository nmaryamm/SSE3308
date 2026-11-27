import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [error, setError] = useState("");

 const login = async event => {
  event.preventDefault();
  setError("");
  try {
   await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
   setError(error.message || "Unable to sign in. Please try again.");
  }
 };

 const register = async () => {
  setError("");
  try {
   await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
   setError(error.message || "Unable to create your account. Please try again.");
  }
 };

 return (
  <main className="auth-shell">
   <section className="auth-card">
    <div className="auth-side">
     <div className="brand">Study<span>Space</span></div>
     <div>
      <h2>Organise your semester, one task at a time.</h2>
      <p>Track assignments, tick them off, and watch your progress grow.</p>
     </div>
     <div className="auth-dots" aria-hidden="true">
      <span className="dot pink" /><span className="dot blue" /><span className="dot purple" /><span className="dot orange" />
     </div>
    </div>

    <div className="auth-form-wrap">
     <h1>Welcome back</h1>
     <p className="muted">Sign in to continue, or create a new account.</p>

     <form className="auth-form" onSubmit={login}>
      <label className="field">
       Email address
       <input
        type="email"
        autoComplete="email"
        placeholder="you@school.edu"
        value={email}
        onChange={event => setEmail(event.target.value)}
        required
       />
      </label>
      <label className="field">
       Password
       <input
        type="password"
        autoComplete="current-password"
        placeholder="Enter your password"
        value={password}
        onChange={event => setPassword(event.target.value)}
        required
       />
      </label>
      <div className="auth-actions">
       <button type="submit" className="btn-primary">Sign in</button>
       <button type="button" className="btn-secondary" onClick={register}>Create account</button>
      </div>
      {error && <p className="error-message" role="alert">{error}</p>}
     </form>
    </div>
   </section>
  </main>
 );
}
