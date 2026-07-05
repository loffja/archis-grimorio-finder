import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";

const ADMIN_PASSWORD = "archis-touch-admin";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Archis Touch" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Licencia = {
  pc_id: string;
  licencia: string;
  usedFor?: unknown[];
  createdAt?: string;
  created_at?: string;
};

function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [passError, setPassError] = useState(false);

  if (!unlocked) {
    return (
      <Layout>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (passInput === ADMIN_PASSWORD) setUnlocked(true);
            else setPassError(true);
          }}
          className="parchment-card w-full max-w-sm p-8 text-center"
        >
          <h1 className="text-3xl text-foreground">Acceso restringido</h1>
          <div className="mx-auto my-5 h-px w-16 bg-primary/60" />
          <input
            type="password"
            autoFocus
            value={passInput}
            onChange={(e) => { setPassInput(e.target.value); setPassError(false); }}
            placeholder="Contraseña"
            className="w-full border border-border bg-background/60 px-4 py-3 text-center font-mono text-sm text-foreground focus:border-primary"
          />
          {passError && (
            <p className="mt-3 text-sm text-destructive">Contraseña incorrecta.</p>
          )}
          <button type="submit" className="gold-btn mt-5 w-full">Desbloquear</button>
        </form>
      </Layout>
    );
  }

  return (
    <Layout>
      <AdminPanel />
    </Layout>
  );
}

function AdminPanel() {
  const [licencias, setLicencias] = useState<Licencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [pcId, setPcId] = useState("");
  const [newLic, setNewLic] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function loadLicencias() {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch("https://api.bnotifier.es/licencias");
      const data = await res.json().catch(() => []);
      if (!res.ok) {
        setLoadError(`Error ${res.status}`);
      } else {
        setLicencias(Array.isArray(data) ? data : data?.licencias ?? []);
      }
    } catch {
      setLoadError("No se pudo cargar la lista.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadLicencias(); }, []);

  async function onRegister(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    try {
      const res = await fetch("https://api.bnotifier.es/registerLicencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pc_id: pcId, licencia: newLic }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFeedback({ type: "err", text: data?.message || data?.error || `Error ${res.status}` });
      } else {
        setFeedback({ type: "ok", text: data?.message || "Licencia registrada correctamente." });
        setPcId(""); setNewLic("");
        loadLicencias();
      }
    } catch {
      setFeedback({ type: "err", text: "No se pudo contactar con el servidor." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-5xl space-y-8">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">Panel</p>
        <h1 className="mt-2 text-4xl text-foreground">Administración de licencias</h1>
        <div className="mx-auto my-5 h-px w-16 bg-primary/60" />
      </div>

      <section className="parchment-card p-6 md:p-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl text-primary italic">Licencias registradas</h2>
          <button onClick={loadLicencias} className="font-mono text-xs uppercase tracking-widest text-primary hover:underline">
            ↻ Recargar
          </button>
        </div>
        {loading ? (
          <p className="py-8 text-center text-muted-foreground">Cargando…</p>
        ) : loadError ? (
          <p className="py-8 text-center text-destructive">{loadError}</p>
        ) : licencias.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">Sin licencias.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 pr-4">PC ID</th>
                  <th className="py-3 pr-4">Licencia</th>
                  <th className="py-3 pr-4">Usos</th>
                  <th className="py-3">Creación</th>
                </tr>
              </thead>
              <tbody>
                {licencias.map((l, i) => {
                  const created = l.createdAt || l.created_at;
                  return (
                    <tr key={i} className="border-b border-border/50 last:border-0">
                      <td className="py-3 pr-4 text-foreground">{l.pc_id}</td>
                      <td className="py-3 pr-4 text-primary">{l.licencia}</td>
                      <td className="py-3 pr-4 text-foreground">{Array.isArray(l.usedFor) ? l.usedFor.length : 0}</td>
                      <td className="py-3 text-muted-foreground">
                        {created ? new Date(created).toLocaleString() : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="parchment-card p-6 md:p-8">
        <h2 className="mb-5 text-2xl italic text-primary">Registrar nueva licencia</h2>
        {feedback && (
          <div
            className={
              "mb-5 border px-4 py-3 text-sm " +
              (feedback.type === "ok"
                ? "border-primary/60 bg-primary/10 text-foreground"
                : "border-destructive/60 bg-destructive/15 text-foreground")
            }
          >
            {feedback.text}
          </div>
        )}
        <form onSubmit={onRegister} className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
          <div>
            <label htmlFor="pcid" className="mb-1 block font-mono text-xs uppercase tracking-wider text-muted-foreground">PC ID</label>
            <input
              id="pcid"
              required
              value={pcId}
              onChange={(e) => setPcId(e.target.value)}
              className="w-full border border-border bg-background/60 px-3 py-2 font-mono text-sm text-foreground focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="newlic" className="mb-1 block font-mono text-xs uppercase tracking-wider text-muted-foreground">Nueva licencia</label>
            <input
              id="newlic"
              required
              value={newLic}
              onChange={(e) => setNewLic(e.target.value)}
              className="w-full border border-border bg-background/60 px-3 py-2 font-mono text-sm text-foreground focus:border-primary"
            />
          </div>
          <div className="flex items-end">
            <button type="submit" disabled={submitting} className="gold-btn w-full md:w-auto disabled:opacity-50">
              {submitting ? "Registrando…" : "Registrar"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
