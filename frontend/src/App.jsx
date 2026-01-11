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

    if (filter !== "all") {
      data = data.filter((i) => i.destinatario === filter);
    }

    if (order === "date_desc") {
      data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    if (order === "date_asc") {
      data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }

    if (order === "dest") {
      data.sort((a, b) =>
        a.destinatario.localeCompare(b.destinatario)
      );
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
