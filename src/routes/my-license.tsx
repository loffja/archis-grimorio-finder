import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useLanguage, type Lang } from "@/lib/i18n";

export const Route = createFileRoute("/my-license")({
  head: () => ({
    meta: [
      { title: "Mi licencia — DakuBot" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MyLicensePage,
});

type LicenseInfo = {
  expiresAt: string | null;
  expired: boolean;
  referralCode?: string;
};

const REMAINING_UNITS: Record<Lang, { d: string; h: string; min: string }> = {
  es: { d: "d", h: "h", min: "min" },
  fr: { d: "j", h: "h", min: "min" },
  en: { d: "d", h: "h", min: "min" },
};

function formatRemaining(msRemaining: number, lang: Lang): string {
  const u = REMAINING_UNITS[lang];
  if (msRemaining <= 0) return "0" + u.min;
  const totalSeconds = Math.floor(msRemaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (days > 0) return `${days}${u.d} ${hours}${u.h}`;
  if (hours > 0) return `${hours}${u.h} ${minutes}${u.min}`;
  return `${minutes}${u.min}`;
}

function MyLicensePage() {
  const { t, lang } = useLanguage();
  const [licencia, setLicencia] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<LicenseInfo | null>(null);
  const [copied, setCopied] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setInfo(null);
    try {
      const res = await fetch("https://api.bnotifier.es/licencia/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licencia }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.message || `Error ${res.status}`);
      } else {
        setInfo(data);
      }
    } catch {
      setError(t("couldNotContactServer"));
    } finally {
      setLoading(false);
    }
  }

  async function copyReferral() {
    if (!info?.referralCode) return;
    try {
      await navigator.clipboard.writeText(info.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Si el navegador bloquea el portapapeles, no pasa nada grave.
    }
  }

  const expiresAtMs = info?.expiresAt ? new Date(info.expiresAt).getTime() : null;

  return (
    <Layout align="start">
      <div className="w-full max-w-md">
        <div className="text-center">
          <span className="mono-label">{t("myLicense_label")}</span>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
            {t("myLicense_titlePart1")} <span className="text-primary">{t("myLicense_titleHighlight")}</span>
          </h1>
          <p className="mx-auto mt-3 min-h-[2.5rem] max-w-sm text-sm text-muted-foreground">
            {t("myLicense_desc")}
          </p>
        </div>

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
              {loading ? t("myLicense_checking") : t("myLicense_checkButton")}
              {!loading && <span aria-hidden>→</span>}
            </button>
          </form>

          {info && (
            <div className="mt-6 space-y-4 border-t border-border pt-6">
              <div className="text-center">
                <div className="mono-label">{t("myLicense_statusLabel")}</div>
                <div className="mt-1.5 font-mono text-sm">
                  {!info.expiresAt ? (
                    <span className="text-muted-foreground">{t("permanentLabel")}</span>
                  ) : info.expired ? (
                    <span className="text-destructive">{t("myLicense_expired")}</span>
                  ) : (
                    <span className="text-primary">
                      {t("myLicense_expiresIn")} {formatRemaining(expiresAtMs! - Date.now(), lang)}
                    </span>
                  )}
                </div>
              </div>

              {info.referralCode && (
                <div className="text-center">
                  <div className="mono-label text-primary">{t("myLicense_yourReferralCode")}</div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("myLicense_shareIt")}
                  </p>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <span className="rounded-lg border border-border bg-surface-2/50 px-3 py-1.5 font-mono text-sm">
                      {info.referralCode}
                    </span>
                    <button
                      type="button"
                      onClick={copyReferral}
                      className="mono-label rounded-lg border border-border px-3 py-1.5 text-[0.7rem] transition-colors hover:border-primary/60 hover:text-primary"
                    >
                      {copied ? t("myLicense_copied") : t("myLicense_copyButton")}
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
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
