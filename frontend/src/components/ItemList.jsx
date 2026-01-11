import { deleteItem, updateItem } from "../services/api";

export default function ItemList({ items, user, refresh, onEdit }) {
  const currentUserId = user.id; // ✅ UUID correto

  return (
    <>
      {items.map((item) => (
        <div
          key={item.id}
          className={`card item ${
            item.destinatario === "Nina"
              ? "nina"
              : item.destinatario === "Casa"
              ? "casa"
              : ""
          }`}
        >
          <h3>{item.item}</h3>

          <p>
            <strong>Para:</strong>{" "}
            {item.destinatario || "—"}
          </p>

          <p>
            <strong>Adicionado por:</strong>{" "}
            {item.created_by === currentUserId
              ? "Você"
              : "Outro usuário"}
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

            {/* ✅ AGORA FUNCIONA */}
            {item.created_by === currentUserId && (
              <>
                <button
                  className="secondary"
                  onClick={() => onEdit(item)}
                >
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
