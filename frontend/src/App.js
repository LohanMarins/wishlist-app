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

  const refresh = async () => {
    const data = await getItems();
    setItems(data);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setUser(data.session.user);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  useEffect(() => {
    if (user) refresh();
  }, [user]);

  if (!user) return <Login />;

  return (
    <div className="app">
      <div className="header">
        <h1>🎁 Lista de Desejos</h1>
        <button onClick={() => supabase.auth.signOut()}>
          Sair
        </button>
      </div>

      <AddItemForm refresh={refresh} />

      {editing && (
        <div className="card">
          <h3>Editar item</h3>

          <input
            value={editing.item}
            onChange={e =>
              setEditing({ ...editing, item: e.target.value })
            }
          />

          <input
            value={editing.link || ""}
            onChange={e =>
              setEditing({ ...editing, link: e.target.value })
            }
          />

          <textarea
            value={editing.note || ""}
            onChange={e =>
              setEditing({ ...editing, note: e.target.value })
            }
          />

          <button
            onClick={async () => {
              await updateItem(editing.id, {
                item: editing.item,
                link: editing.link,
                note: editing.note
              });
              setEditing(null);
              refresh();
            }}
          >
            Salvar
          </button>

          <button
            className="secondary"
            onClick={() => setEditing(null)}
          >
            Cancelar
          </button>
        </div>
      )}

      <ItemList
        items={items}
        user={user}
        refresh={refresh}
        onEdit={setEditing}
      />
    </div>
  );
}
