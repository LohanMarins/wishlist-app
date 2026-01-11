export default function Filters({
  filter,
  setFilter,
  order,
  setOrder,
}) {
  return (
    <div className="card">
      <h3>🔍 Filtros</h3>

      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">Todos</option>
        <option value="Lohan">Lohan</option>
        <option value="Letícia">Letícia</option>
        <option value="Nina">Nina</option>
        <option value="Casa">Casa</option>
      </select>

      <select value={order} onChange={(e) => setOrder(e.target.value)}>
        <option value="date_desc">Data (mais recente)</option>
        <option value="date_asc">Data (mais antiga)</option>
        <option value="dest">Destinatário</option>
      </select>
    </div>
  );
}
