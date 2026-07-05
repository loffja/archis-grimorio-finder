import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

function CompassRose({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.8"
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="34" />
      <circle cx="50" cy="50" r="24" />
      <circle cx="50" cy="50" r="2" fill="currentColor" />
      {/* Cardinal points */}
      <polygon points="50,8 46,50 50,46 54,50" fill="currentColor" fillOpacity="0.8" />
      <polygon points="50,92 46,50 50,54 54,50" fill="currentColor" fillOpacity="0.4" />
      <polygon points="8,50 50,46 46,50 50,54" fill="currentColor" fillOpacity="0.4" />
      <polygon points="92,50 50,46 54,50 50,54" fill="currentColor" fillOpacity="0.4" />
      {/* Diagonal points */}
      <polygon points="20,20 48,48 50,50 47,47" fill="currentColor" fillOpacity="0.3" />
      <polygon points="80,20 52,48 50,50 53,47" fill="currentColor" fillOpacity="0.3" />
      <polygon points="20,80 48,52 50,50 47,53" fill="currentColor" fillOpacity="0.3" />
      <polygon points="80,80 52,52 50,50 53,53" fill="currentColor" fillOpacity="0.3" />
      <text
        x="50"
        y="16"
        textAnchor="middle"
        fontSize="6"
        fill="currentColor"
        stroke="none"
        fontFamily="serif"
      >
        N
      </text>
    </svg>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex justify-center pt-8 pb-4">
        <Link to="/" className="flex flex-col items-center gap-2 text-primary">
          <CompassRose className="h-14 w-14" />
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.4em] text-muted-foreground">
            Archis · Touch
          </span>
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-8">
        {children}
      </main>
      <footer className="border-t border-border/50 py-6 text-center">
        <p className="font-mono text-xs text-muted-foreground">
          Derechos de autor © Archis Touch {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
