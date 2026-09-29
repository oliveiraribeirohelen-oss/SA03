import { useEffect, useState } from "react";

function Relogio() {
  const [hora, setHora] = useState(
    new Date().toLocaleTimeString()
  );

  useEffect(() => {
    const intervalo = setInterval(() => {
      setHora(
        new Date().toLocaleTimeString()
      );
    }, 1000);

    return () => {
      clearInterval(intervalo);
    };
  }, []);

  return (
    <span className="relogio">
      {hora}
    </span>
  );
}

export default Relogio;