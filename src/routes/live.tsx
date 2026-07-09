import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/live")({
  head: () => ({
    meta: [
      { title: "En vivo — DakuBot" },
      {
        name: "description",
        content: "Archimonstruos activos ahora mismo en Dofus Touch.",
      },
    ],
  }),
  component: LivePage,
});

type ArchimonstruoActivo = {
  id: number;
  name: string;
  server: string;
  date: string;
  imageUrl: string;
};

const REFRESH_MS = 30_000;
// Espacios visibles en la cuadrícula. Al aparecer uno nuevo y no caber más,
// el más antiguo se cae de la vista (aunque siga activo en la base de datos
// hasta que se cumplan sus 30 minutos reales).
const MAX_VISIBLE = 12;

function formatElapsed(msSince: number): string {
  const totalSeconds = Math.max(0, Math.floor(msSince / 1000));
  if (totalSeconds < 60) {
    return `Apareció hace ${totalSeconds}s`;
  }
  const totalMinutes = Math.floor(totalSeconds / 60);
  if (totalMinutes < 60) {
    return `Apareció hace ${totalMinutes} min`;
  }
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `Apareció hace ${hours}h ${minutes}min`;
}

function LivePage() {
  return (
    <Layout>
      <LiveFeed />
    </Layout>
  );
}

function LiveFeed() {
  const [items, setItems] = useState<ArchimonstruoActivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  async function load() {
    try {
      const res = await fetch("https://api.bnotifier.es/archimonstruos");
      const data = await res.json().catch(() => []);
      if (!res.ok) {
        setError(`Error ${res.status}`);
      } else {
        setError(null);
        const list: ArchimonstruoActivo[] = Array.isArray(data) ? data : [];
        // Más nuevo primero, y solo los que caben en la cuadrícula.
        const sorted = [...list].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        setItems(sorted.slice(0, MAX_VISIBLE));
      }
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const refreshId = setInterval(load, REFRESH_MS);
    const tickId = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      clearInterval(refreshId);
      clearInterval(tickId);
    };
  }, []);

  return (
    <div className="w-full max-w-5xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="mono-label flex items-center gap-2">
            <span className="live-dot" aria-hidden="true" />
            En vivo
          </span>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            Archimonstruos activos
          </h1>
          <p className="mt-2 max-w-prose text-sm text-muted-foreground">
            Se actualiza solo cada 30 segundos. Toca uno para introducir tu
            licencia y revelar su posición exacta.
          </p>
        </div>
      </div>

      {loading && (
        <p className="py-10 text-center text-muted-foreground">Cargando…</p>
      )}

      {!loading && error && (
        <p className="py-10 text-center text-destructive">{error}</p>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="surface-card py-16 text-center">
          <p className="text-muted-foreground">
            No hay archimonstruos activos ahora mismo.
          </p>
          <p className="mono-label mt-2">Vuelve a mirar en un rato.</p>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <ul
          role="list"
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
        >
          {items.map((a) => {
            const registeredAt = new Date(a.date).getTime();
            const elapsedMs = now - registeredAt;

            return (
              <li key={a.id}>
                <Link
                  to="/position/$id"
                  params={{ id: String(a.id) }}
                  className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-surface-2/40 p-4 text-center transition-colors hover:border-primary/60 hover:bg-surface-2 focus-visible:border-primary focus-visible:outline-none"
                >
                  <img
                    src={a.imageUrl}
                    alt={a.name}
                    loading="lazy"
                    className="h-20 w-20 rounded-lg object-contain transition-transform group-hover:scale-105"
                  />
                  <span className="font-display text-sm font-semibold leading-tight">
                    {a.name}
                  </span>
                  <span className="mono-label text-[0.65rem] text-muted-foreground">
                    {a.server}
                  </span>
                  <span className="mono-label rounded-full border border-primary/30 px-2.5 py-0.5 text-[0.65rem] text-primary">
                    {formatElapsed(elapsedMs)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}