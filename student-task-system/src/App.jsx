import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
 const [user, setUser] = useState(null);
 const [loading, setLoading] = useState(true);
 useEffect(() => {
 return onAuthStateChanged(auth, currentUser => {
 setUser(currentUser);
 setLoading(false);
 });
 }, []);
 if (loading) {
 return <h2>Loading...</h2>;
 }
 return user
 ? <Dashboard user={user} />
 : <Login />;
}
export default App;