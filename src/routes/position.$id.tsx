import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { useLanguage, type Lang } from "@/lib/i18n";
import { translateArchmonsterName } from "@/lib/archmonster-names";
import { handleMonsterImgError } from "@/lib/monster-image";

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
  date?: string;
  licenseExpiresAt?: string | null;
  referralCode?: string;
};

const AGO_PREFIX: Record<Lang, string> = { es: "hace", fr: "il y a", en: "" };
const AGO_SUFFIX: Record<Lang, string> = { es: "", fr: "", en: "ago" };
const UNITS: Record<Lang, { d: string; h: string; min: string; s: string }> = {
  es: { d: "d", h: "h", min: "min", s: "s" },
  fr: { d: "j", h: "h", min: "min", s: "s" },
  en: { d: "d", h: "h", min: "min", s: "s" },
};

function formatElapsed(msSince: number, lang: Lang): string {
  const totalSeconds = Math.max(0, Math.floor(msSince / 1000));
  const u = UNITS[lang];
  let core: string;
  if (totalSeconds < 60) {
    core = `${totalSeconds}${u.s}`;
  } else {
    const totalMinutes = Math.floor(totalSeconds / 60);
    if (totalMinutes < 60) {
      core = `${totalMinutes} ${u.min}`;
    } else {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      core = `${hours}${u.h} ${minutes}${u.min}`;
    }
  }
  const prefix = AGO_PREFIX[lang];
  const suffix = AGO_SUFFIX[lang];
  return [prefix, core, suffix].filter(Boolean).join(" ");
}

function formatRemaining(msRemaining: number, lang: Lang): string {
  const u = UNITS[lang];
  if (msRemaining <= 0) return `0${u.s}`;
  const totalSeconds = Math.floor(msRemaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) return `${days}${u.d} ${hours}${u.h} ${minutes}${u.min}`;
  if (hours > 0) return `${hours}${u.h} ${minutes}${u.min} ${seconds}${u.s}`;
  if (minutes > 0) return `${minutes}${u.min} ${seconds}${u.s}`;
  return `${seconds}${u.s}`;
}

function PositionPage() {
  const { t, lang } = useLanguage();
  const { id } = Route.useParams();
  const [licencia, setLicencia] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RevealResult | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [referralCopied, setReferralCopied] = useState(false);

  // Para que "hace X min" y la cuenta atrás de la licencia sigan
  // actualizándose solas mientras el usuario mira la página.
  useEffect(() => {
    if (!result) return;
    const tickId = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tickId);
  }, [result]);

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
      setError(t("couldNotContactServer"));
    } finally {
      setLoading(false);
    }
  }

  const appearedAt = result?.date ? new Date(result.date).getTime() : null;
  const licenseExpiresAt = result?.licenseExpiresAt
    ? new Date(result.licenseExpiresAt).getTime()
    : null;

  return (
    <Layout align="start">
      <div className="w-full max-w-md">
        <div className="text-center">
          <span className="badge-dot font-mono">
            <span className="live-dot" /> ARCHIMONSTER · #{id}
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
            {t("position_titlePart1")} <span className="text-primary">{t("position_titleHighlight")}</span>
          </h1>
        </div>

        {result ? (
          <div className="surface-card animate-reveal mt-8 overflow-hidden">
            <div className="relative aspect-square w-full overflow-hidden bg-surface-2">
              <img
                src={`https://raw.githubusercontent.com/Gianxaje/kkkal/main/img/${id}.png`}
                alt={result.name}
                onError={handleMonsterImgError}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="mono-label text-primary">{t("position_targetLocated")}</div>
                <div className="mt-1 font-display text-3xl font-semibold">{translateArchmonsterName(id, result.name, lang)}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 divide-x divide-border border-t border-border">
              <div className="p-5">
                <div className="mono-label">{t("position_serverLabel")}</div>
                <div className="mt-1.5 font-display text-lg font-semibold">{result.server}</div>
              </div>
              <div className="p-5">
                <div className="mono-label">{t("position_positionLabel")}</div>
                <div className="mt-1.5 font-mono text-lg font-semibold text-primary">{result.position}</div>
              </div>
            </div>
            {appearedAt && (
              <div className="border-t border-border p-5 text-center">
                <div className="mono-label">{t("position_appearedLabel")}</div>
                <div className="mt-1.5 font-mono text-sm text-muted-foreground">
                  {formatElapsed(now - appearedAt, lang)} · {new Date(appearedAt).toLocaleString()}
                </div>
              </div>
            )}
            <div className="border-t border-border p-5 text-center">
              <div className="mono-label flex items-center justify-center gap-2">
                <span className="live-dot" aria-hidden="true" />
                {t("position_yourLicense")}
              </div>
              <div className="mt-1.5 font-mono text-sm">
                {licenseExpiresAt ? (
                  <span className={now >= licenseExpiresAt ? "text-destructive" : "text-primary"}>
                    {now >= licenseExpiresAt
                      ? t("myLicense_expired")
                      : `${t("myLicense_expiresIn")} ${formatRemaining(licenseExpiresAt - now, lang)}`}
                  </span>
                ) : (
                  <span className="text-muted-foreground">{t("permanentLabel")}</span>
                )}
              </div>
            </div>
            {result.referralCode && (
              <div className="border-t border-border p-5 text-center">
                <div className="mono-label text-primary">{t("position_inviteAndEarn")}</div>
                <p className="mt-1 text-xs text-muted-foreground">
                 {t("position_shareCodeHint")}
                </p>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <span className="rounded-lg border border-border bg-surface-2/50 px-3 py-1.5 font-mono text-sm">
                    {result.referralCode}
                  </span>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(result.referralCode!);
                        setReferralCopied(true);
                        setTimeout(() => setReferralCopied(false), 2000);
                      } catch {
                        // Si el navegador bloquea el portapapeles, no pasa nada grave.
                      }
                    }}
                    className="mono-label rounded-lg border border-border px-3 py-1.5 text-[0.7rem] transition-colors hover:border-primary/60 hover:text-primary"
                  >
                    {referralCopied ? t("myLicense_copied") : t("myLicense_copyButton")}
                  </button>
                </div>
                <Link
                  to="/referral"
                  className="mono-label mt-3 inline-block text-muted-foreground transition-colors hover:text-primary"
                >
                  {t("myLicense_howItWorks")}
                </Link>
              </div>
            )}
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
                  {t("myLicense_keyLabel")}
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
                {loading ? t("position_revealing") : t("position_revealButton")}
                {!loading && <span aria-hidden>→</span>}
              </button>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
}
