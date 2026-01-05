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

    useEffect(()=>{refreshItems()}, [owner]);

    return (
        <div style={{padding:"20px"}}>
            <h1>Lista de Desejos</h1>
            <label>
                Usuário: 
                <select value={owner} onChange={e=>setOwner(e.target.value)}>
                    <option>Lohan</option>
                    <option>Letícia</option>
                </select>
            </label>
            <AddItemForm owner={owner} refreshItems={refreshItems} />
            <ItemList items={items} owner={owner} refreshItems={refreshItems} />
        </div>
    );
}
