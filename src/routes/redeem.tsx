import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/redeem")({
  head: () => ({
    meta: [
      { title: "Canjear código — DakuBot" },
      {
        name: "description",
        content: "Canjea tu código promocional por una licencia.",
      },
    ],
  }),
  component: RedeemPage,
});

type RedeemResult = {
  message?: string;
  licencia: string;
  expiresAt: string | null;
};

function RedeemPage() {
  return (
    <Layout>
      <RedeemForm />
    </Layout>
  );
}

function RedeemForm() {
  const [code, setCode] = useState("");
  const [pcId, setPcId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RedeemResult | null>(null);
  const [copied, setCopied] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("https://api.bnotifier.es/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, pc_id: pcId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.message || `Error ${res.status}`);
      } else {
        setResult(data);
      }
    } catch {
      setError("No se pudo contactar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  async function copyLicense() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.licencia);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Si el navegador bloquea el portapapeles, no pasa nada grave.
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center">
        <span className="mono-label">Canjear código</span>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
          Tu <span className="text-primary">licencia</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Introduce tu código promocional y tu PC ID para generar una licencia
          al instante.
        </p>
      </div>

      {result ? (
        <div className="surface-card mt-8 p-6 text-center md:p-8">
          <div className="mono-label text-primary">LICENCIA GENERADA</div>
          <div className="mt-3 break-all rounded-lg border border-border bg-surface-2/50 p-4 font-mono text-lg font-semibold">
            {result.licencia}
          </div>
          <button
            type="button"
            onClick={copyLicense}
            className="btn-primary mt-4 w-full justify-center hover:[&]:btn-primary-hover"
          >
            {copied ? "¡Copiada!" : "Copiar licencia"}
          </button>
          <p className="mono-label mt-4 text-muted-foreground">
            {result.expiresAt
              ? `Caduca: ${new Date(result.expiresAt).toLocaleString()}`
              : "Licencia permanente"}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Guárdala ahora — no podrás volver a verla desde aquí.
          </p>
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
              <label htmlFor="code" className="mono-label mb-2 block">
                Código promocional
              </label>
              <input
                id="code"
                type="text"
                required
                autoComplete="off"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="field focus:[&]:field-focus"
                placeholder="PROMO2026"
              />
            </div>
            <div>
              <label htmlFor="pcid" className="mono-label mb-2 block">
                PC ID
              </label>
              <input
                id="pcid"
                type="text"
                required
                autoComplete="off"
                value={pcId}
                onChange={(e) => setPcId(e.target.value)}
                className="field focus:[&]:field-focus"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !code.trim() || !pcId.trim()}
              className="btn-primary w-full justify-center hover:[&]:btn-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Canjeando…" : "Canjear código"}
              {!loading && <span aria-hidden>→</span>}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
