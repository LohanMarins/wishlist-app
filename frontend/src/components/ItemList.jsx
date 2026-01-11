import { deleteItem, updateItem } from "../services/api";

export default function ItemList({ items, user, refresh, onEdit }) {
  const currentUserId = user.id;

  const labelOwner = (owner) => {
    if (owner === "lohan") return "Lohan";
    if (owner === "leticia") return "Letícia";
    if (owner === "nina") return "Nina";
    if (owner === "casa") return "Casa";
    return owner || "—";
  };

  return (
    <>
      {items.map((item) => (
        <div
          key={item.id}
          className={`card item ${
            item.owner === "nina" ? "nina" : item.owner === "casa" ? "casa" : ""
          }`}
        >
          <h3>{item.item}</h3>

          <p>
            <strong>Para:</strong> {labelOwner(item.owner)}
          </p>

          <p>
            <strong>Adicionado por:</strong>{" "}
            {item.created_by === currentUserId ? "Você" : "Outro usuário"}
          </p>

          {item.note && <p>📝 {item.note}</p>}

          {item.link && (
            <a href={item.link} target="_blank" rel="noreferrer">
              🔗 Link
            </a>
          )}

          <div className="actions">
            {!item.comprado && (
              <button
                onClick={async () => {
                  if (window.confirm("Marcar como comprado?")) {
                    await updateItem(item.id, { comprado: true });
                    refresh();
                  }
                }}
              >
                🛍️ Comprar
              </button>
            )}

            {item.created_by === currentUserId && (
              <>
                <button className="secondary" onClick={() => onEdit(item)}>
                  ✏️ Editar
                </button>

                <button
                  className="danger"
                  onClick={async () => {
                    if (window.confirm("Remover item?")) {
                      await deleteItem(item.id);
                      refresh();
                    }
                  }}
                >
                  🗑️ Remover
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </>
  );
}
