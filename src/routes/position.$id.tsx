import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/position/$id")({
  head: () => ({
    meta: [
      { title: "Revela la posición — Archis Touch" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PositionPage,
});

type RevealResult = {
  message?: string;
  position: string;
  server: string;
  name: string;
};

function PositionPage() {
  const { id } = Route.useParams();
  const [licencia, setLicencia] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RevealResult | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("https://api.bnotifier.es/validateLicencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licencia, archimonsterId: id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.message || data?.error || `Error ${res.status}`);
      } else {
        setResult(data);
      }
    } catch {
      setError("No se pudo contactar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="w-full max-w-md">
        <div className="text-center">
          <span className="badge-dot font-mono">
            <span className="live-dot" /> ARCHIMONSTER · #{id}
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
            Revela la <span className="text-primary">posición</span>
          </h1>
        </div>

        {result ? (
          <div className="surface-card animate-reveal mt-8 overflow-hidden">
            <div className="relative aspect-square w-full overflow-hidden bg-surface-2">
              <img
                src={`https://raw.githubusercontent.com/Gianxaje/kkkal/main/img/${id}.png`}
                alt={result.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="mono-label text-primary">TARGET LOCATED</div>
                <div className="mt-1 font-display text-3xl font-semibold">{result.name}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 divide-x divide-border border-t border-border">
              <div className="p-5">
                <div className="mono-label">Servidor</div>
                <div className="mt-1.5 font-display text-lg font-semibold">{result.server}</div>
              </div>
              <div className="p-5">
                <div className="mono-label">Posición</div>
                <div className="mt-1.5 font-mono text-lg font-semibold text-primary">{result.position}</div>
              </div>
            </div>
            {result.message && (
              <div className="border-t border-border p-4 text-center text-sm text-muted-foreground">
                {result.message}
              </div>
            )}
          </div>
        ) : (
          <div className="surface-card mt-8 p-6 md:p-8">
            {error && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm"
              >
                <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-destructive" />
                <span>{error}</span>
              </div>
            )}
            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label htmlFor="licencia" className="mono-label mb-2 block">
                  Clave de licencia
                </label>
                <input
                  id="licencia"
                  type="text"
                  required
                  autoComplete="off"
                  value={licencia}
                  onChange={(e) => setLicencia(e.target.value)}
                  className="field focus:[&]:field-focus"
                  placeholder="XXXX-XXXX-XXXX"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !licencia.trim()}
                className="btn-primary w-full justify-center hover:[&]:btn-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Revelando…" : "Revelar posición"}
                {!loading && <span aria-hidden>→</span>}
              </button>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
}
