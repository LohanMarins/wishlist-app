import { useState } from "react";
import { supabase } from "../supabase";
import { addItem } from "../services/api";

export default function AddItemForm({ refresh }) {
  const [item, setItem] = useState("");
  const [owner, setOwner] = useState("lohan");
  const [link, setLink] = useState("");
  const [note, setNote] = useState("");

  const submit = async () => {
    if (!item) return;

    const { data } = await supabase.auth.getUser();

    await addItem({
      item,
      owner,
      link: link || null,
      note: note || null,
      created_by: data.user.id
    });

    setItem("");
    setLink("");
    setNote("");
    refresh();
  };

  return (
    <div className="card">
      <h3>Adicionar item</h3>

      <input
        placeholder="Item"
        value={item}
        onChange={e => setItem(e.target.value)}
      />

      <select value={owner} onChange={e => setOwner(e.target.value)}>
        <option value="lohan">Lohan</option>
        <option value="leticia">Letícia</option>
        <option value="nina">Nina</option>
        <option value="casa">Casa</option>
      </select>

      <input
        placeholder="Link para compra (opcional)"
        value={link}
        onChange={e => setLink(e.target.value)}
      />

      <textarea
        placeholder="Anotação (opcional)"
        value={note}
        onChange={e => setNote(e.target.value)}
      />

      <button onClick={submit}>Adicionar</button>
    </div>
  );
}
