import { useEffect, useState } from "react";

import Header from "./components/Header";
import StatusRede from "./components/StatusRede";
import InstallPrompt from "./components/InstallPrompt";
import NotificationPrompt from "./components/NotificationPrompt";
import TaskCard from "./components/TaskCard";
import TaskForm from "./components/TaskForm";

import { notificarLocal } from "./notifications";
import { agendarSincronizacao } from "./backgroundSync";

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
  {
    valor: "todas",
    rotulo: "Todas",
  },
  {
    valor: "pendentes",
    rotulo: "Pendentes",
  },
  {
    valor: "concluidas",
    rotulo: "Concluídas",
  },
];

function App() {
  const [tarefas, setTarefas] = useState(() => {
    const salvas = localStorage.getItem(
      "moviebox-tarefas"
    );

    return salvas
      ? JSON.parse(salvas)
      : TAREFAS_INICIAIS;
  });

  const [filtro, setFiltro] = useState("todas");
  const [anuncio, setAnuncio] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "moviebox-tarefas",
      JSON.stringify(tarefas)
    );
  }, [tarefas]);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    function aoReceberMensagem(evento) {
      if (
        evento.data?.tipo ===
        "SINCRONIZADO"
      ) {
        setAnuncio(
          "🔄 Sincronização em segundo plano concluída."
        );
      }
    }

    navigator.serviceWorker.addEventListener(
      "message",
      aoReceberMensagem
    );

    return () => {
      navigator.serviceWorker.removeEventListener(
        "message",
        aoReceberMensagem
      );
    };
  }, []);

  function avisarMudancaOffline() {
    if (!navigator.onLine) {
      agendarSincronizacao(
        "sincronizar-tarefas"
      );

      setAnuncio(
        (atual) =>
          `${atual} A sincronização ocorrerá quando a conexão voltar.`
      );
    }
  }

  function adicionarTarefa(novaTarefa) {
    setTarefas((atual) => [
      ...atual,
      {
        ...novaTarefa,
        id: Date.now(),
        concluida: false,
      },
    ]);

    setAnuncio(
      `Tarefa "${novaTarefa.titulo}" adicionada.`
    );

    avisarMudancaOffline();
  }

  function alternarConcluida(id) {
    const tarefa = tarefas.find(
      (t) => t.id === id
    );

    if (!tarefa) {
      return;
    }

    const vaiConcluir = !tarefa.concluida;

    const status = vaiConcluir
      ? "concluída"
      : "pendente";

    setTarefas((atual) =>
      atual.map((t) =>
        t.id === id
          ? {
              ...t,
              concluida: !t.concluida,
            }
          : t
      )
    );

    setAnuncio(
      `Tarefa "${tarefa.titulo}" marcada como ${status}.`
    );

    if (
      vaiConcluir &&
      tarefa.prioridade === "alta"
    ) {
      notificarLocal(
        "Boa! Tarefa de alta prioridade concluída 🎉",
        {
          body: tarefa.titulo,
        }
      );
    }
  }

  function removerTarefa(id) {
    const tarefa = tarefas.find(
      (t) => t.id === id
    );

    if (!tarefa) {
      return;
    }

    setTarefas((atual) =>
      atual.filter((t) => t.id !== id)
    );

    setAnuncio(
      `Tarefa "${tarefa.titulo}" removida.`
    );

    avisarMudancaOffline();
  }

  const tarefasFiltradas = tarefas.filter(
    (tarefa) => {
      if (filtro === "pendentes") {
        return !tarefa.concluida;
      }

      if (filtro === "concluidas") {
        return tarefa.concluida;
      }

      return true;
    }
  );

  return (
    <div className="app">
      <a
        href="#conteudo"
        className="skip-link"
      >
        Pular para o conteúdo
      </a>

      <Header />

      <StatusRede />

      <InstallPrompt />

      <NotificationPrompt />

      <div
        className="sr-only"
        role="status"
        aria-live="polite"
      >
        {anuncio}
      </div>

      <main
        id="conteudo"
        className="container"
      >
        <section className="intro">
          <h2>Minha lista de filmes</h2>

          <p>
            Organize os filmes que você quer
            assistir e acompanhe suas tarefas.
          </p>
        </section>

        <TaskForm
          onAdicionar={adicionarTarefa}
        />

        <div className="lista-header">
          <h2>
            Minhas tarefas ({tarefas.length})
          </h2>

          <div
            className="filtros"
            role="group"
            aria-label="Filtrar tarefas"
          >
            {FILTROS.map((opcao) => (
              <button
                key={opcao.valor}
                onClick={() =>
                  setFiltro(opcao.valor)
                }
                aria-pressed={
                  filtro === opcao.valor
                }
                className={
                  filtro === opcao.valor
                    ? "filtro ativo"
                    : "filtro"
                }
              >
                {opcao.rotulo}
              </button>
            ))}
          </div>
        </div>

        <section
          className="tarefas"
          aria-label="Lista de tarefas"
        >
          {tarefasFiltradas.length === 0 ? (
            <div className="vazio">
              <p>
                Nenhuma tarefa encontrada.
              </p>
            </div>
          ) : (
            tarefasFiltradas.map((tarefa) => (
              <TaskCard
                key={tarefa.id}
                titulo={tarefa.titulo}
                categoria={tarefa.categoria}
                prioridade={tarefa.prioridade}
                concluida={tarefa.concluida}
                onToggle={() =>
                  alternarConcluida(tarefa.id)
                }
                onRemover={() =>
                  removerTarefa(tarefa.id)
                }
              />
            ))
          )}
        </section>
      </main>

      <footer className="footer">
        MovieBox — Projeto SA03
      </footer>
    </div>
  );
}

export default App;