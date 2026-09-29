import { useState } from "react";

function TaskForm({ onAdicionar }) {
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("Filmes");
  const [prioridade, setPrioridade] = useState("media");

  function aoEnviar(evento) {
    evento.preventDefault();

    if (titulo.trim() === "") {
      return;
    }

    onAdicionar({
      titulo: titulo.trim(),
      categoria,
      prioridade,
    });

    setTitulo("");
  }

  return (
    <form
      className="formulario"
      onSubmit={aoEnviar}
    >

      <div className="campo titulo">

        <label htmlFor="campo-titulo">
          Nova tarefa
        </label>

        <input
          id="campo-titulo"
          type="text"
          value={titulo}
          onChange={(e) =>
            setTitulo(e.target.value)
          }
          placeholder="O que precisa ser feito?"
        />

      </div>

      <div className="campo">

        <label htmlFor="campo-categoria">
          Categoria
        </label>

        <select
          id="campo-categoria"
          value={categoria}
          onChange={(e) =>
            setCategoria(e.target.value)
          }
        >
          <option>Filmes</option>
          <option>Séries</option>
          <option>Estudos</option>
          <option>Pessoal</option>
        </select>

      </div>

      <div className="campo">

        <label htmlFor="campo-prioridade">
          Prioridade
        </label>

        <select
          id="campo-prioridade"
          value={prioridade}
          onChange={(e) =>
            setPrioridade(e.target.value)
          }
        >
          <option value="alta">
            Alta
          </option>

          <option value="media">
            Média
          </option>

          <option value="baixa">
            Baixa
          </option>
        </select>

      </div>

      <button
        className="botao-adicionar"
        type="submit"
      >
        + Adicionar
      </button>

    </form>
  );
}

export default TaskForm;