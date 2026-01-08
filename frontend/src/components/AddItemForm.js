import { useState } from "react";
import { addItem } from "../services/api";

export default function AddItemForm({ refresh }) {
  const [item, setItem] = useState("");
  const [category, setCategory] = useState("Casa");

  const submit = async (e) => {
    e.preventDefault();
    await addItem({ item, category, owner: category.toLowerCase() });
    setItem("");
    refresh();
  };

  return (
    <form onSubmit={submit}>
      <input value={item} onChange={e => setItem(e.target.value)} placeholder="Item" />
      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option>Casa</option>
        <option>Nina</option>
        <option>Lohan</option>
        <option>Letícia</option>
      </select>
      <button>Adicionar</button>
    </form>
  );
}
