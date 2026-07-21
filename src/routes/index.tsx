import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { t } = useLanguage();
  return (
    <Layout noScroll>
      <div className="w-full max-w-2xl">
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
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
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
        </div>

        <div className="surface-card relative mt-8 overflow-hidden border-primary/40 p-6 text-center md:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
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
