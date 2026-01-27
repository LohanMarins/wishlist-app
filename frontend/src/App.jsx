import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import Login from "./components/Login";
import AddItemForm from "./components/AddItemForm";
import ItemList from "./components/ItemList";
import Filters from "./components/Filters";
import { getItems, updateItem } from "./services/api";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState("all");
  const [order, setOrder] = useState("date_desc");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const refresh = async () => {
    let data = await getItems();

    // fallback para itens antigos
    data = (data || []).map((i) => ({
      ...i,
      owner: i.owner || "lohan",
      comprado: i.comprado === true,
    }));

    if (filter !== "all") {
      data = data.filter((i) => i.owner === filter);
    }

    if (order === "date_desc") {
      data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    if (order === "date_asc") {
      data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }

    if (order === "dest") {
      data.sort((a, b) => (a.owner || "").localeCompare(b.owner || ""));
    }

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
  }, [user, filter, order]);

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
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️" : "🌙"}
          </button>
          <button className="danger" onClick={() => supabase.auth.signOut()}>
            Sair
          </button>
        </div>
      </header>

      <main>
        <AddItemForm refresh={refresh} />

        <Filters
          filter={filter}
          setFilter={setFilter}
          order={order}
          setOrder={setOrder}
        />

        {editing && (
          <div className="card">
            <h3>✏️ Editar item</h3>

            <input
              value={editing.item}
              onChange={(e) =>
                setEditing({ ...editing, item: e.target.value })
              }
            />

            <select
              value={editing.owner}
              onChange={(e) =>
                setEditing({ ...editing, owner: e.target.value })
              }
            >
              <option value="lohan">Lohan</option>
              <option value="leticia">Letícia</option>
              <option value="nina">Nina</option>
              <option value="casa">Casa</option>
            </select>

            <input
              placeholder="Link"
              value={editing.link || ""}
              onChange={(e) =>
                setEditing({ ...editing, link: e.target.value })
              }
            />

            <textarea
              placeholder="Anotação"
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
                    owner: editing.owner,
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
