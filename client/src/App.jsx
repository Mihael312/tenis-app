import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { fetchUsers } from "../services/fetchUsers";
import { fetchSessions } from "../services/fetchSessions";
import Calendar from "./components/Calendar";
import Navbar from "./components/Navbar";
import Prijava from "./components/Prijava";
import Registracija from "./components/Registracija";
import "./App.css";

export default function App() {
  const [user, setUser] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  // Fetch sessions when the component mounts
  useEffect(() => {
    fetchSessions().then((fetchedSessions) => {
      if (fetchedSessions) {
        console.log("Fetched sessions:", fetchedSessions);
        setSessions(fetchedSessions);
      }
    });
  }, []);

  return (
    <Router>
    <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    <div className="m-5 flex justify-center h-[80vh]">
      <Routes>
        <Route path="/" element={<Calendar sessions={sessions} setSessions={setSessions}isLoggedIn={isLoggedIn} user={user}/>} />
        <Route path="/login" element={<Prijava setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
        <Route path="/register" element={<Registracija setIsLoggedIn={setIsLoggedIn}/>} />
      </Routes>
    </div>
  </Router>
  
  );
}
