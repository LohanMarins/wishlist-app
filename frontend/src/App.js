import { useEffect, useState } from "react";
import Login from "./components/Login";
import AddItemForm from "./components/AddItemForm";
import ItemList from "./components/ItemList";
import { getMe, getItems } from "./services/api";

export default function App() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);

  const refresh = async () => {
    const data = await getItems();
    setItems(data);
  };

  useEffect(() => {
    getMe().then(res => {
      if (res.user) {
        setUser(res.user);
        refresh();
      }
    });
  }, []);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div>
      <h1>Lista de Desejos</h1>
      <p>Logado como: {user}</p>

      <AddItemForm refresh={refresh} />
      <ItemList items={items} refresh={refresh} />
    </div>
  );
}
