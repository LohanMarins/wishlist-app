import { useState } from "react";
import { addItem } from "../services/api";

export default function AddItemForm({ owner, refreshItems }) {
    const [item, setItem] = useState("");
    const [link, setLink] = useState("");
    const [category, setCategory] = useState("Casa");

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addItem({owner, item, link, category});
        setItem(""); setLink(""); setCategory("Casa");
        refreshItems();
    };

    return (
        <form onSubmit={handleSubmit} style={{marginBottom:"20px"}}>
            <input placeholder="Item" value={item} onChange={e=>setItem(e.target.value)} required />
            <input placeholder="Link (opcional)" value={link} onChange={e=>setLink(e.target.value)} />
            <select value={category} onChange={e=>setCategory(e.target.value)}>
                <option>Casa</option>
                <option>Nina</option>
                <option>Lohan</option>
                <option>Letícia</option>
            </select>
            <button type="submit">Adicionar</button>
        </form>
    );
}
