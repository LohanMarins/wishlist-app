import { useState } from "react";
import { addItem } from "../services/api";

export default function AddItemForm({ user, refresh }) {
  const [item, setItem] = useState("");
  const [link, setLink] = useState("");
  const [note, setNote] = useState("");
  const [owner, setOwner] = useState(user);

  const allowedOwners =
    user === "lohan"
      ? ["lohan", "nina", "casa"]
      : ["leticia", "nina", "casa"];

  const submit = async (e) => {
    e.preventDefault();

    await addItem({
      item,
      owner,
      category: owner,
      link,
      note
    });

    setItem("");
    setLink("");
    setNote("");
    setOwner(user);
    refresh();
  };

  return (
    <form onSubmit={submit}>
      <h3>Adicionar item</h3>

      <input
        placeholder="Item"
        value={item}
        onChange={e => setItem(e.target.value)}
        required
      />

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

      <select value={owner} onChange={e => setOwner(e.target.value)}>
        {allowedOwners.map(o => (
          <option key={o} value={o}>
            {o.charAt(0).toUpperCase() + o.slice(1)}
          </option>
        ))}
      </select>

      <button>Adicionar</button>
    </form>
  );
}
