import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ServerStatusBadge } from "./ServerStatusBadge";
import { SystemStatus } from "./SystemStatus";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "@/lib/i18n";

function LogoMark({ className = "" }: { className?: string }) {
  return (
    <img
      src="/dakubot-icon.png"
      alt=""
      className={className}
      width={64}
      height={64}
    />
  );
}

function useNavLinks() {
  const { t } = useLanguage();
  return [
    { to: "/live", label: t("navLive") },
    { to: "/price", label: t("navPricing") },
    { to: "/join", label: t("navDiscord") },
    { to: "/redeem", label: t("navRedeem") },
    { to: "/referral", label: t("navReferral") },
    { to: "/my-license", label: t("navMyLicense") },
  ] as const;
}

function NavMenu() {
  const navLinks = useNavLinks();
  return (
    <nav aria-label="Principal" className="flex flex-wrap items-center justify-end gap-x-5 gap-y-1">
      {navLinks.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="mono-label text-muted-foreground transition-colors hover:text-primary focus-visible:text-primary"
          activeProps={{ className: "text-primary" }}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  return (
    <div className="relative flex min-h-dvh flex-col">
      {/* Skip link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-primary-foreground"
      >
        {t("skipToContent")}
      </a>
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" aria-hidden="true" />
      <header className="relative z-10 flex flex-wrap items-center justify-between gap-4 px-6 py-3 md:px-10">
        <Link
          to="/"
          className="flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="DakuBot · Inicio"
        >
          <LogoMark className="h-9 w-9" />
          <div className="leading-none">
            <div className="font-display text-base font-semibold tracking-tight">
              Daku<span className="text-primary">Bot</span>
            </div>
            <div className="mono-label mt-0.5 text-[0.55rem]">{t("headerTagline")}</div>
          </div>
        </Link>
        <div className="flex items-center gap-5">
          <NavMenu />
          <LanguageSwitcher />
          <ServerStatusBadge />
        </div>
      </header>
      <main id="main-content" className="relative z-10 flex flex-1 items-start justify-center px-4 py-4 md:items-center md:px-8 md:py-6">
        {children}
      </main>
      <footer className="relative z-10 border-t border-border/60 py-6 text-center">
        <p className="font-mono text-xs text-muted-foreground">
          © DakuBot {new Date().getFullYear()} — {t("footerTagline")}{" "}
          <Link to="/terms" className="underline decoration-dotted underline-offset-2 hover:text-primary">
            {t("footerTerms")}
          </Link>
        </p>
        <div className="mt-2 flex items-center justify-center">
          <SystemStatus />
        </div>
      </footer>
    </div>
  );
}
