import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  component: Index,
});

/**
 * Modern minimal radar: soft concentric rings, rotating sweep, glowing pings.
 */
function DofusRadar() {
  return (
    <div className="relative mx-auto mt-4 h-[190px] w-full max-w-2xl md:h-[240px]">
      <div className="absolute right-0 top-2 z-10 hidden md:block">
        <div className="surface-card px-3 py-2 font-mono text-[0.7rem]">
          <div className="text-muted-foreground">Jalatintanic, el Hundido</div>
          <div className="text-primary">[2,-8] · Sufokia</div>
        </div>
      </div>
      <div className="absolute -left-2 bottom-2 z-10 hidden md:block">
        <div className="surface-card px-3 py-2 font-mono text-[0.7rem]">
          <div className="text-muted-foreground">SERVIDOR</div>
          <div>Blair</div>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-float">
          <svg viewBox="0 0 400 400" className="h-[190px] w-[190px] md:h-[240px] md:w-[240px]" role="img" aria-label="Radar de archimonstruos">
            <defs>
              <radialGradient id="ring-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff2d87" stopOpacity="0.35" />
                <stop offset="70%" stopColor="#ff2d87" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#ff2d87" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="sweep" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff2d87" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#ff2d87" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="ping" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff7ab6" stopOpacity="1" />
                <stop offset="100%" stopColor="#ff2d87" stopOpacity="0" />
              </radialGradient>
              <clipPath id="radar-clip">
                <circle cx="200" cy="200" r="185" />
              </clipPath>
            </defs>

            <circle cx="200" cy="200" r="185" fill="url(#ring-glow)" />

            {[60, 105, 150, 185].map((r) => (
              <circle key={r} cx="200" cy="200" r={r} fill="none" stroke="#24242c" strokeWidth="1" />
            ))}

            <g clipPath="url(#radar-clip)">
              <line x1="15" y1="200" x2="385" y2="200" stroke="#1c1c22" strokeDasharray="2 8" />
              <line x1="200" y1="15" x2="200" y2="385" stroke="#1c1c22" strokeDasharray="2 8" />
              <g style={{ transformOrigin: "200px 200px", animation: "spin 6s linear infinite" }}>
                <path
                  d="M200,200 L385,200 A185,185 0 0,0 292.5,39.8 Z"
                  fill="url(#sweep)"
                  opacity="0.75"
                />
              </g>
            </g>

            <g>
              <circle cx="138" cy="132" r="26" fill="url(#ping)" opacity="0.9" />
              <circle cx="138" cy="132" r="4" fill="#ff2d87" />
              <circle cx="272" cy="248" r="3" fill="#ff7ab6" />
              <circle cx="248" cy="112" r="2.5" fill="#ededf0" opacity="0.55" />
              <circle cx="118" cy="272" r="2.5" fill="#ededf0" opacity="0.55" />
            </g>

            <g transform="translate(200 200)">
              <circle r="10" fill="#0a0a0b" stroke="#ff2d87" strokeWidth="1.5" />
              <circle r="2.5" fill="#ff2d87" />
            </g>
          </svg>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    </div>
  );
}

function Index() {
  const { t } = useLanguage();
  return (
    <Layout>
      <div className="w-full max-w-3xl">
        <div className="text-center">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="badge-dot">
              <span className="live-dot" aria-hidden="true" /> {t("home_liveBadge")}
            </span>
            <span className="mono-label rounded-full border border-primary/40 px-3 py-1 text-primary">
              {t("home_coverageBadge")}
            </span>
          </div>
          <h1
            className="mx-auto mt-4 max-w-2xl text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl"
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

        <DofusRadar />

        <div className="surface-card mt-5 p-5 text-center">
          <div className="mono-label">{t("home_fromLabel")}</div>
          <div className="font-display text-2xl font-semibold text-primary">
            $6 USD<span className="text-sm font-normal text-muted-foreground">{t("home_perDay")}</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("home_monthlyBestPrice")}
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
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
    </Layout>
  );
}
