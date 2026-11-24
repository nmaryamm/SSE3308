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
   <div className="auth-brand">
    <span className="brand-mark" aria-hidden="true">
     <svg viewBox="0 0 24 24" fill="none">
      <path d="m3.5 9.2 8.5-4 8.5 4-8.5 4-8.5-4Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M7 11v4.1c2.8 2.1 7.2 2.1 10 0V11m3.5-1.8v5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
     </svg>
    </span>
    <span>StudySpace</span>
   </div>
   <p className="eyebrow"><span className="eyebrow-dot" /> Your student workspace</p>
   <h1>Make room for progress.</h1>
   <p className="muted">Sign in to pick up where you left off, or create an account to get started.</p>

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
     <button type="submit">Sign in</button>
     <button type="button" className="secondary-button" onClick={register}>Create account</button>
    </div>
    {error && <p className="error-message" role="alert">{error}</p>}
   </form>
   <p className="auth-footer"><span className="auth-footer-dot" /> Your tasks stay in sync as you work</p>
  </section>
 </main>
 );
}