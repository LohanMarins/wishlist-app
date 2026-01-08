import { useState } from "react";
import { buyItem, deliverItem } from "../services/api";

export default function ItemList({ items, user, refresh, onEdit, onDelete }) {
  const [filter, setFilter] = useState("todos");
  const [sort, setSort] = useState("owner");

  const filtered = items.filter(i =>
    filter === "todos" ? true : i.owner === filter
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "owner") return a.owner.localeCompare(b.owner);
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return (
    <div>
      <h3>Lista de itens</h3>

      <div className="controls">
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="todos">Todos</option>
          <option value="lohan">Lohan</option>
          <option value="leticia">Letícia</option>
          <option value="nina">Nina</option>
          <option value="casa">Casa</option>
        </select>

        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="owner">Ordenar por destinatário</option>
          <option value="date">Ordenar por data</option>
        </select>
      </div>

      {sorted.map(i => (
        <div key={i.id} className="card">
          <strong>{i.item}</strong>
          <span className={`badge ${i.owner}`}>{i.owner}</span>

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
              <button onClick={() => buyItem(i.id).then(refresh)}>
                Comprar
              </button>
            )}

            {i.bought_by && !i.delivered && (
              <button onClick={() => deliverItem(i.id).then(refresh)}>
                Entregue
              </button>
            )}

            {/* editar/remover só quem criou */}
            {i.created_by === user && (
              <>
                <button
                  className="secondary small"
                  onClick={() => onEdit(i)}
                >
                  Editar
                </button>

                <button
                  className="danger small"
                  onClick={() => onDelete(i.id)}
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
