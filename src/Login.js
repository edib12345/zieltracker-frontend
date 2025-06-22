import { useState } from "react";
import { saveToken } from "./auth";

const API = "http://192.168.50.131:8000";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      saveToken(data.access_token);
      onLogin("goals");
    } else {
      setError("Login fehlgeschlagen");
    }
  };

  return (
    <div className="wrapper">
      <img src="/logo192.png" alt="Logo" style={{ width: 120, marginBottom: 24 }} />
      <h1>Anmelden</h1>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
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
        <button>Anmelden</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p style={{ marginTop: "16px" }}>
        Noch kein Account?{" "}
        <button
          onClick={() => onLogin("register")}
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          Registrieren
        </button>
      </p>
    </div>
  );
}

