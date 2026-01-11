import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import Login from "./components/Login";
import AddItemForm from "./components/AddItemForm";
import ItemList from "./components/ItemList";
import { getItems, updateItem } from "./services/api";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const refresh = async () => {
    const data = await getItems();
    setItems(data);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setUser(data.session.user);
    });

    supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  useEffect(() => {
    if (user) refresh();
  }, [user]);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  if (!user) return <Login />;

  return (
    <div className="app">
      <header className="header">
        <h1>🎁 Lista de Desejos</h1>

        <div className="header-actions">
          <button
            className="icon-button"
            onClick={() => setDarkMode(!darkMode)}
            title="Alternar tema"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          <button
            className="danger"
            onClick={() => supabase.auth.signOut()}
          >
            Sair
          </button>
        </div>
      </header>

      <main>
        <AddItemForm refresh={refresh} />

        {editing && (
          <div className="card">
            <h3>✏️ Editar item</h3>

            <input
              value={editing.item}
              onChange={(e) =>
                setEditing({ ...editing, item: e.target.value })
              }
            />

            <input
              value={editing.link || ""}
              onChange={(e) =>
                setEditing({ ...editing, link: e.target.value })
              }
            />

            <textarea
              value={editing.note || ""}
              onChange={(e) =>
                setEditing({ ...editing, note: e.target.value })
              }
            />

            <div className="actions">
              <button
                onClick={async () => {
                  await updateItem(editing.id, {
                    item: editing.item,
                    link: editing.link,
                    note: editing.note,
                  });
                  setEditing(null);
                  refresh();
                }}
              >
                Salvar
              </button>

              <button className="secondary" onClick={() => setEditing(null)}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        <ItemList
          items={items}
          user={user}
          refresh={refresh}
          onEdit={setEditing}
        />
      </main>
    </div>
  );
}
