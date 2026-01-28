import { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabase";
import Login from "./components/Login";
import AddItemForm from "./components/AddItemForm";
import ItemList from "./components/ItemList";
import Filters from "./components/Filters";
import { getItems, updateItem } from "./services/api";
import "./App.css";

/**
 * ✅ PREENCHA AQUI:
 * email -> owner
 * Ex:
 * "lohan@email.com" => "lohan"
 * "leticia@email.com" => "leticia"
 */
const USER_OWNER_MAP = {
  "lohan.lam91@gmail.com": "lohan",
  "leticiamaramattos@gmail.com": "leticia",
};

export default function App() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState("all");
  const [order, setOrder] = useState("date_desc");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const currentOwner = useMemo(() => {
    const email = (user?.email || "").toLowerCase().trim();
    return USER_OWNER_MAP[email] || null;
  }, [user]);

  const refresh = async () => {
    let data = await getItems();

    // normalização + fallback pra itens antigos
    data = (data || []).map((i) => ({
      ...i,
      owner: i.owner || "lohan",
      comprado: i.comprado === true,
      delivered: i.delivered === true,
    }));

    // ==========================
    // ✅ ANTI-SPOILER
    // ==========================
    if (currentOwner) {
      const activePurchases = data.filter(
        (i) =>
          i.owner === currentOwner &&
          i.comprado &&
          !i.delivered &&
          i.bought_at
      );

      if (activePurchases.length > 0) {
        // pega o "cutoff" mais recente
        const cutoff = activePurchases
          .map((i) => new Date(i.bought_at).getTime())
          .reduce((a, b) => Math.max(a, b), 0);

        data = data.filter((i) => {
          if (i.owner !== currentOwner) return true;

          // sempre esconde itens comprados e não entregues
          if (i.comprado && !i.delivered) return false;

          // esconde itens criados antes (ou no momento) da compra mais recente não entregue
          const created = i.created_at ? new Date(i.created_at).getTime() : 0;
          if (created && created <= cutoff) return false;

          // itens novos (depois do cutoff) continuam visíveis para o dono
          return true;
        });
      }
    }

    // filtros (após anti-spoiler)
    if (filter !== "all") {
      data = data.filter((i) => i.owner === filter);
    }

    // ordenação
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
  }, [user, filter, order, currentOwner]);

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
        <AddItemForm refresh={refresh} currentOwner={currentOwner} />

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
              value={editing.owner || "lohan"}
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
                  try {
                    await updateItem(editing.id, {
                      item: editing.item,
                      owner: editing.owner,
                      link: editing.link,
                      note: editing.note,
                    });
                    setEditing(null);
                    await refresh();
                  } catch (e) {
                    console.error(e);
                    alert("Não foi possível salvar (ver console).");
                  }
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
          currentOwner={currentOwner}
        />
      </main>
    </div>
  );
}
