import { useEffect, useState } from "react";
import Login from "./components/Login";
import AddItemForm from "./components/AddItemForm";
import ItemList from "./components/ItemList";
import { getItems, deleteItem, updateItem } from "./services/api";
import "./App.css";

export default function App() {
  // ---------- estados ----------
  const [user, setUser] = useState(localStorage.getItem("token"));
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);

  // ---------- funções ----------
  const refresh = async () => {
    const data = await getItems();
    setItems(data);
  };

  // ---------- efeitos ----------
  useEffect(() => {
    if (user) refresh();
  }, [user]);

  // ---------- login ----------
  if (!user) {
    return <Login onLogin={setUser} />;
  }

  // ---------- UI ----------
  return (
    <div className="app">
      <div className="header">
        <h1>🎁 Lista de Desejos</h1>
        <div>
          <span style={{ marginRight: 10 }}>Logado como: <b>{user}</b></span>
          <button
            className="secondary"
            onClick={() => {
              localStorage.removeItem("token");
              setUser(null);
            }}
          >
            Sair
          </button>
        </div>
      </div>

      {/* formulário */}
      <AddItemForm user={user} refresh={refresh} />

      {/* editor */}
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

          <div style={{ marginTop: 10 }}>
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
              style={{ marginLeft: 8 }}
              onClick={() => setEditing(null)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* lista */}
      <ItemList
        items={items}
        user={user}
        refresh={refresh}
        onEdit={setEditing}
        onDelete={async (id) => {
          if (window.confirm("Remover este item?")) {
            await deleteItem(id);
            refresh();
          }
        }}
      />
    </div>
  );
}
