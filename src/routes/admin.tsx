import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useEffect, useRef, useState, useCallback } from "react";
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

type ArchimonstruoActivo = {
  id: number;
  name: string;
  server: string;
  position: string;
  date: string;
  imageUrl: string;
};

type PromoCodeItem = {
  code: string;
  durationValue: number | null;
  durationUnit: string | null;
  maxUses: number;
  uses: number;
  active: boolean;
  date?: string;
};

type AuditEntry = {
  action: string;
  details?: Record<string, unknown>;
  date: string;
};

type AdminKeyItem = {
  _id: string;
  name: string;
  key: string;
  active: boolean;
  date?: string;
};

const ACTION_LABELS: Record<string, string> = {
  licencia_creada: "Licencia creada",
  licencia_eliminada: "Licencia eliminada",
  licencia_extendida: "Licencia extendida",
  codigo_creado: "Código promocional creado",
  codigo_eliminado: "Código promocional eliminado",
  ajustes_actualizados: "Interruptor cambiado",
  admin_creado: "Administrador añadido",
  admin_revocado: "Administrador revocado",
  referido_recompensado: "Referido premiado (+2 días)",
};

function formatAuditDetails(entry: AuditEntry): string {
  const d = entry.details || {};
  const by = d.by ? ` · por ${d.by}` : "";
  switch (entry.action) {
    case "licencia_creada":
      return `${d.licencia ?? "?"} · PC ID: ${d.pc_id ?? "?"}${by}`;
    case "licencia_eliminada":
      return `${d.licencia ?? "?"}${by}`;
    case "licencia_extendida":
      return `${d.licencia ?? "?"} · nueva caducidad: ${
        d.expiresAt ? new Date(d.expiresAt as string).toLocaleString() : "?"
      }${by}`;
    case "codigo_creado":
      return `${d.code ?? "?"} · máx. ${d.maxUses ?? "?"} usos${by}`;
    case "codigo_eliminado":
      return `${d.code ?? "?"}${by}`;
    case "admin_creado":
    case "admin_revocado":
      return `${d.name ?? "?"}${by}`;
    case "referido_recompensado":
      return `${d.referrerPcId ?? "?"} referido por: ${d.nuevoPcId ?? "?"} · código ${d.referralCode ?? "?"}`;
    case "ajustes_actualizados":
      return (
        Object.entries(d)
          .filter(([k]) => k !== "by")
          .map(([k, v]) => `${k}: ${v ? "activo" : "desactivado"}`)
          .join(", ") + by
      );
    default:
      return JSON.stringify(d);
  }
}

const STORAGE_KEY = "admin-key";

function generateLicenseKey(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sin caracteres ambiguos (0/O, 1/I)
  const group = () =>
    Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `${group()}-${group()}-${group()}`;
}

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
  const [searchQuery, setSearchQuery] = useState("");
  const [durationValue, setDurationValue] = useState("");
  const [referralCodeInput, setReferralCodeInput] = useState("");
  const [durationUnit, setDurationUnit] = useState<DurationUnit>("days");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [extendingLicencia, setExtendingLicencia] = useState<string | null>(null);
  const [extendValue, setExtendValue] = useState("");
  const [extendUnit, setExtendUnit] = useState<DurationUnit>("days");
  const [submittingExtend, setSubmittingExtend] = useState(false);

  const [archimonstruos, setArchimonstruos] = useState<ArchimonstruoActivo[]>([]);
  const [loadingArchis, setLoadingArchis] = useState(true);
  const [archisError, setArchisError] = useState<string | null>(null);
  const [archisLive, setArchisLive] = useState(false);
  const archisRef = useRef<ArchimonstruoActivo[]>([]);

  const [promoCodes, setPromoCodes] = useState<PromoCodeItem[]>([]);
  const [loadingPromos, setLoadingPromos] = useState(true);
  const [promosError, setPromosError] = useState<string | null>(null);
  const [newCode, setNewCode] = useState("");
  const [promoDurationValue, setPromoDurationValue] = useState("");
  const [promoDurationUnit, setPromoDurationUnit] = useState<DurationUnit>("days");
  const [maxUses, setMaxUses] = useState("1");
  const [promoSubmitting, setPromoSubmitting] = useState(false);
  const [promoFeedback, setPromoFeedback] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [deletingCode, setDeletingCode] = useState<string | null>(null);

  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [loadingAudit, setLoadingAudit] = useState(true);
  const [auditError, setAuditError] = useState<string | null>(null);

  const [settings, setSettings] = useState<{ redeemEnabled: boolean; validateEnabled: boolean } | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [savingSettings, setSavingSettings] = useState<string | null>(null);

  const [adminKeys, setAdminKeys] = useState<AdminKeyItem[]>([]);
  const [loadingAdminKeys, setLoadingAdminKeys] = useState(true);
  const [adminKeysError, setAdminKeysError] = useState<string | null>(null);
  const [isPrimaryAdmin, setIsPrimaryAdmin] = useState(true);
  const [newAdminName, setNewAdminName] = useState("");
  const [creatingAdminKey, setCreatingAdminKey] = useState(false);
  const [revokingAdminKey, setRevokingAdminKey] = useState<string | null>(null);
  const [lastCreatedKey, setLastCreatedKey] = useState<string | null>(null);

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

  const loadArchimonstruos = useCallback(async () => {
    setLoadingArchis(true);
    setArchisError(null);
    try {
      const res = await fetch("https://api.bnotifier.es/admin/archimonstruos", {
        headers: authHeaders(),
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      const data = await res.json().catch(() => []);
      if (!res.ok) {
        setArchisError(`Error ${res.status}`);
      } else {
        const list: ArchimonstruoActivo[] = Array.isArray(data) ? data : [];
        const sorted = [...list].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        archisRef.current = sorted;
        setArchimonstruos(sorted);
      }
    } catch {
      setArchisError("No se pudo cargar la lista.");
    } finally {
      setLoadingArchis(false);
    }
  }, [authHeaders, onUnauthorized]);

  useEffect(() => {
    loadArchimonstruos();
    // Respaldo por si la conexión en tiempo real se corta un rato.
    const fallbackId = setInterval(loadArchimonstruos, 120000);
    return () => clearInterval(fallbackId);
  }, [loadArchimonstruos]);

  // Conexión en tiempo real: el backend empuja cada archimonstruo nuevo
  // (con posición) apenas se registra, mientras el panel esté abierto.
  useEffect(() => {
    const source = new EventSource(
      `https://api.bnotifier.es/admin/events?key=${encodeURIComponent(adminKey)}`,
    );

    source.onopen = () => setArchisLive(true);
    source.onerror = () => setArchisLive(false);

    source.onmessage = (event) => {
      try {
        const incoming: ArchimonstruoActivo = JSON.parse(event.data);
        const withoutDuplicate = archisRef.current.filter((a) => a.id !== incoming.id);
        const merged = [incoming, ...withoutDuplicate].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        archisRef.current = merged;
        setArchimonstruos(merged);
      } catch {
        // Mensaje no reconocido, se ignora.
      }
    };

    return () => source.close();
  }, [adminKey]);

  const loadPromoCodes = useCallback(async () => {
    setLoadingPromos(true);
    setPromosError(null);
    try {
      const res = await fetch("https://api.bnotifier.es/admin/promocodes", {
        headers: authHeaders(),
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      const data = await res.json().catch(() => []);
      if (!res.ok) setPromosError(`Error ${res.status}`);
      else setPromoCodes(Array.isArray(data) ? data : []);
    } catch {
      setPromosError("No se pudo cargar la lista.");
    } finally {
      setLoadingPromos(false);
    }
  }, [authHeaders, onUnauthorized]);

  useEffect(() => {
    loadPromoCodes();
  }, [loadPromoCodes]);

  const loadAuditLog = useCallback(async () => {
    setLoadingAudit(true);
    setAuditError(null);
    try {
      const res = await fetch("https://api.bnotifier.es/admin/audit-log", {
        headers: authHeaders(),
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      const data = await res.json().catch(() => []);
      if (!res.ok) setAuditError(`Error ${res.status}`);
      else setAuditLog(Array.isArray(data) ? data : []);
    } catch {
      setAuditError("No se pudo cargar el registro.");
    } finally {
      setLoadingAudit(false);
    }
  }, [authHeaders, onUnauthorized]);

  useEffect(() => {
    loadAuditLog();
  }, [loadAuditLog]);

  const loadSettings = useCallback(async () => {
    setLoadingSettings(true);
    try {
      const res = await fetch("https://api.bnotifier.es/admin/settings", {
        headers: authHeaders(),
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      const data = await res.json().catch(() => null);
      if (res.ok && data) setSettings(data);
    } catch {
      // Si falla, los interruptores simplemente no se muestran.
    } finally {
      setLoadingSettings(false);
    }
  }, [authHeaders, onUnauthorized]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  async function toggleSetting(key: "redeemEnabled" | "validateEnabled") {
    if (!settings) return;
    const nextValue = !settings[key];
    setSavingSettings(key);
    try {
      const res = await fetch("https://api.bnotifier.es/admin/settings", {
        method: "PUT",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ [key]: nextValue }),
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      const data = await res.json().catch(() => null);
      if (res.ok && data) {
        setSettings(data);
        loadAuditLog();
      }
    } catch {
      // Si falla, el interruptor simplemente no cambia visualmente.
    } finally {
      setSavingSettings(null);
    }
  }

  const loadAdminKeys = useCallback(async () => {
    setLoadingAdminKeys(true);
    setAdminKeysError(null);
    try {
      const res = await fetch("https://api.bnotifier.es/admin/adminkeys", {
        headers: authHeaders(),
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      if (res.status === 403) {
        // No eres el admin principal: esta sección simplemente no existe para ti.
        setIsPrimaryAdmin(false);
        return;
      }
      const data = await res.json().catch(() => []);
      if (!res.ok) setAdminKeysError(`Error ${res.status}`);
      else setAdminKeys(Array.isArray(data) ? data : []);
    } catch {
      setAdminKeysError("No se pudo cargar la lista.");
    } finally {
      setLoadingAdminKeys(false);
    }
  }, [authHeaders, onUnauthorized]);

  useEffect(() => {
    loadAdminKeys();
  }, [loadAdminKeys]);

  async function onCreateAdminKey(e: React.FormEvent) {
    e.preventDefault();
    if (!newAdminName.trim()) return;
    setCreatingAdminKey(true);
    setLastCreatedKey(null);
    try {
      const res = await fetch("https://api.bnotifier.es/admin/adminkeys", {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ name: newAdminName.trim() }),
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      const data = await res.json().catch(() => null);
      if (res.ok && data) {
        setLastCreatedKey(data.key);
        setNewAdminName("");
        loadAdminKeys();
        loadAuditLog();
      }
    } catch {
      // Si falla, simplemente no se crea nada visible.
    } finally {
      setCreatingAdminKey(false);
    }
  }

  async function revokeAdminKey(id: string) {
    const confirmed = window.confirm("¿Revocar el acceso de este administrador?");
    if (!confirmed) return;

    setRevokingAdminKey(id);
    try {
      const res = await fetch(`https://api.bnotifier.es/admin/adminkeys/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      if (res.ok) {
        setAdminKeys((prev) => prev.filter((k) => k._id !== id));
        loadAuditLog();
      }
    } catch {
      // Si falla, la lista simplemente no cambia.
    } finally {
      setRevokingAdminKey(null);
    }
  }

  async function onCreatePromo(e: React.FormEvent) {
    e.preventDefault();
    setPromoSubmitting(true);
    setPromoFeedback(null);
    try {
      const body: Record<string, unknown> = {
        code: newCode.trim(),
        maxUses: Number(maxUses) || 1,
      };
      const trimmedDuration = promoDurationValue.trim();
      if (trimmedDuration !== "") {
        body.durationValue = Number(trimmedDuration);
        body.durationUnit = promoDurationUnit;
      }
      const res = await fetch("https://api.bnotifier.es/admin/promocodes", {
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
        setPromoFeedback({ type: "err", text: data?.message || `Error ${res.status}` });
      } else {
        setPromoFeedback({ type: "ok", text: data?.message || "Código creado." });
        setNewCode("");
        setPromoDurationValue("");
        setMaxUses("1");
        loadPromoCodes();
        loadAuditLog();
      }
    } catch {
      setPromoFeedback({ type: "err", text: "No se pudo contactar con el servidor." });
    } finally {
      setPromoSubmitting(false);
    }
  }

  async function handleDeletePromo(code: string) {
    const confirmed = window.confirm(`¿Eliminar el código "${code}"?`);
    if (!confirmed) return;

    setDeletingCode(code);
    try {
      const res = await fetch(
        `https://api.bnotifier.es/admin/promocodes/${encodeURIComponent(code)}`,
        { method: "DELETE", headers: authHeaders() },
      );
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setPromoFeedback({ type: "err", text: data?.message || `Error ${res.status}` });
      } else {
        setPromoCodes((prev) => prev.filter((p) => p.code !== code));
        setPromoFeedback({ type: "ok", text: data?.message || "Código eliminado." });
        loadAuditLog();
      }
    } catch {
      setPromoFeedback({ type: "err", text: "No se pudo contactar con el servidor." });
    } finally {
      setDeletingCode(null);
    }
  }

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
      if (referralCodeInput.trim() !== "") {
        body.referralCode = referralCodeInput.trim();
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
        setReferralCodeInput("");
        loadLicencias();
        loadAuditLog();
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
        loadAuditLog();
      }
    } catch {
      setFeedback({ type: "err", text: "No se pudo contactar con el servidor." });
    } finally {
      setDeletingKey(null);
    }
  }

  async function handleExtend(licencia: string) {
    const value = extendValue.trim();
    if (!value) return;

    setSubmittingExtend(true);
    try {
      const res = await fetch(
        `https://api.bnotifier.es/licencias/${encodeURIComponent(licencia)}/extend`,
        {
          method: "PUT",
          headers: authHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify({ durationValue: Number(value), durationUnit: extendUnit }),
        },
      );
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFeedback({ type: "err", text: data?.message || `Error ${res.status}` });
      } else {
        setFeedback({ type: "ok", text: data?.message || "Licencia extendida." });
        setExtendingLicencia(null);
        setExtendValue("");
        loadLicencias();
        loadAuditLog();
      }
    } catch {
      setFeedback({ type: "err", text: "No se pudo contactar con el servidor." });
    } finally {
      setSubmittingExtend(false);
    }
  }

  const totalUses = licencias.reduce(
    (sum, l) => sum + (Array.isArray(l.usedFor) ? l.usedFor.length : 0),
    0,
  );

  const filteredLicencias = licencias.filter((l) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return l.pc_id.toLowerCase().includes(q) || l.licencia.toLowerCase().includes(q);
  });

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

      {!loadingSettings && settings && (
        <section
          aria-labelledby="killswitch-heading"
          className="surface-card border-destructive/30 p-5"
        >
          <h2 id="killswitch-heading" className="mono-label text-destructive">
            ⚠ Interruptor de emergencia
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Desactiva estas funciones al instante para todo el mundo, sin tocar código.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border border-border bg-surface-2/40 px-4 py-3">
              <div>
                <div className="font-mono text-sm">Canjear códigos</div>
                <div className="mono-label text-[0.65rem] text-muted-foreground">/redeem</div>
              </div>
              <button
                type="button"
                onClick={() => toggleSetting("redeemEnabled")}
                disabled={savingSettings === "redeemEnabled"}
                className={
                  "mono-label rounded-full px-3 py-1 text-[0.7rem] transition-colors disabled:opacity-50 " +
                  (settings.redeemEnabled
                    ? "border border-[color:var(--success)]/50 text-[color:var(--success)]"
                    : "border border-destructive/50 text-destructive")
                }
              >
                {savingSettings === "redeemEnabled" ? "…" : settings.redeemEnabled ? "Activo" : "Desactivado"}
              </button>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border bg-surface-2/40 px-4 py-3">
              <div>
                <div className="font-mono text-sm">Revelar posiciones</div>
                <div className="mono-label text-[0.65rem] text-muted-foreground">/position/:id</div>
              </div>
              <button
                type="button"
                onClick={() => toggleSetting("validateEnabled")}
                disabled={savingSettings === "validateEnabled"}
                className={
                  "mono-label rounded-full px-3 py-1 text-[0.7rem] transition-colors disabled:opacity-50 " +
                  (settings.validateEnabled
                    ? "border border-[color:var(--success)]/50 text-[color:var(--success)]"
                    : "border border-destructive/50 text-destructive")
                }
              >
                {savingSettings === "validateEnabled" ? "…" : settings.validateEnabled ? "Activo" : "Desactivado"}
              </button>
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="licenses-heading" className="surface-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <h2 id="licenses-heading" className="font-display text-lg font-semibold">
            Registered licenses
          </h2>
          <div className="flex items-center gap-3">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por PC ID o licencia…"
              aria-label="Buscar licencias"
              className="field focus:[&]:field-focus h-8 w-48 text-sm"
            />
            <button
              onClick={loadLicencias}
              className="mono-label rounded transition-colors hover:text-primary focus-visible:text-primary"
            >
              ↻ Recargar
            </button>
          </div>
        </div>
        {loading ? (
          <p className="py-10 text-center text-muted-foreground">Cargando…</p>
        ) : loadError ? (
          <p className="py-10 text-center text-destructive">{loadError}</p>
        ) : licencias.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground">Sin licencias.</p>
        ) : filteredLicencias.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground">
            Ninguna licencia coincide con "{searchQuery}".
          </p>
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
                {filteredLicencias.map((l, i) => {
                  const created = l.createdAt || l.created_at;
                  const uses = Array.isArray(l.usedFor) ? l.usedFor.length : 0;
                  const expiresAt = l.expiresAt ?? null;
                  const expiresDate = expiresAt ? new Date(expiresAt) : null;
                  const isExpired = expiresDate ? expiresDate.getTime() <= Date.now() : false;
                  return (
                    <Fragment key={i}>
                    <tr
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
                        <div className="flex items-center justify-end gap-3">
                          {expiresDate && (
                            <button
                              type="button"
                              onClick={() => {
                                setExtendingLicencia(
                                  extendingLicencia === l.licencia ? null : l.licencia,
                                );
                                setExtendValue("");
                              }}
                              className="mono-label rounded text-primary transition-colors hover:text-primary/70"
                            >
                              Extender
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDelete(l.licencia)}
                            disabled={deletingKey === l.licencia}
                            className="mono-label rounded text-destructive transition-colors hover:text-destructive/70 disabled:opacity-50"
                          >
                            {deletingKey === l.licencia ? "…" : "Eliminar"}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {extendingLicencia === l.licencia && (
                      <tr className="border-b border-border/60 bg-surface-2/30">
                        <td colSpan={6} className="px-5 py-4">
                          <div className="flex flex-wrap items-end gap-3">
                            <div>
                              <label className="mono-label mb-2 block">Añadir</label>
                              <input
                                type="number"
                                min="1"
                                autoFocus
                                value={extendValue}
                                onChange={(e) => setExtendValue(e.target.value)}
                                placeholder="Ej. 7"
                                className="field focus:[&]:field-focus w-28"
                              />
                            </div>
                            <div>
                              <label className="mono-label mb-2 block">Unidad</label>
                              <select
                                value={extendUnit}
                                onChange={(e) => setExtendUnit(e.target.value as DurationUnit)}
                                className="field focus:[&]:field-focus"
                              >
                                <option value="minutes">Minutos</option>
                                <option value="hours">Horas</option>
                                <option value="days">Días</option>
                                <option value="weeks">Semanas</option>
                                <option value="months">Meses</option>
                              </select>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleExtend(l.licencia)}
                              disabled={submittingExtend || !extendValue.trim()}
                              className="btn-primary hover:[&]:btn-primary-hover disabled:opacity-50"
                            >
                              {submittingExtend ? "…" : "Confirmar →"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setExtendingLicencia(null)}
                              className="mono-label rounded text-muted-foreground transition-colors hover:text-primary"
                            >
                              Cancelar
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                    </Fragment>
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
            <div className="flex gap-2">
              <input
                id="newlic"
                required
                value={newLic}
                onChange={(e) => setNewLic(e.target.value)}
                className="field focus:[&]:field-focus flex-1"
              />
              <button
                type="button"
                onClick={() => setNewLic(generateLicenseKey())}
                className="mono-label rounded border border-border px-3 text-[0.7rem] transition-colors hover:border-primary/60 hover:text-primary"
              >
                Generar
              </button>
            </div>
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
          <div>
            <label htmlFor="referral-input" className="mono-label mb-2 block">
              Código de referido (opcional)
            </label>
            <input
              id="referral-input"
              value={referralCodeInput}
              onChange={(e) => setReferralCodeInput(e.target.value)}
              placeholder="REF-XXXXXX"
              className="field focus:[&]:field-focus"
            />
            <p className="mono-label mt-2 text-muted-foreground">
              Si te dijo quién lo invitó, ponlo aquí — le suma +2 días a esa licencia.
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

      <section aria-labelledby="archis-heading" className="surface-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 id="archis-heading" className="font-display text-lg font-semibold flex items-center gap-2">
            Archimonstruos activos
            <span
              className={archisLive ? "live-dot" : "live-dot opacity-30"}
              aria-hidden="true"
              title={archisLive ? "En vivo" : "Conectando…"}
            />
          </h2>
          <button
            onClick={loadArchimonstruos}
            className="mono-label rounded transition-colors hover:text-primary focus-visible:text-primary"
          >
            ↻ Recargar
          </button>
        </div>
        {loadingArchis ? (
          <p className="py-10 text-center text-muted-foreground">Cargando…</p>
        ) : archisError ? (
          <p className="py-10 text-center text-destructive">{archisError}</p>
        ) : archimonstruos.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground">
            No hay archimonstruos activos ahora mismo.
          </p>
        ) : (
          <ul role="list" className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-3 md:grid-cols-4">
            {archimonstruos.map((a) => (
              <li
                key={a.id}
                className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface-2/40 p-4 text-center"
              >
                <img
                  src={a.imageUrl}
                  alt={a.name}
                  loading="lazy"
                  className="h-16 w-16 rounded-lg object-contain"
                />
                <span className="font-display text-sm font-semibold leading-tight">{a.name}</span>
                <span className="mono-label text-[0.65rem] text-muted-foreground">{a.server}</span>
                <span className="font-mono text-sm text-primary">{a.position}</span>
                <span className="mono-label text-[0.6rem] text-muted-foreground">
                  {a.date ? new Date(a.date).toLocaleString() : "—"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="promo-heading" className="surface-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 id="promo-heading" className="font-display text-lg font-semibold">
            Códigos promocionales
          </h2>
          <button
            onClick={loadPromoCodes}
            className="mono-label rounded transition-colors hover:text-primary focus-visible:text-primary"
          >
            ↻ Recargar
          </button>
        </div>
        {loadingPromos ? (
          <p className="py-10 text-center text-muted-foreground">Cargando…</p>
        ) : promosError ? (
          <p className="py-10 text-center text-destructive">{promosError}</p>
        ) : promoCodes.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground">Sin códigos todavía.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Lista de códigos promocionales</caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="mono-label px-5 py-3 font-normal">Código</th>
                  <th scope="col" className="mono-label px-5 py-3 font-normal">Duración</th>
                  <th scope="col" className="mono-label px-5 py-3 font-normal">Usos</th>
                  <th scope="col" className="mono-label px-5 py-3 font-normal">Estado</th>
                  <th scope="col" className="mono-label px-5 py-3 font-normal"></th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {promoCodes.map((p) => (
                  <tr
                    key={p.code}
                    className="border-b border-border/60 last:border-0 hover:bg-surface-2/50"
                  >
                    <td className="px-5 py-3.5 text-primary">{p.code}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {p.durationValue && p.durationUnit
                        ? `${p.durationValue} ${p.durationUnit}`
                        : "Permanente"}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="badge-dot">{p.uses}/{p.maxUses}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={p.active ? "text-primary" : "text-muted-foreground"}>
                        {p.active ? "Activo" : "Agotado"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeletePromo(p.code)}
                        disabled={deletingCode === p.code}
                        className="mono-label rounded text-destructive transition-colors hover:text-destructive/70 disabled:opacity-50"
                      >
                        {deletingCode === p.code ? "…" : "Eliminar"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="border-t border-border p-6 md:p-8">
          <h3 className="font-display text-base font-semibold">Crear código nuevo</h3>
          {promoFeedback && (
            <div
              role="alert"
              className={
                "mt-4 flex items-start gap-3 rounded-lg border px-4 py-3 text-sm " +
                (promoFeedback.type === "ok"
                  ? "border-[color:var(--success)]/40 bg-[color:var(--success)]/10"
                  : "border-destructive/40 bg-destructive/10")
              }
              style={promoFeedback.type === "ok" ? { color: "var(--success)" } : undefined}
            >
              <span
                aria-hidden="true"
                className="mt-0.5 h-2 w-2 shrink-0 rounded-full"
                style={{ background: promoFeedback.type === "ok" ? "var(--success)" : "var(--destructive)" }}
              />
              <span className={promoFeedback.type === "err" ? "text-foreground" : ""}>
                {promoFeedback.text}
              </span>
            </div>
          )}
          <form onSubmit={onCreatePromo} className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="promocode" className="mono-label mb-2 block">
                Código
              </label>
              <input
                id="promocode"
                required
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="PROMO2026"
                className="field focus:[&]:field-focus"
              />
            </div>
            <div>
              <label htmlFor="maxuses" className="mono-label mb-2 block">
                Usos máximos
              </label>
              <input
                id="maxuses"
                type="number"
                min="1"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                className="field focus:[&]:field-focus"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="promoduration" className="mono-label mb-2 block">
                Duración de la licencia (opcional — vacío = permanente)
              </label>
              <div className="flex gap-2">
                <input
                  id="promoduration"
                  type="number"
                  min="1"
                  placeholder="Ej. 7"
                  value={promoDurationValue}
                  onChange={(e) => setPromoDurationValue(e.target.value)}
                  className="field focus:[&]:field-focus flex-1"
                />
                <select
                  aria-label="Unidad de duración del código"
                  value={promoDurationUnit}
                  onChange={(e) => setPromoDurationUnit(e.target.value as DurationUnit)}
                  className="field focus:[&]:field-focus"
                >
                  <option value="minutes">Minutos</option>
                  <option value="hours">Horas</option>
                  <option value="days">Días</option>
                  <option value="weeks">Semanas</option>
                  <option value="months">Meses</option>
                </select>
              </div>
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={promoSubmitting}
                className="btn-primary w-full justify-center hover:[&]:btn-primary-hover disabled:opacity-50 md:w-auto"
              >
                {promoSubmitting ? "…" : "Crear código →"}
              </button>
            </div>
          </form>
        </div>
      </section>

      <section aria-labelledby="audit-heading" className="surface-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 id="audit-heading" className="font-display text-lg font-semibold">
            Registro de actividad
          </h2>
          <button
            onClick={loadAuditLog}
            className="mono-label rounded transition-colors hover:text-primary focus-visible:text-primary"
          >
            ↻ Recargar
          </button>
        </div>
        {loadingAudit ? (
          <p className="py-10 text-center text-muted-foreground">Cargando…</p>
        ) : auditError ? (
          <p className="py-10 text-center text-destructive">{auditError}</p>
        ) : auditLog.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground">Sin actividad todavía.</p>
        ) : (
          <ul role="list" className="max-h-96 divide-y divide-border/60 overflow-y-auto">
            {auditLog.map((entry, i) => (
              <li key={i} className="flex items-center justify-between gap-3 px-5 py-3">
                <div>
                  <span className="font-mono text-sm">
                    {ACTION_LABELS[entry.action] || entry.action}
                  </span>
                  <div className="mono-label mt-0.5 text-[0.65rem] text-muted-foreground">
                    {formatAuditDetails(entry)}
                  </div>
                </div>
                <span className="mono-label shrink-0 text-[0.65rem] text-muted-foreground">
                  {new Date(entry.date).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="admins-heading" className="surface-card overflow-hidden" hidden={!isPrimaryAdmin}>
        {isPrimaryAdmin && (
          <>
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 id="admins-heading" className="font-display text-lg font-semibold">
            Administradores
          </h2>
          <button
            onClick={loadAdminKeys}
            className="mono-label rounded transition-colors hover:text-primary focus-visible:text-primary"
          >
            ↻ Recargar
          </button>
        </div>
        {loadingAdminKeys ? (
          <p className="py-10 text-center text-muted-foreground">Cargando…</p>
        ) : adminKeysError ? (
          <p className="py-10 text-center text-destructive">{adminKeysError}</p>
        ) : adminKeys.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground">
            Solo tú (con la clave maestra) tienes acceso por ahora.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Lista de administradores adicionales</caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="mono-label px-5 py-3 font-normal">Nombre</th>
                  <th scope="col" className="mono-label px-5 py-3 font-normal">Creado</th>
                  <th scope="col" className="mono-label px-5 py-3 font-normal"></th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {adminKeys.map((k) => (
                  <tr key={k._id} className="border-b border-border/60 last:border-0 hover:bg-surface-2/50">
                    <td className="px-5 py-3.5">{k.name}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {k.date ? new Date(k.date).toLocaleString() : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => revokeAdminKey(k._id)}
                        disabled={revokingAdminKey === k._id}
                        className="mono-label rounded text-destructive transition-colors hover:text-destructive/70 disabled:opacity-50"
                      >
                        {revokingAdminKey === k._id ? "…" : "Revocar"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="border-t border-border p-6 md:p-8">
          <h3 className="font-display text-base font-semibold">Añadir administrador</h3>
          {lastCreatedKey && (
            <div className="mt-4 rounded-lg border border-[color:var(--success)]/40 bg-[color:var(--success)]/10 p-4">
              <div className="mono-label" style={{ color: "var(--success)" }}>
                Clave generada — cópiala ahora, no se volverá a mostrar
              </div>
              <div className="mt-2 break-all rounded border border-border bg-surface-2/50 p-3 font-mono text-sm">
                {lastCreatedKey}
              </div>
            </div>
          )}
          <form onSubmit={onCreateAdminKey} className="mt-5 flex flex-wrap items-end gap-3">
            <div className="flex-1">
              <label htmlFor="adminname" className="mono-label mb-2 block">
                Nombre
              </label>
              <input
                id="adminname"
                required
                value={newAdminName}
                onChange={(e) => setNewAdminName(e.target.value)}
                placeholder="Ej. Alex"
                className="field focus:[&]:field-focus"
              />
            </div>
            <button
              type="submit"
              disabled={creatingAdminKey}
              className="btn-primary hover:[&]:btn-primary-hover disabled:opacity-50"
            >
              {creatingAdminKey ? "…" : "Crear →"}
            </button>
          </form>
        </div>
          </>
        )}
      </section>
    </div>
  );
}
