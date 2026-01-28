import { useMemo, useState } from "react";
import { supabase } from "../supabase";
import { addItem } from "../services/api";

export default function AddItemForm({ refresh, currentOwner }) {
  const [item, setItem] = useState("");
  const [owner, setOwner] = useState(currentOwner || "lohan");
  const [link, setLink] = useState("");
  const [note, setNote] = useState("");

  const allowedOwners = useMemo(() => {
    // Se não identificarmos o usuário, liberamos tudo (fallback)
    if (!currentOwner) return ["lohan", "leticia", "nina", "casa"];
    return [currentOwner, "nina", "casa"];
  }, [currentOwner]);

  const submit = async () => {
    if (!item || !owner) return;

    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      alert("Usuário não autenticado");
      return;
    }

    // garante que não dá pra inserir para outro humano
    if (currentOwner && !allowedOwners.includes(owner)) {
      alert("Você só pode adicionar itens para você, Nina ou Casa.");
      return;
    }

    await addItem({
      item,
      owner,
      link: link || null,
      note: note || null,
      created_by: data.user.id,
      // defaults garantidos no banco, mas ok
      comprado: false,
      delivered: false,
      bought_by: null,
      bought_at: null,
      delivered_at: null,
    });

    setItem("");
    setLink("");
    setNote("");
    setOwner(currentOwner || "lohan");
    refresh();
  };

  return (
    <div className="card">
      <h3>➕ Adicionar item</h3>

      <input
        placeholder="Item"
        value={item}
        onChange={(e) => setItem(e.target.value)}
      />

      <select value={owner} onChange={(e) => setOwner(e.target.value)}>
        {allowedOwners.includes("lohan") && <option value="lohan">Lohan</option>}
        {allowedOwners.includes("leticia") && <option value="leticia">Letícia</option>}
        {allowedOwners.includes("nina") && <option value="nina">Nina</option>}
        {allowedOwners.includes("casa") && <option value="casa">Casa</option>}
      </select>

      <input
        placeholder="Link para compra (opcional)"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />

      <textarea
        placeholder="Anotação (opcional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button onClick={submit}>Adicionar</button>
    </div>
  );
}
