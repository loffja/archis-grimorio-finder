import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

function LogoMark({ className = "" }: { className?: string }) {
  return (
    <img
      src="/dakubot-icon.png"
      alt="DakuBot"
      className={className}
      width={64}
      height={64}
    />
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
      <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-10">
        <Link to="/" className="flex items-center gap-2.5">
          <LogoMark className="h-9 w-9" />
          <div className="leading-none">
            <div className="font-display text-base font-semibold tracking-tight">
              Daku<span className="text-primary">Bot</span>
            </div>
            <div className="mono-label mt-0.5 text-[0.55rem]">Dofus Touch · Archimonster Tracker</div>
          </div>
        </Link>
        <span className="badge-dot hidden sm:inline-flex">
          <span className="live-dot" /> LIVE · v1.0
        </span>
      </header>
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8 md:px-8">
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
