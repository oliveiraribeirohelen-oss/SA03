import { useState, useEffect } from "react";

import {
  suportaNotificacoes,
  ativarNotificacoes,
  notificarLocal,
} from "../notifications";

function NotificationPrompt() {
  const [permissao, setPermissao] = useState(
    suportaNotificacoes()
      ? Notification.permission
      : "unsupported"
  );

  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (permissao === "granted") {
      ativarNotificacoes().catch((erro) =>
        console.warn("Inscrição de push adiada:", erro)
      );
    }
  }, [permissao]);

  async function handleAtivar() {
    setCarregando(true);

    const resultado = await ativarNotificacoes();

    setPermissao(Notification.permission);
    setCarregando(false);

    if (resultado.ok) {
      await notificarLocal("MovieBox", {
        body:
          "Notificações ativadas! Vamos te avisar sobre tarefas importantes.",
      });
    }
  }

  if (
    permissao === "unsupported" ||
    permissao === "denied"
  ) {
    return null;
  }

  if (permissao === "granted") {
    return (
      <div className="notification-area">
        <div className="notification-card notification-active">
          <div className="notification-icon">
            🔔
          </div>

          <div className="notification-content">
            <h3>Notificações ativadas</h3>

            <p>
              O MovieBox pode avisar você sobre
              tarefas importantes.
            </p>
          </div>

          <button
            onClick={() =>
              notificarLocal("MovieBox", {
                body:
                  "Esta é uma notificação de teste 🚀",
              })
            }
            className="notification-button"
          >
            🔔 Testar notificação
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-area">
      <div className="notification-card">
        <div className="notification-icon">
          🎬
        </div>

        <div className="notification-content">
          <h3>Receba avisos do MovieBox</h3>

          <p>
            Seja avisado quando uma tarefa importante
            for concluída.
          </p>
        </div>

        <button
          onClick={handleAtivar}
          disabled={carregando}
          className="notification-button"
        >
          {carregando
            ? "Ativando..."
            : "🔔 Ativar notificações"}
        </button>
      </div>
    </div>
  );
}

export default NotificationPrompt;