import { buyItem, deliverItem } from "../services/api";

export default function ItemList({ items, refresh }) {
  return (
    <div>
      {items.map(i => (
        <div key={i.id}>
          <strong>{i.item}</strong>

          {!i.bought_by && (
            <button onClick={() => buyItem(i.id).then(refresh)}>
              Comprar
            </button>
          )}

          {i.bought_by && !i.delivered && (
            <button onClick={() => deliverItem(i.id).then(refresh)}>
              Entregue
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
