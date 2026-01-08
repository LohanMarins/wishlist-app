import { useState, useEffect } from "react";
import AddItemForm from "./components/AddItemForm";
import ItemList from "./components/ItemList";
import { getItems } from "./services/api";
import "./App.css";

export default function App() {
  const [owner, setOwner] = useState("Lohan");
  const [items, setItems] = useState([]);

  const refreshItems = async () => {
    const data = await getItems(owner);
    setItems(data);
  };

  useEffect(() => {
    refreshItems();
  }, [owner]);

  return (
    <div className="container">
      <h1>🎁 Lista de Desejos</h1>

      <div className="user-select">
        <label style={{ marginRight: 10 }}>Usuário:</label>
        <select value={owner} onChange={(e) => setOwner(e.target.value)}>
          <option>Lohan</option>
          <option>Letícia</option>
        </select>
      </div>

      <AddItemForm owner={owner} refreshItems={refreshItems} />
      <ItemList items={items} owner={owner} refreshItems={refreshItems} />
    </div>
  );
}
