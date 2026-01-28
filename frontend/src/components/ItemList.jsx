import { deleteItem, updateItem } from "../services/api";

export default function ItemList({ items, user, refresh, onEdit, currentOwner }) {
  const currentUserId = user.id;

  const labelOwner = (o) => {
    if (o === "lohan") return "Lohan";
    if (o === "leticia") return "Letícia";
    if (o === "nina") return "Nina";
    if (o === "casa") return "Casa";
    return o || "—";
  };

  const statusText = (item) => {
    if (item.delivered) return "✅ Entregue";
    if (item.comprado) return "🛍️ Comprado";
    return "📝 Disponível";
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
          <div className="row">
            <h3 style={{ margin: 0 }}>{item.item}</h3>
            <span className={`badge ${item.delivered ? "ok" : item.comprado ? "warn" : ""}`}>
              {statusText(item)}
            </span>
          </div>

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
            {/* Comprar */}
            {!item.comprado && (
              <button
                onClick={async () => {
                  if (!window.confirm("Marcar como comprado?")) return;

                  const now = new Date().toISOString();
                  const isSelfGift = currentOwner && item.owner === currentOwner;

                  try {
                    await updateItem(item.id, {
                      comprado: true,
                      bought_by: currentUserId,
                      bought_at: now,

                      // se comprou algo "para si mesmo", marca entregue automaticamente
                      delivered: isSelfGift ? true : false,
                      delivered_at: isSelfGift ? now : null,
                    });

                    await refresh();
                  } catch (e) {
                    console.error(e);
                    alert("Não foi possível marcar como comprado (ver console).");
                  }
                }}
              >
                🛍️ Comprar
              </button>
            )}

            {/* Entregue (só quem comprou vê) */}
            {item.comprado && !item.delivered && item.bought_by === currentUserId && (
              <button
                className="secondary"
                onClick={async () => {
                  if (!window.confirm("Marcar como entregue?")) return;

                  try {
                    await updateItem(item.id, {
                      delivered: true,
                      delivered_at: new Date().toISOString(),
                    });
                    await refresh();
                  } catch (e) {
                    console.error(e);
                    alert("Não foi possível marcar como entregue (ver console).");
                  }
                }}
              >
                ✅ Entregue
              </button>
            )}

            {/* Editar / Remover (só quem criou) */}
            {item.created_by === currentUserId && (
              <>
                <button className="secondary" onClick={() => onEdit(item)}>
                  ✏️ Editar
                </button>

                <button
                  className="danger"
                  onClick={async () => {
                    if (!window.confirm("Remover item?")) return;
                    try {
                      await deleteItem(item.id);
                      await refresh();
                    } catch (e) {
                      console.error(e);
                      alert("Não foi possível remover (ver console).");
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
