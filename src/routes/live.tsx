import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
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

type Stats = {
  archimonstrosHoy: number;
  licenciasActivas: number;
  masBuscado: { id: number; name: string; usos: number } | null;
};

// Espacios visibles en la cuadrícula. Al aparecer uno nuevo y no caber más,
// el más antiguo se cae de la vista (aunque siga activo en la base de datos
// hasta que se cumplan sus 30 minutos reales).
const MAX_VISIBLE = 12;
// Refresco de respaldo, solo por si la conexión en tiempo real se corta y
// tarda en reconectar. Lo normal es que los nuevos lleguen al instante.
const FALLBACK_REFRESH_MS = 120_000;
const STATS_REFRESH_MS = 60_000;

// Se muestra SOLO cuando todavía no hay archimonstruos reales activos (es
// decir, mientras el bot no esté corriendo de verdad). En cuanto llegue el
// primer dato real, este bloque deja de mostrarse solo — no hay que
// desactivarlo a mano.
const DEMO_ITEMS = [
  { id: 2544, name: "Archimonstruo de ejemplo", server: "Blair" },
  { id: 2389, name: "Archimonstruo de ejemplo", server: "Blair" },
  { id: 2400, name: "Archimonstruo de ejemplo", server: "Blair" },
  { id: 2416, name: "Archimonstruo de ejemplo", server: "Blair" },
  { id: 2461, name: "Archimonstruo de ejemplo", server: "Blair" },
  { id: 2494, name: "Archimonstruo de ejemplo", server: "Blair" },
].map((a) => ({
  ...a,
  imageUrl: `https://raw.githubusercontent.com/Gianxaje/kkkal/main/imgBLUR/${a.id}.png`,
}));

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
  const [live, setLive] = useState(false);
  const itemsRef = useRef<ArchimonstruoActivo[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  function mergeSorted(list: ArchimonstruoActivo[]) {
    const sorted = [...list].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    const limited = sorted.slice(0, MAX_VISIBLE);
    itemsRef.current = limited;
    setItems(limited);
  }

  async function loadInitial() {
    try {
      const res = await fetch("https://api.bnotifier.es/archimonstruos");
      const data = await res.json().catch(() => []);
      if (!res.ok) {
        setError(`Error ${res.status}`);
      } else {
        setError(null);
        mergeSorted(Array.isArray(data) ? data : []);
      }
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const tickId = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tickId);
  }, []);

  useEffect(() => {
    loadInitial();
    const fallbackId = setInterval(loadInitial, FALLBACK_REFRESH_MS);
    return () => clearInterval(fallbackId);
  }, []);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("https://api.bnotifier.es/stats");
        const data = await res.json().catch(() => null);
        if (res.ok && data) setStats(data);
      } catch {
        // Si falla, simplemente no se muestra el bloque de stats.
      }
    }
    loadStats();
    const statsId = setInterval(loadStats, STATS_REFRESH_MS);
    return () => clearInterval(statsId);
  }, []);

  useEffect(() => {
    const source = new EventSource("https://api.bnotifier.es/events");

    source.onopen = () => setLive(true);
    source.onerror = () => setLive(false);

    source.onmessage = (event) => {
      try {
        const incoming: ArchimonstruoActivo = JSON.parse(event.data);
        const withoutDuplicate = itemsRef.current.filter((a) => a.id !== incoming.id);
        mergeSorted([incoming, ...withoutDuplicate]);
      } catch {
        // Mensaje no reconocido, se ignora.
      }
    };

    return () => source.close();
  }, []);

  return (
    <div className="w-full max-w-5xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="mono-label flex items-center gap-2">
            <span className={live ? "live-dot" : "live-dot opacity-30"} aria-hidden="true" />
            {live ? "En vivo" : "Conectando…"}
          </span>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            Archimonstruos activos
          </h1>
          <p className="mt-2 max-w-prose text-sm text-muted-foreground">
            Aparecen aquí al instante en cuanto se registran. Toca uno para
            introducir tu licencia y revelar su posición exacta.
          </p>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-3 gap-3">
          <div className="surface-card px-4 py-3 text-center">
            <div className="mono-label">Hoy</div>
            <div className="mt-1 font-display text-2xl font-semibold">{stats.archimonstrosHoy}</div>
          </div>
          <div className="surface-card px-4 py-3 text-center">
            <div className="mono-label">Licencias activas</div>
            <div className="mt-1 font-display text-2xl font-semibold text-primary">
              {stats.licenciasActivas}
            </div>
          </div>
          <div className="surface-card px-4 py-3 text-center">
            <div className="mono-label">Más buscado</div>
            <div className="mt-1 truncate font-display text-lg font-semibold">
              {stats.masBuscado ? stats.masBuscado.name : "—"}
            </div>
          </div>
        </div>
      )}

      {loading && (
        <p className="py-10 text-center text-muted-foreground">Cargando…</p>
      )}

      {!loading && error && (
        <p className="py-10 text-center text-destructive">{error}</p>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="space-y-5">
          <div className="surface-card border-primary/30 px-5 py-4 text-center">
            <span className="mono-label text-primary">🔧 Vista previa</span>
            <p className="mt-1 text-sm text-muted-foreground">
              Así se ve LIVE cuando el bot está activo. Los archimonstruos de abajo son de ejemplo
              — toca cualquiera para ver los precios.
            </p>
          </div>
          <ul
            role="list"
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
          >
            {DEMO_ITEMS.map((a) => (
              <li key={a.id}>
                <Link
                  to="/price"
                  className="group relative flex flex-col items-center gap-3 rounded-xl border border-border bg-surface-2/40 p-4 text-center transition-colors hover:border-primary/60 hover:bg-surface-2 focus-visible:border-primary focus-visible:outline-none"
                >
                  <span className="mono-label absolute right-2 top-2 rounded-full border border-primary/50 bg-background/80 px-2 py-0.5 text-[0.55rem] text-primary">
                    DEMO
                  </span>
                  <img
                    src={a.imageUrl}
                    alt=""
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
                    Ver precios →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
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
