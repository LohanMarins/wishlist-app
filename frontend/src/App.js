import { useState, useEffect } from "react";
import AddItemForm from "./components/AddItemForm";
import ItemList from "./components/ItemList";
import { getItems } from "./services/api";

export default function App() {
  const [owner, setOwner] = useState("Lohan");
  const [items, setItems] = useState([]);

  const refreshItems = async () => {
    const data = await getItems(owner);
    setItems(data);
  };

  useEffect(() => { refreshItems(); }, [owner]);

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl w-full max-w-3xl p-8">
        <h1 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-6">
          🎁 Lista de Desejos
        </h1>

        <div className="flex justify-center mb-6">
          <label className="font-medium text-gray-700 dark:text-gray-300 mr-3">
            Usuário:
          </label>
          <select
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            className="select"
          >
            <option>Lohan</option>
            <option>Letícia</option>
          </select>
        </div>

        <AddItemForm owner={owner} refreshItems={refreshItems} />
        <ItemList items={items} owner={owner} refreshItems={refreshItems} />
      </div>
    </div>
  );
}
