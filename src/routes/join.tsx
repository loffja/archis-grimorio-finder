import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Únete al servidor — Archis Touch" },
      { name: "description", content: "Únete a Discord para recibir posiciones en tiempo real." },
    ],
  }),
  component: Join,
});

function Join() {
  const { t } = useLanguage();
  return (
    <Layout>
      <div className="w-full max-w-xl">
        <div className="surface-card relative overflow-hidden p-10 text-center md:p-14">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <span className="badge-dot relative"><span className="live-dot" /> {t("join_badge")}</span>
          <h1 className="relative mt-6 text-4xl font-semibold tracking-tight md:text-5xl">
            {t("join_titlePart1")} <span className="text-primary">{t("join_titleHighlight")}</span>
          </h1>
          <p className="relative mx-auto mt-4 max-w-sm text-muted-foreground">
            {t("join_desc")}
          </p>
          <a
            href="https://discord.gg/4FRsf4uyV6"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary relative mt-8 hover:[&]:btn-primary-hover"
          >
            {t("join_button")}
            <span aria-hidden>↗</span>
          </a>
          <div className="relative mt-8 border-t border-border pt-6">
            <div className="mono-label">{t("join_inviteLink")}</div>
            <div className="mt-1 font-mono text-sm text-foreground">discord.gg/4FRsf4uyV6</div>
          </div>
        </div>

        <div className="surface-card mt-4 p-6 md:p-8">
          <h2 className="text-center font-display text-base font-semibold">
            {t("join_whatHappensTitle")}
          </h2>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <span className="mono-label mt-0.5 text-primary">01</span>
              <span>
                {t("join_step1Prefix")}{" "}
                <Link to="/price" className="text-primary underline decoration-dotted underline-offset-2">
                  PRICING
                </Link>{" "}
                {t("join_step1Suffix")}
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mono-label mt-0.5 text-primary">02</span>
              <span>
                {t("join_step2Prefix")}{" "}
                <Link to="/payment" className="text-primary underline decoration-dotted underline-offset-2">
                  {t("join_step2Link")}
                </Link>
                .
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mono-label mt-0.5 text-primary">03</span>
              <span>{t("join_step3")}</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mono-label mt-0.5 text-primary">04</span>
              <span>
                {t("join_step4Prefix")}{" "}
                <Link to="/redeem" className="text-primary underline decoration-dotted underline-offset-2">
                  REDEEM
                </Link>{" "}
                {t("join_step4Suffix")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
