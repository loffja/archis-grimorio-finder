import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/position/$id")({
  head: () => ({
    meta: [
      { title: "Revela la posición — Archis Touch" },
      { name: "description", content: "Revela la posición del archimonstruo con tu clave de licencia." },
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
      <div className="w-full max-w-xl">
        <p className="text-center font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Archimonstruo #{id}
        </p>
        <h1 className="mt-3 text-center text-4xl text-foreground md:text-5xl">
          Revela la <span className="italic text-primary">posición</span>
        </h1>
        <div className="mx-auto my-6 h-px w-16 bg-primary/60" />

        {result ? (
          <div className="parchment-card animate-reveal overflow-hidden p-8 text-center">
            <div className="mx-auto mb-6 aspect-square w-48 overflow-hidden border border-border">
              <img
                src={`https://raw.githubusercontent.com/Gianxaje/kkkal/main/img/${id}.png`}
                alt={result.name}
                className="h-full w-full object-cover"
              />
            </div>
            <h2 className="text-3xl italic text-primary">{result.name}</h2>
            <dl className="mt-6 grid grid-cols-1 gap-3 text-left">
              <div className="flex justify-between border-b border-border/60 pb-2">
                <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Servidor</dt>
                <dd className="font-mono text-sm text-foreground">{result.server}</dd>
              </div>
              <div className="flex justify-between border-b border-border/60 pb-2">
                <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Posición</dt>
                <dd className="font-mono text-sm text-foreground">{result.position}</dd>
              </div>
            </dl>
            {result.message && (
              <p className="mt-6 text-sm italic text-muted-foreground">{result.message}</p>
            )}
          </div>
        ) : (
          <div className="parchment-card p-8 md:p-10">
            {error && (
              <div
                role="alert"
                className="mb-6 border border-destructive/60 bg-destructive/15 px-4 py-3 text-sm text-foreground"
                style={{ color: "#f2e9da" }}
              >
                {error}
              </div>
            )}
            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="licencia"
                  className="mb-2 block font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground"
                >
                  Clave de licencia
                </label>
                <input
                  id="licencia"
                  type="text"
                  required
                  autoComplete="off"
                  value={licencia}
                  onChange={(e) => setLicencia(e.target.value)}
                  className="w-full border border-border bg-background/60 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary"
                  placeholder="XXXX-XXXX-XXXX"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !licencia.trim()}
                className="gold-btn w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Revelando…" : "Revelar posición"}
              </button>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
}
