import {
  buyItem,
  deliverItem,
  deleteItem
} from "../services/api";

export default function ItemList({
  items,
  user,
  refresh,
  onEdit
}) {
  return (
    <div>
      <h3>Lista</h3>

      {items.map(i => (
        <div key={i.id} className="card">
          <strong>{i.item}</strong>

          <div>
            🎯 {i.owner}
            {i.created_by === user.id && " (criado por você)"}
          </div>

          {i.link && (
            <div>
              🔗 <a href={i.link} target="_blank" rel="noreferrer">
                Link
              </a>
            </div>
          )}

          {i.note && <div>📝 {i.note}</div>}

          <div style={{ marginTop: 8 }}>
            {!i.bought_by && (
              <button
                onClick={async () => {
                  await buyItem(i.id, user.id);
                  refresh();
                }}
              >
                Comprar
              </button>
            )}

            {i.bought_by && !i.delivered && (
              <button
                onClick={async () => {
                  await deliverItem(i.id);
                  refresh();
                }}
              >
                Entregue
              </button>
            )}

            {i.created_by === user.id && (
              <>
                <button
                  className="secondary small"
                  onClick={() => onEdit(i)}
                >
                  Editar
                </button>

                <button
                  className="danger small"
                  onClick={async () => {
                    if (window.confirm("Remover item?")) {
                      await deleteItem(i.id);
                      refresh();
                    }
                  }}
                >
                  Remover
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
