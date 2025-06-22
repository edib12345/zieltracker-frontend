import { useState } from "react";
import { saveToken } from "./auth";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async (e) => {
    e.preventDefault();
    const res = await fetch("http://192.168.50.131:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
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
      <h1>Login</h1>
      <form onSubmit={login} className="form">
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
        <button>Einloggen</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p style={{ marginTop: "16px" }}>
        Noch kein Konto?{" "}
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
          Jetzt registrieren
        </button>
      </p>
    </div>
  );
}

