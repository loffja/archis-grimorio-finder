import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  component: Index,
});

type Stats = {
  archimonstrosHoy: number;
  licenciasActivas: number;
  masBuscado: { name: string } | null;
};

function Index() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("https://api.bnotifier.es/stats")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) setStats(data);
      })
      .catch(() => {
        // Si falla, simplemente no se muestra la fila de estadísticas.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Layout noScroll align="start">
      <div className="relative w-full max-w-2xl">
        {/* Adorno decorativo de fondo — no ocupa espacio en el layout */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="text-center">
          <div className="flex flex-col items-center gap-2">
            <span className="badge-dot">
              <span className="live-dot" aria-hidden="true" /> {t("home_liveBadge")}
            </span>
          </div>
          <h1
            className="mx-auto mt-4 max-w-xl text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl"
            style={{ textWrap: "balance" }}
          >
            {t("home_titlePart1")} <span className="text-gradient">{t("home_titleHighlight")}</span>{" "}
            {t("home_titlePart2")}
          </h1>
          <p className="mx-auto mt-3 min-h-[2.6rem] max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
            <strong className="text-foreground">DakuBot</strong> {t("home_desc")}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/join"
              className="btn-primary hover:[&]:btn-primary-hover"
            >
              {t("home_enterButton")}
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              to="/how-it-works"
              className="mono-label rounded-lg border border-primary/40 px-4 py-2.5 text-primary transition-colors hover:border-primary hover:bg-primary/10"
            >
              {t("home_howItWorks")}
            </Link>
          </div>

          {stats && (
            <div className="mono-label mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[0.65rem] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="live-dot" aria-hidden="true" />
                {t("home_statsToday", { count: stats.archimonstrosHoy })}
              </span>
              <span className="hidden h-3 w-px bg-border sm:block" aria-hidden="true" />
              <span className="text-primary">
                {t("home_statsLicenses", { count: stats.licenciasActivas })}
              </span>
            </div>
          )}
        </div>

        <div className="surface-card relative mt-6 overflow-hidden border-primary/60 p-6 text-center shadow-[0_0_40px_-12px_rgba(255,45,135,0.35)] md:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
          <div className="relative">
            <div className="mono-label text-primary">{t("home_fromLabel")}</div>
            <div className="font-display text-4xl font-semibold text-primary md:text-5xl">
              $6 USD<span className="text-base font-normal text-muted-foreground">{t("home_perDay")}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("home_monthlyBestPrice")}
            </p>
            <div className="mt-4 flex flex-col items-center gap-1">
              <Link
                to="/price"
                className="mono-label inline-flex items-center gap-1 text-primary transition-colors hover:text-primary/70"
              >
                {t("home_seeAllPlans")}
              </Link>
              <Link
                to="/how-it-works"
                className="mono-label inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-primary"
              >
                {t("home_seeFullGuide")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
