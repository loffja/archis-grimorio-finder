import { useState, useEffect, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
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

// Menú horizontal para escritorio (md+). En móvil se usa MobileNavMenu en su lugar.
function DesktopNavMenu() {
  const navLinks = useNavLinks();
  return (
    <nav aria-label="Principal" className="hidden items-center justify-center gap-x-5 gap-y-1 md:flex">
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

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      {open ? (
        <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      ) : (
        <>
          <path d="M2 5H16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M2 9H16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M2 13H16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

// Botón + panel desplegable con el menú, solo visible en móvil (oculto en md+).
function MobileNavMenu() {
  const navLinks = useNavLinks();
  const [open, setOpen] = useState(false);
  const routerState = useRouterState();

  // Cierra el menú solo al cambiar de página.
  useEffect(() => {
    setOpen(false);
  }, [routerState.location.pathname]);

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:border-primary/60 hover:text-primary"
      >
        <MenuIcon open={open} />
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/40"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          <nav
            aria-label="Principal"
            className="surface-card absolute right-0 top-11 z-40 flex w-48 flex-col gap-1 p-2"
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="mono-label rounded-lg px-3 py-2.5 text-muted-foreground transition-colors hover:bg-surface-2 hover:text-primary"
                activeProps={{ className: "text-primary" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </>
      )}
    </div>
  );
}

export function Layout({
  children,
  noScroll = false,
  align = "center",
}: {
  children: ReactNode;
  noScroll?: boolean;
  align?: "center" | "start";
}) {
  const { t } = useLanguage();
  return (
    <div
      className={
        "relative flex min-h-dvh flex-col" + (noScroll ? " md:h-dvh md:overflow-hidden" : "")
      }
    >
      {/* Skip link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-primary-foreground"
      >
        {t("skipToContent")}
      </a>
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" aria-hidden="true" />
      <header className="relative z-20 flex items-center gap-3 px-4 py-3 md:px-10">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="DakuBot · Inicio"
        >
          <LogoMark className="h-9 w-9 shrink-0" />
          <div className="min-w-0 leading-none">
            <div className="font-display text-base font-semibold tracking-tight">
              Daku<span className="text-primary">Bot</span>
            </div>
            <div className="mono-label mt-0.5 truncate text-[0.55rem]">{t("headerTagline")}</div>
          </div>
        </Link>
        <div className="hidden flex-1 justify-center md:flex">
          <DesktopNavMenu />
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-2 md:ml-0">
          <LanguageSwitcher />
          <MobileNavMenu />
        </div>
      </header>
      <main
        id="main-content"
        className={
          "relative z-10 flex flex-1 items-start justify-center px-4 py-4 md:px-8 md:py-6 " +
          (align === "center" ? "md:items-center" : "md:items-start md:pt-16")
        }
      >
        {children}
      </main>
      <footer className="relative z-10 border-t border-border/60 py-6 text-center">
        <p className="font-mono text-xs text-muted-foreground">
          © DakuBot {new Date().getFullYear()} — {t("footerTagline")}{" "}
          <Link to="/terms" className="underline decoration-dotted underline-offset-2 hover:text-primary">
            {t("footerTerms")}
          </Link>
          {" · "}
          <a
            href="https://discord.gg/4FRsf4uyV6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 align-middle underline decoration-dotted underline-offset-2 hover:text-primary"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 127.14 96.36"
              fill="currentColor"
              aria-hidden="true"
              className="shrink-0"
            >
              <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
            </svg>
            Discord
          </a>
        </p>
        <div className="mt-2 flex items-center justify-center">
          <SystemStatus />
        </div>
      </footer>
    </div>
  );
}
