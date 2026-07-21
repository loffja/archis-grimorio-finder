import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useLanguage } from "@/lib/i18n";

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
  const { t } = useLanguage();
  const [code, setCode] = useState("");
  const [pcId, setPcId] = useState("");
  const [website, setWebsite] = useState(""); // honeypot — debe quedar vacío
  const [referralCode, setReferralCode] = useState("");
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
        body: JSON.stringify({ code, pc_id: pcId, website, referralCode: referralCode.trim() || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.message || `Error ${res.status}`);
      } else {
        setResult(data);
      }
    } catch {
      setError(t("couldNotContactServer"));
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
        <span className="mono-label">{t("redeem_label")}</span>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
          {t("redeem_titlePart1")} <span className="text-primary">{t("redeem_titleHighlight")}</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("redeem_desc")}
        </p>
      </div>

      {result ? (
        <div className="surface-card mt-8 p-6 text-center md:p-8">
          <div className="mono-label text-primary">{t("redeem_generatedLabel")}</div>
          <div className="mt-3 break-all rounded-lg border border-border bg-surface-2/50 p-4 font-mono text-lg font-semibold">
            {result.licencia}
          </div>
          <button
            type="button"
            onClick={copyLicense}
            className="btn-primary mt-4 w-full justify-center hover:[&]:btn-primary-hover"
          >
            {copied ? t("redeem_copied") : t("redeem_copyButton")}
          </button>
          <p className="mono-label mt-4 text-muted-foreground">
            {result.expiresAt
              ? `${t("redeem_expiresLabel")}: ${new Date(result.expiresAt).toLocaleString()}`
              : t("permanentLabel")}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            {t("redeem_saveNowWarning")}
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
            {/* Honeypot: invisible y sin foco para humanos; los bots
                automatizados suelen rellenarlo igualmente. */}
            <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden">
              <label htmlFor="website">No rellenar este campo</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="code" className="mono-label mb-2 block">
                {t("redeem_promoCodeLabel")}
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
            <div>
              <label htmlFor="referralcode" className="mono-label mb-2 block">
                {t("referralCodeLabel")}
              </label>
              <input
                id="referralcode"
                type="text"
                autoComplete="off"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder="REF-XXXXXX"
                className="field focus:[&]:field-focus"
              />
              <p className="mono-label mt-2 text-muted-foreground">
                {t("redeem_referralHint")}
              </p>
            </div>
            <button
              type="submit"
              disabled={loading || !code.trim() || !pcId.trim()}
              className="btn-primary w-full justify-center hover:[&]:btn-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? t("redeem_redeeming") : t("redeem_redeemButton")}
              {!loading && <span aria-hidden>→</span>}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
