import { useEffect, useState } from "react";
import "./App.css";
import Login from "./Login";
import Register from "./Register";
import { getToken, clearToken } from "./auth";

const API = "http://192.168.50.131:8000";

export default function App() {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState("");
  const [prog, setProg] = useState(0);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [view, setView] = useState(getToken() ? "goals" : "login");

  const fetchGoals = () =>
    fetch(`${API}/goals`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    }).then((r) => r.json());

  useEffect(() => {
    if (view === "goals") {
      fetchGoals().then((data) => {
        if (Array.isArray(data)) {
          setGoals(data);
        } else {
          clearToken();
          setView("login");
        }
      });
    }
  }, [view]);

  const postGoal = (g) =>
    fetch(`${API}/goals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(g),
    });

  const patchGoal = (id, p) =>
    fetch(`${API}/goals/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(p),
    });

  const delGoal = (id) =>
    fetch(`${API}/goals/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });

  const add = async (e) => {
    e.preventDefault();
    await postGoal({ title, progress: Number(prog) });
    setTitle("");
    setProg(0);
    setGoals(await fetchGoals());
  };

  const upd = (id) => async (e) => {
    const val = Number(e.target.value);
    setGoals((gs) => gs.map((g) => (g.id === id ? { ...g, progress: val } : g)));
    await patchGoal(id, { progress: val });
  };

  const remove = (id) => async () => {
    await delGoal(id);
    setGoals((gs) => gs.filter((g) => g.id !== id));
  };

  const saveTitle = (id) => async () => {
    await patchGoal(id, { title: editTitle });
    setGoals(await fetchGoals());
    setEditId(null);
  };

  const logout = () => {
    clearToken();
    setView("login");
  };

  if (view === "login")
    return <Login onLogin={(v = "goals") => setView(v)} />;
  if (view === "register")
    return <Register onRegister={(v = "login") => setView(v)} />;

  return (
    <div className="wrapper">
      <h1>Ziel-Tracker</h1>
      <button onClick={logout} style={{ float: "right", marginBottom: 20 }}>
        Logout
      </button>

      <div className="card add">
        <h2>Neues Ziel</h2>
        <form onSubmit={add} className="form">
          <input
            placeholder="Titel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="number"
            min="0"
            max="100"
            value={prog}
            onChange={(e) => setProg(e.target.value)}
            required
          />
          <button>Speichern</button>
        </form>
      </div>

      {goals.map((g) => (
        <div className="card goal" key={g.id}>
          <div className="head">
            {editId === g.id ? (
              <>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.2em",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    marginRight: "8px",
                  }}
                />
                <button className="btn-small" onClick={saveTitle(g.id)} style={{ marginRight: 8 }}>
                  ✔
                </button>
                <button className="btn-small" onClick={() => setEditId(null)}>
                  ✖
                </button>
              </>
            ) : (
              <>
                <span className="goal-title">{g.title}</span>
                <button
                  className="btn-small"
                  style={{ marginLeft: 8 }}
                  onClick={() => {
                    setEditId(g.id);
                    setEditTitle(g.title);
                  }}
                  title="Titel bearbeiten"
                >
                  ✏️
                </button>
              </>
            )}
            <input type="number" min="0" max="100" value={g.progress} onChange={upd(g.id)} />
            <span className="percent">%</span>
            <button className="del" onClick={remove(g.id)} title="Löschen">
              🗑
            </button>
          </div>
          <div className="bar">
            <div className="fill" style={{ width: `${g.progress}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

