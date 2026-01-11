import {
  buyItem,
  deliverItem,
  deleteItem
} from "../services/api";

export default function ItemList({ items, user, refresh, onEdit }) {
  return (
    <div>
      {items.map(i => (
        <div key={i.id} className="card">
          <strong>{i.item}</strong>
          <div>🎯 {i.owner}</div>

          {i.link && (
            <a href={i.link} target="_blank">Link</a>
          )}

          {i.note && <div>📝 {i.note}</div>}

          {!i.bought_by && (
            <button onClick={async () => {
              await buyItem(i.id, user.id);
              refresh();
            }}>
              Comprar
            </button>
          )}

          {i.bought_by && !i.delivered && (
            <button onClick={async () => {
              await deliverItem(i.id);
              refresh();
            }}>
              Entregue
            </button>
          )}

          {i.created_by === user.id && (
            <>
              <button onClick={() => onEdit(i)}>Editar</button>
              <button onClick={async () => {
                await deleteItem(i.id);
                refresh();
              }}>
                Remover
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
