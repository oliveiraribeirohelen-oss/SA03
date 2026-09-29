import { useState } from "react";
import Relogio from "./Relogio";

function Header() {
  const [mostrarRelogio, setMostrarRelogio] =
    useState(true);

  return (
    <header className="header">

      <div>
        <h1>
          Movie<span>Box</span>
        </h1>

        <p>
          Organize seus filmes e tarefas
        </p>
      </div>

      <div className="header-acoes">

        {mostrarRelogio && (
          <span aria-hidden="true">
            <Relogio />
          </span>
        )}

        <button
          type="button"
          className="botao-relogio"
          onClick={() =>
            setMostrarRelogio(
              !mostrarRelogio
            )
          }
          aria-pressed={mostrarRelogio}
        >
          {mostrarRelogio
            ? "Esconder relógio"
            : "Mostrar relógio"}
        </button>

      </div>

    </header>
  );
}

export default Header;