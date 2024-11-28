import { Link } from "react-router-dom";

export default function Navbar({ isLoggedIn }) {
  return (
    <div className="flex justify-around text-3xl font-bold my-5">
      <Link to={"/"}>
        <h1 className="bg-gray-100 py-2 px-4 rounded">Tenis</h1>
      </Link>
      {!isLoggedIn ? (
        <Link to="/login">
          <button className="text-lg px-4 py-2 bg-green-500 text-white rounded">
            Prijava
          </button>
        </Link> 
      ) : null}
    </div>
  );
}
