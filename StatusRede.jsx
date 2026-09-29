import { useState } from "react";

function StatusRede() {
  const [online] = useState(
    window.navigator.onLine
  );

  if (online) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-amber-100 text-amber-900 text-sm text-center py-2 font-semibold"
    >
      📡 Você está offline — mostrando os dados salvos no seu dispositivo.
    </div>
  );
}

export default StatusRede;