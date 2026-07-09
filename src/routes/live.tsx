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
      const res = await fetch("https://api.bnotifier.es/stats");
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

  // Reloj para que "Apareció hace Xs" se actualice solo, cada segundo.
  useEffect(() => {
    const tickId = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tickId);
  }, []);

  // Carga inicial + refresco de respaldo (por si SSE se cae un rato).
  useEffect(() => {
    loadInitial();
    const fallbackId = setInterval(loadInitial, FALLBACK_REFRESH_MS);
    return () => clearInterval(fallbackId);
  }, []);

  // Estadísticas públicas (archimonstruos hoy, licencias activas, más buscado).
  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("https://api.bnotifier.
