import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      <rect x="2" y="2" width="28" height="28" rx="8" fill="var(--color-primary)" fillOpacity="0.12" />
      <rect x="2" y="2" width="28" height="28" rx="8" stroke="var(--color-primary)" strokeOpacity="0.35" />
      <path
        d="M10 22 L16 8 L22 22 M12.5 17 H19.5"
        stroke="var(--color-primary)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
      <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-10">
        <Link to="/" className="flex items-center gap-2.5">
          <LogoMark className="h-8 w-8" />
          <div className="leading-none">
            <div className="font-display text-base font-semibold tracking-tight">
              Archis<span className="text-primary">.</span>Touch
            </div>
            <div className="mono-label mt-0.5 text-[0.55rem]">Archimonster Tracker</div>
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
          © Archis Touch {new Date().getFullYear()} — All rights reserved.
        </p>
      </footer>
    </div>
  );
}
