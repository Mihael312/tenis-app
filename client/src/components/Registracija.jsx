import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { addUser } from "../../services/fetchUsers";

export default function Registracija({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate(); // Hook to navigate after successful registration

  const handleRegister = async () => {
    if (username && password && email && confirmPassword) {
      if (password !== confirmPassword) {
        alert("Lozinke se ne podudaraju. Pokušajte ponovo.");
        return;
      }

      const newUser = { username, lastname, email, password };
      const result = await addUser(newUser);

      if (result) {
        if (result.status === 201) {
          // Registration successful
          alert("Registracija uspješna!");
          setIsLoggedIn(true);
          navigate("/");
        } else if (result.status === 409) {
          // Username is already taken
          alert("Korisničko ime je zauzeto");
        } else {
          // Other errors
          alert(result.error || "Registracija nije uspjela. Pokušajte ponovo.");
        }
      } else {
        // If the result is null or undefined
        alert("Registracija nije uspjela. Pokušajte ponovo.");
      }
    } else {
      alert("Molimo unesite korisničko ime i lozinke.");
    }
  };

  return (
    <div className="flex flex-col items-center bg-blue-200 w-[60%] h-[50vh] justify-center rounded-md p-4">
      <h1 className="text-2xl mb-4">Registracija</h1>

      {/* Username Input */}
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Ime"
        className="mb-3 px-3 py-2 border rounded w-full sm:w-auto"
      />

      <input
        type="text"
        value={lastname}
        onChange={(e) => setLastname(e.target.value)}
        placeholder="Prezime"
        className="mb-3 px-3 py-2 border rounded w-full sm:w-auto"
      />

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="mb-3 px-3 py-2 border rounded w-full sm:w-auto"
      />

      {/* Password Input */}
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Lozinka"
        className="mb-3 px-3 py-2 border rounded w-full sm:w-auto"
      />

      {/* Confirm Password Input */}
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Ponovi lozinku"
        className="mb-3 px-3 py-2 border rounded w-full sm:w-auto"
      />

      {/* Register Button */}
      <button
        onClick={handleRegister}
        className="text-lg px-4 py-2 bg-blue-500 text-white rounded w-full sm:w-auto"
      >
        Registriraj se
      </button>

      <p className="text-sm mt-2">Registriraj se da napraviš račun</p>

      {/* Link to go back to login */}
      <Link to="/login" className="mt-4 text-sm underline">
        Idi na prijavu
      </Link>
    </div>
  );
}
