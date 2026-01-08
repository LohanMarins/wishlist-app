import { useEffect, useState } from "react";
import Login from "./components/Login";
import AddItemForm from "./components/AddItemForm";
import ItemList from "./components/ItemList";
import { getItems } from "./services/api";

export default function App() {
  const [user, setUser] = useState(localStorage.getItem("token"));
  const [items, setItems] = useState([]);

  const refresh = async () => {
    const data = await getItems();
    setItems(data);
  };

  useEffect(() => {
    if (user) refresh();
  }, [user]);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div>
      <h1>Lista de Desejos</h1>
      <p>Logado como: {user}</p>

      <button onClick={() => {
        localStorage.removeItem("token");
        setUser(null);
      }}>
        Sair
      </button>

      <AddItemForm refresh={refresh} />
      <ItemList items={items} refresh={refresh} />
    </div>
  );
}
