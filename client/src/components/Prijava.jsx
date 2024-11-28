// Prijava.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/fetchUsers"; // Import the login function

export default function Prijava({ setIsLoggedIn, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (email && password) {
      const credentials = { email, password };
      const result = await login(credentials);

      if (result && result.success) {
        setIsLoggedIn(true);
        console.log("Logged in as", result.username);
        setUser([result.username, result.lastname])
        navigate("/"); // Programmatically navigate to home
      } else {
        setErrorMessage(result.error || "Prijava nije uspjela. Pokušajte ponovo.");
      }
    } else {
      setErrorMessage("Upišite ime i lozinku");
    }
  };

  return (
    <div className="flex flex-col items-center bg-red-200 w-[60%] h-[50vh] justify-center rounded-md p-4">
      <h1 className="text-2xl mb-4">Prijava</h1>
      
      {errorMessage && <p className="text-red-600">{errorMessage}</p>} {/* Display error messages */}

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="mb-3 px-3 py-2 border rounded w-full sm:w-auto"
      />
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Lozinka"
        className="mb-3 px-3 py-2 border rounded w-full sm:w-auto"
      />
      
      <button
        onClick={handleLogin}
        className="text-lg px-4 py-2 bg-green-500 text-white rounded w-full sm:w-auto"
      >
        Prijavi se
      </button>

      <p className="text-sm mt-2">Prijavi se da rezerviraš termin</p>

      <Link to="/register" className="mt-4 text-sm underline">
        Nemate račun? Registrirajte se
      </Link>
    </div>
  );
}
