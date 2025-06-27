import { useState } from "react";

const API = "http://192.168.50.133:8000";

export default function Register({ onRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const register = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      onRegister();
    } else {
      setError("Registrierung fehlgeschlagen");
    }
  };

  return (
    <div className="wrapper">
      <h1>Registrieren</h1>
      <form onSubmit={register} className="form">
        <input
          placeholder="Benutzername"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button>Registrieren</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p style={{ marginTop: "16px" }}>
        Bereits registriert?{" "}
        <button
          onClick={() => onRegister("login")}
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          Zum Login
        </button>
      </p>
    </div>
  );
}

