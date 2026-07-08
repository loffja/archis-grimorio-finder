import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { Layout } from "@/components/Layout";

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

const STORAGE_KEY = "admin-key";

function AdminPage() {
  const [adminKey, setAdminKey] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [keyInput, setKeyInput] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) setAdminKey(stored);
  }, []);

  const handleUnauthorized = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setAdminKey(null);
    setKeyInput("");
    setLoginError("Clave incorrecta.");
  }, []);

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setAdminKey(null);
    setKeyInput("");
    setLoginError(null);
  }, []);

  function onLogin(e: React.FormEvent) {
    e.preventDefault();
    const value = keyInput.trim();
    if (!value) return;
    sessionStorage.setItem(STORAGE_KEY, value);
    setAdminKey(value);
    setLoginError(null);
  }

  return (
    <Layout>
      {adminKey ? (
        <AdminPanel adminKey={adminKey} onUnauthorized={handleUnauthorized} onLogout={handleLogout} />
      ) : (
        <div className="w-full max-w-md">
          <div className="surface-card p-6 md:p-8">
            <span className="mono-label">Admin panel</span>
            <h1 className="mt-2 font-display text-2xl font-semibold">Acceso restringido</h1>
            <form onSubmit={onLogin} className="mt-6 space-y-4">
              <div>
                <label htmlFor="admin-key" className="mono-label mb-2 block">
                  Clave de administrador
                </label>
                <input
                  id="admin-key"
                  type="password"
                  autoFocus
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  className="field focus:[&]:field-focus w-full"
                />
              </div>
              {loginError && (
                <p role="alert" className="text-sm text-destructive">
                  {loginError}
                </p>
              )}
              <button type="submit" className="btn-primary w-full justify-center hover:[&]:btn-primary-hover">
                Entrar →
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

function AdminPanel({
  adminKey,
  onUnauthorized,
  onLogout,
}: {
  adminKey: string;
  onUnauthorized: () => void;
  onLogout: () => void;
}) {
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

  const authHeaders = useCallback(
    (extra?: Record<string, string>): Record<string, string> => ({
      "x-admin-key": adminKey,
      ...(extra ?? {}),
    }),
    [adminKey],
  );

  const loadLicencias = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch("https://api.bnotifier.es/licencias", {
        headers: authHeaders(),
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      const data = await res.json().catch(() => []);
      if (!res.ok) setLoadError(`Error ${res.status}`);
      else setLicencias(Array.isArray(data) ? data : data?.licencias ?? []);
    } catch {
      setLoadError("No se pudo cargar la lista.");
    } finally {
      setLoading(false);
    }
  }, [authHeaders, onUnauthorized]);

  useEffect(() => {
    loadLicencias();
  }, [loadLicencias]);

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
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(body),
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
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
        { method: "DELETE", headers: authHeaders() },
      );
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
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
          <button
            type="button"
            onClick={onLogout}
            className="mono-label rounded transition-colors hover:text-primary focus-visible:text-primary"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

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
                  <th scope="col" className="mono-label px-5 py-3 font-normal">Caduca</th>
                  <th scope="col" className="mono-label px-5 py-3 font-normal"></th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {licencias.map((l, i) => {
                  const created = l.createdAt || l.created_at;
                  const uses = Array.isArray(l.usedFor) ? l.usedFor.length : 0;
                  const expiresAt = l.expiresAt ?? null;
                  const expiresDate = expiresAt ? new Date(expiresAt) : null;
                  const isExpired = expiresDate ? expiresDate.getTime() <= Date.now() : false;
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
                      <td
                        className={
                          "px-5 py-3.5 " +
                          (expiresDate
                            ? isExpired
                              ? "text-destructive"
                              : "text-muted-foreground"
                            : "text-muted-foreground")
                        }
                      >
                        {expiresDate ? expiresDate.toLocaleString() : "Permanente"}
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
        <form onSubmit={onRegister} className="mt-5 grid gap-4 md:grid-cols-2">
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
          <div>
            <label htmlFor="duration" className="mono-label mb-2 block">
              Duración (opcional)
            </label>
            <div className="flex gap-2">
              <input
                id="duration"
                type="number"
                min="1"
                placeholder="Ej. 24"
                value={durationValue}
                onChange={(e) => setDurationValue(e.target.value)}
                className="field focus:[&]:field-focus flex-1"
              />
              <select
                aria-label="Unidad de duración"
                value={durationUnit}
                onChange={(e) => setDurationUnit(e.target.value as DurationUnit)}
                className="field focus:[&]:field-focus"
              >
                <option value="minutes">Minutos</option>
                <option value="hours">Horas</option>
                <option value="days">Días</option>
                <option value="weeks">Semanas</option>
                <option value="months">Meses</option>
              </select>
            </div>
            <p className="mono-label mt-2 text-muted-foreground">
              Vacío = licencia permanente
            </p>
          </div>
          <div className="flex items-end md:justify-end">
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
