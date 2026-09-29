const prioridadeEstilo = {
  alta: "prioridade alta",
  media: "prioridade media",
  baixa: "prioridade baixa",
};

const prioridadeTexto = {
  alta: "Alta",
  media: "Média",
  baixa: "Baixa",
};

function TaskCard({
  titulo,
  categoria,
  prioridade,
  concluida,
  onToggle,
  onRemover,
}) {
  return (
    <article
      className={
        concluida
          ? "card concluida"
          : "card"
      }
    >

      <div className="card-topo">

        <span className="categoria">
          {categoria}
        </span>

        <span
          className={
            prioridadeEstilo[prioridade]
          }
        >
          {prioridadeTexto[prioridade]}
        </span>

      </div>

      <h3>{titulo}</h3>

      <div className="card-acoes">

        <label>
          <input
            type="checkbox"
            checked={concluida}
            onChange={onToggle}
          />

          Concluída
        </label>

        <button
          type="button"
          onClick={onRemover}
          aria-label={
            `Remover tarefa: ${titulo}`
          }
        >
          Remover
        </button>

      </div>

    </article>
  );
}

export default TaskCard;