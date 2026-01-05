import { buyItem, deliverItem } from "../services/api";

export default function ItemList({ items, owner, refreshItems }) {
    return (
        <ul>
            {items.map(it => (
                <li key={it.id}>
                    <b>{it.item}</b> ({it.category}) {it.link && <a href={it.link} target="_blank">[Link]</a>}
                    {it.bought_by ? (
                        <span> - Comprado por {it.bought_by} {it.delivered ? "(Entregue)" : ""}</span>
                    ) : (
                        <button onClick={()=>buyItem(it.id, owner).then(refreshItems)}>Comprar</button>
                    )}
                    {it.bought_by && !it.delivered && it.bought_by===owner && (
                        <button onClick={()=>deliverItem(it.id).then(refreshItems)}>Marcar Entregue</button>
                    )}
                </li>
            ))}
        </ul>
    );
}
