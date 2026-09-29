import { useEffect, useState } from "react";
import Header from "./components/Header";
import TaskCard from "./components/TaskCard";
import TaskForm from "./components/TaskForm";

const TAREFAS_INICIAIS = [
  {
    id: 1,
    titulo: "Assistir um filme",
    categoria: "Filmes",
    prioridade: "alta",
    concluida: false,
  },
  {
    id: 2,
    titulo: "Pesquisar novos lançamentos",
    categoria: "Filmes",
    prioridade: "media",
    concluida: true,
  },
  {
    id: 3,
    titulo: "Escolher um filme para assistir",
    categoria: "Pessoal",
    prioridade: "baixa",
    concluida: false,
  },
];

const FILTROS = [
  { valor: "todas", rotulo: "Todas" },
  { valor: "pendentes", rotulo: "Pendentes" },
  { valor: "concluidas", rotulo: "Concluídas" },
];

function App() {
  const [tarefas, setTarefas] = useState(() => {
    const salvas = localStorage.getItem("moviebox-tarefas");
    return salvas ? JSON.parse(salvas) : TAREFAS_INICIAIS;
  });

  const [filtro, setFiltro] = useState("todas");

  useEffect(() => {
    localStorage.setItem("moviebox-tarefas", JSON.stringify(tarefas));
  }, [tarefas]);

  function adicionarTarefa(novaTarefa) {
    setTarefas((atual) => [
      ...atual,
      {
        ...novaTarefa,
        id: Date.now(),
        concluida: false,
      },
    ]);
  }

  function alternarConcluida(id) {
    setTarefas((atual) =>
      atual.map((tarefa) =>
        tarefa.id === id
          ? { ...tarefa, concluida: !tarefa.concluida }
          : tarefa
      )
    );
  }

  function removerTarefa(id) {
    setTarefas((atual) => atual.filter((tarefa) => tarefa.id !== id));
  }

  const tarefasFiltradas = tarefas.filter((tarefa) => {
    if (filtro === "pendentes") return !tarefa.concluida;
    if (filtro === "concluidas") return tarefa.concluida;
    return true;
  });

  return (
    <div className="app">
      <Header />

      <main className="container">
        <section className="intro">
          <h2>Minha lista de filmes</h2>
          <p>
            Organize os filmes que você quer assistir e acompanhe suas tarefas.
          </p>
        </section>

        <TaskForm onAdicionar={adicionarTarefa} />

        <div className="lista-header">
          <h2>Minhas tarefas ({tarefas.length})</h2>

          <div className="filtros">
            {FILTROS.map((opcao) => (
              <button
                key={opcao.valor}
                onClick={() => setFiltro(opcao.valor)}
                className={filtro === opcao.valor ? "filtro ativo" : "filtro"}
              >
                {opcao.rotulo}
              </button>
            ))}
          </div>
        </div>

        <section className="tarefas">
          {tarefasFiltradas.length === 0 ? (
            <div className="vazio">
              <p>Nenhuma tarefa encontrada.</p>
            </div>
          ) : (
            tarefasFiltradas.map((tarefa) => (
              <TaskCard
                key={tarefa.id}
                titulo={tarefa.titulo}
                categoria={tarefa.categoria}
                prioridade={tarefa.prioridade}
                concluida={tarefa.concluida}
                onToggle={() => alternarConcluida(tarefa.id)}
                onRemover={() => removerTarefa(tarefa.id)}
              />
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default App;