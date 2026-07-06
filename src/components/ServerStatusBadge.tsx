import { useEffect, useState } from "react";

/**
 * Decorative "live" server-status pill. Not tied to any real API — Dofus Touch
 * does not expose one publicly. Value drifts slightly to feel alive.
 */
export function ServerStatusBadge() {
  const [ping, setPing] = useState(28);
  const [players, setPlayers] = useState(1420);

  useEffect(() => {
    const id = setInterval(() => {
      setPing((p) => Math.max(14, Math.min(52, p + (Math.random() * 8 - 4))));
      setPlayers((p) => Math.max(900, Math.min(2200, p + Math.round(Math.random() * 30 - 15))));
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Estado del servidor: en línea, ping ${Math.round(ping)} milisegundos, ${players} jugadores en línea`}
      className="hidden items-center gap-3 rounded-full border border-border bg-surface-2/60 px-3 py-1.5 font-mono text-[0.7rem] sm:inline-flex"
    >
      <span className="flex items-center gap-1.5">
        <span className="live-dot" aria-hidden="true" />
        <span className="text-muted-foreground">ONLINE</span>
      </span>
      <span className="h-3 w-px bg-border" aria-hidden="true" />
      <span className="text-primary">{Math.round(ping)}ms</span>
      <span className="h-3 w-px bg-border" aria-hidden="true" />
      <span className="text-foreground">{players.toLocaleString("es-ES")}</span>
      <span className="text-muted-foreground">jugadores</span>
    </div>
  );
}
