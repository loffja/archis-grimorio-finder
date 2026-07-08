import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { DofusRuneGallery } from "@/components/DofusRuneGallery";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — DakuBot" },
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
  expiresAt?: string | null;
};

type DurationUnit = "minutes" | "hours" | "days" | "weeks" | "months";

function AdminPage() {
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
  const [durationValue, setDurationValue] = useState("");
  const [durationUnit, setDurationUnit] = useState<DurationUnit>("days");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);

  async function loadLicencias() {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch("https://api.bnotifier.es/licencias");
      const data = await res.json().catch(() => []);
      if (!res.ok) setLoadError(`Error ${res.status}`);
      else setLicencias(Array.isArray(data) ? data : data?.licencias ?? []);
    } catch {
      setLoadError("No se pudo cargar la lista.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLicencias();
  }, []);

  async function onRegister(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    try {
      const body: Record<string, unknown> = { pc_id: pcId, licencia: newLic };
      const trimmedDuration = durationValue.trim();
      if (trimmedDuration !== "") {
        body.durationValue = Number(trimmedDuration);
        body.durationUnit = durationUnit;
      }
      const res = await fetch("https://api.bnotifier.es/registerLicencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFeedback({ type: "err", text: data?.message || data?.error || `Error ${res.status}` });
      } else {
        setFeedback({ type: "ok", text: data?.message || "Licencia registrada correctamente." });
        setPcId("");
        setNewLic("");
        setDurationValue("");
        loadLicencias();
      }
    } catch {
      setFeedback({ type: "err", text: "No se pudo contactar con el servidor." });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(licencia: string) {
    const confirmed = window.confirm(
      `¿Eliminar la licencia "${licencia}"? Esta acción no se puede deshacer.`,
    );
    if (!confirmed) return;

    setDeletingKey(licencia);
    try {
      const res = await fetch(
        `https://api.bnotifier.es/licencias/${encodeURIComponent(licencia)}`,
        { method: "DELETE" },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFeedback({ type: "err", text: data?.message || `Error ${res.status}` });
      } else {
        setLicencias((prev) => prev.filter((l) => l.licencia !== licencia));
        setFeedback({ type: "ok", text: data?.message || "Licencia eliminada." });
      }
    } catch {
      setFeedback({ type: "err", text: "No se pudo contactar con el servidor." });
    } finally {
      setDeletingKey(null);
    }
  }

  const totalUses = licencias.reduce(
    (sum, l) => sum + (Array.isArray(l.usedFor) ? l.usedFor.length : 0),
    0,
  );

  return (
    <div className="w-full max-w-6xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="mono-label">Admin panel</span>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">Licencias</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="surface-card px-4 py-3">
            <div className="mono-label">Total</div>
            <div className="mt-1 font-display text-2xl font-semibold">{licencias.length}</div>
          </div>
          <div className="surface-card px-4 py-3">
            <div className="mono-label">Usos</div>
            <div className="mt-1 font-display text-2xl font-semibold text-primary">{totalUses}</div>
          </div>
        </div>
      </div>

      <DofusRuneGallery />

      <section aria-labelledby="licenses-heading" className="surface-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 id="licenses-heading" className="font-display text-lg font-semibold">
            Registered licenses
          </h2>
          <button
            onClick={loadLicencias}
            className="mono-label rounded transition-colors hover:text-primary focus-visible:text-primary"
          >
            ↻ Recargar
          </button>
        </div>
        {loading ? (
          <p className="py-10 text-center text-muted-foreground">Cargando…</p>
        ) : loadError ? (
          <p className="py-10 text-center text-destructive">{loadError}</p>
        ) : licencias.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground">Sin licencias.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Lista de licencias registradas</caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="mono-label px-5 py-3 font-normal">PC ID</th>
                  <th scope="col" className="mono-label px-5 py-3 font-normal">Licencia</th>
                  <th scope="col" className="mono-label px-5 py-3 font-normal">Usos</th>
                  <th scope="col" className="mono-label px-5 py-3 font-normal">Creación</th>
                  <th scope="col" className="mono-label px-5 py-3 font-normal"></th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {licencias.map((l, i) => {
                  const created = l.createdAt || l.created_at;
                  const uses = Array.isArray(l.usedFor) ? l.usedFor.length : 0;
                  return (
                    <tr
                      key={i}
                      className="border-b border-border/60 last:border-0 hover:bg-surface-2/50"
                    >
                      <td className="px-5 py-3.5">{l.pc_id}</td>
                      <td className="px-5 py-3.5 text-primary">{l.licencia}</td>
                      <td className="px-5 py-3.5">
                        <span className="badge-dot">{uses}</span>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">
                        {created ? new Date(created).toLocaleString() : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(l.licencia)}
                          disabled={deletingKey === l.licencia}
                          className="mono-label rounded text-destructive transition-colors hover:text-destructive/70 disabled:opacity-50"
                        >
                          {deletingKey === l.licencia ? "…" : "Eliminar"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section aria-labelledby="register-heading" className="surface-card p-6 md:p-8">
        <h2 id="register-heading" className="font-display text-lg font-semibold">
          Registrar nueva licencia
        </h2>
        {feedback && (
          <div
            role="alert"
            className={
              "mt-5 flex items-start gap-3 rounded-lg border px-4 py-3 text-sm " +
              (feedback.type === "ok"
                ? "border-[color:var(--success)]/40 bg-[color:var(--success)]/10"
                : "border-destructive/40 bg-destructive/10")
            }
            style={feedback.type === "ok" ? { color: "var(--success)" } : undefined}
          >
            <span
              aria-hidden="true"
              className="mt-0.5 h-2 w-2 shrink-0 rounded-full"
              style={{ background: feedback.type === "ok" ? "var(--success)" : "var(--destructive)" }}
            />
            <span className={feedback.type === "err" ? "text-foreground" : ""}>{feedback.text}</span>
          </div>
        )}
        <form onSubmit={onRegister} className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr_auto]">
          <div>
            <label htmlFor="pcid" className="mono-label mb-2 block">
              PC ID
            </label>
            <input
              id="pcid"
              required
              value={pcId}
              onChange={(e) => setPcId(e.target.value)}
              className="field focus:[&]:field-focus"
            />
          </div>
          <div>
            <label htmlFor="newlic" className="mono-label mb-2 block">
              Nueva licencia
            </label>
            <input
              id="newlic"
              required
              value={newLic}
              onChange={(e) => setNewLic(e.target.value)}
              className="field focus:[&]:field-focus"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full justify-center hover:[&]:btn-primary-hover disabled:opacity-50 md:w-auto"
            >
              {submitting ? "…" : "Registrar →"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
