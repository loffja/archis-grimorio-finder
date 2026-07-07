import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ServerStatusBadge } from "./ServerStatusBadge";

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

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      {/* Skip link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-primary-foreground"
      >
        Saltar al contenido
      </a>
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" aria-hidden="true" />
      <header className="relative z-10 flex items-center justify-between px-6 py-3 md:px-10">
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
            <div className="mono-label mt-0.5 text-[0.55rem]">Dofus Touch · Archimonster Tracker</div>
          </div>
        </Link>
        <ServerStatusBadge />
      </header>
      <main id="main-content" className="relative z-10 flex flex-1 items-start justify-center px-4 py-4 md:items-center md:px-8 md:py-6">
        {children}
      </main>
      <footer className="relative z-10 border-t border-border/60 py-6 text-center">
        <p className="font-mono text-xs text-muted-foreground">
          © DakuBot {new Date().getFullYear()} — Rastreador para Dofus Touch.
        </p>
      </footer>
    </div>
  );
}
