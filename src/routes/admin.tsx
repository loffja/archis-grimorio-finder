import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { DofusRuneGallery } from "@/components/DofusRuneGallery";
import { getAdminSession, logoutAdmin } from "@/lib/admin-session.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — DakuBot" },
      { name: "robots", content: "noindex" },
    ],
  }),
  loader: () => getAdminSession(),
  component: AdminPage,
});

const ERROR_MESSAGES: Record<string, string> = {
  not_authorized: "Tu cuenta de Discord no está autorizada para acceder al panel.",
  invalid_state: "La sesión OAuth expiró o es inválida. Inténtalo de nuevo.",
  missing_params: "Faltan parámetros de OAuth. Inténtalo de nuevo.",
  server_misconfigured: "El servidor no tiene configurado Discord OAuth.",
  oauth_failed: "Discord rechazó la autenticación.",
  access_denied: "Cancelaste la autorización en Discord.",
};

function AdminPage() {
  const session = Route.useLoaderData();

  if (!session.isAdmin) {
    return (
      <Layout>
        <AdminLogin />
      </Layout>
    );
  }
  return (
    <Layout>
      <AdminPanel user={session.user} />
    </Layout>
  );
}

function AdminLogin() {
  // Read ?error=... from URL
  const [errorCode, setErrorCode] = useState<string | null>(null);
  useEffect(() => {
    const u = new URL(window.location.href);
    setErrorCode(u.searchParams.get("error"));
  }, []);

  return (
    <div className="surface-card w-full max-w-sm p-8 text-center">
      <span className="badge-dot">
        <span className="live-dot" aria-hidden="true" /> Área restringida
      </span>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight">Admin access</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Autentícate con Discord. Solo cuentas autorizadas pueden entrar.
      </p>
      {errorCode && (
        <div
          role="alert"
          className="mt-5 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-left text-sm text-foreground"
        >
          {ERROR_MESSAGES[errorCode] ?? `Error: ${errorCode}`}
        </div>
      )}
      <a
        href="/api/auth/discord/login"
        className="btn-primary mt-6 w-full justify-center hover:[&]:btn-primary-hover"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
          <path d="M20.317 4.492a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.865-.608 1.25-1.844-.276-3.68-.276-5.487 0-.163-.393-.406-.875-.618-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.492a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.083.083 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.077.077 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.995a.076.076 0 0 0-.041-.106 13.098 13.098 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.834 19.834 0 0 0 6.002-3.03.077.077 0 0 0 .032-.055c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
        Entrar con Discord
      </a>
      <p className="mt-4 font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
        Solo IDs autorizados
      </p>
    </div>
  );
}

type Licencia = {
  pc_id: string;
  licencia: string;
  usedFor?: unknown[];
  createdAt?: string;
  created_at?: string;
};

function AdminPanel({
  user,
}: {
  user: { discordId: string; username: string; avatar: string | null };
}) {
  const router = useRouter();
  const doLogout = useServerFn(logoutAdmin);

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
        setPcId("");
        setNewLic("");
        loadLicencias();
      }
    } catch {
      setFeedback({ type: "err", text: "No se pudo contactar con el servidor." });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    await doLogout();
    router.invalidate();
  }

  const totalUses = licencias.reduce(
    (sum, l) => sum + (Array.isArray(l.usedFor) ? l.usedFor.length : 0),
    0,
  );

  const avatarUrl = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png?size=64`
    : null;

  return (
    <div className="w-full max-w-6xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="mono-label">Admin panel</span>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">Licencias</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="surface-card flex items-center gap-3 px-4 py-2.5">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 rounded-full border border-border"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 font-mono text-xs text-primary">
                {user.username.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="leading-tight">
              <div className="mono-label">Conectado</div>
              <div className="text-sm font-semibold">{user.username}</div>
            </div>
          </div>
          <div className="surface-card px-4 py-3">
            <div className="mono-label">Total</div>
            <div className="mt-1 font-display text-2xl font-semibold">{licencias.length}</div>
          </div>
          <div className="surface-card px-4 py-3">
            <div className="mono-label">Usos</div>
            <div className="mt-1 font-display text-2xl font-semibold text-primary">{totalUses}</div>
          </div>
          <button
            onClick={handleLogout}
            className="btn-ghost hover:border-destructive/50 hover:text-destructive"
          >
            Cerrar sesión
          </button>
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
