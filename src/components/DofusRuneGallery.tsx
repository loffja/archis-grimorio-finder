import type { ReactNode } from "react";

/**
 * Set of Dofus-inspired SVG rune / class glyphs. Pure SVG, no external deps
 * (Fandom hotlink-blocks). Swap the `label` / add more entries freely.
 */
const RUNES: { id: string; label: string; render: () => ReactNode }[] = [
  {
    id: "iop",
    label: "Iop · Fuerza",
    render: () => (
      <>
        <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeOpacity="0.25" />
        <path d="M32 12 L44 32 L32 52 L20 32 Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
        <path d="M32 20 L32 44 M24 32 L40 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "cra",
    label: "Cra · Precisión",
    render: () => (
      <>
        <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeOpacity="0.25" />
        <circle cx="32" cy="32" r="14" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="32" cy="32" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="32" cy="32" r="2" fill="currentColor" />
        <path d="M32 10 L32 18 M32 46 L32 54 M10 32 L18 32 M46 32 L54 32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "sadida",
    label: "Sadida · Naturaleza",
    render: () => (
      <>
        <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeOpacity="0.25" />
        <path d="M32 50 C 20 40, 20 28, 32 14 C 44 28, 44 40, 32 50 Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
        <path d="M32 50 L32 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "eniripsa",
    label: "Eniripsa · Palabra",
    render: () => (
      <>
        <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeOpacity="0.25" />
        <path d="M18 40 Q 32 12 46 40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="24" cy="34" r="2" fill="currentColor" />
        <circle cx="40" cy="34" r="2" fill="currentColor" />
        <path d="M28 44 Q 32 48 36 44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "sram",
    label: "Sram · Sombra",
    render: () => (
      <>
        <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeOpacity="0.25" />
        <path d="M32 12 L46 40 L18 40 Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="26" cy="30" r="1.6" fill="var(--color-background)" />
        <circle cx="38" cy="30" r="1.6" fill="var(--color-background)" />
      </>
    ),
  },
  {
    id: "xelor",
    label: "Xelor · Tiempo",
    render: () => (
      <>
        <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeOpacity="0.25" />
        <circle cx="32" cy="32" r="18" fill="none" stroke="currentColor" strokeWidth="1.5" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((h) => {
          const a = (h * 30 * Math.PI) / 180;
          const x1 = 32 + Math.sin(a) * 17;
          const y1 = 32 - Math.cos(a) * 17;
          const x2 = 32 + Math.sin(a) * 20;
          const y2 = 32 - Math.cos(a) * 20;
          return <line key={h} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1" />;
        })}
        <line x1="32" y1="32" x2="32" y2="20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="32" y1="32" x2="42" y2="36" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "dofus-ocre",
    label: "Dofus Ocre",
    render: () => (
      <>
        <ellipse cx="32" cy="34" rx="16" ry="20" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.5" />
        <ellipse cx="32" cy="34" rx="8" ry="12" fill="none" stroke="currentColor" strokeOpacity="0.5" />
        <path d="M32 20 Q 24 28 28 40" stroke="currentColor" strokeOpacity="0.6" strokeWidth="1.2" fill="none" />
      </>
    ),
  },
  {
    id: "kama",
    label: "Kama",
    render: () => (
      <>
        <circle cx="32" cy="32" r="20" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
        <text x="32" y="39" textAnchor="middle" fontFamily="var(--font-display)" fontSize="18" fontWeight="600" fill="currentColor">K</text>
      </>
    ),
  },
];

export function DofusRuneGallery() {
  return (
    <section aria-labelledby="runes-heading" className="surface-card p-6 md:p-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="mono-label">Referencia rápida</span>
          <h2 id="runes-heading" className="mt-2 font-display text-lg font-semibold">
            Runas &amp; glifos de Dofus
          </h2>
        </div>
        <span className="mono-label hidden sm:inline">{RUNES.length} entradas</span>
      </div>
      <ul
        role="list"
        className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4"
      >
        {RUNES.map((r) => (
          <li
            key={r.id}
            className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-surface-2/40 p-4 transition-colors hover:border-primary/60 hover:bg-surface-2"
          >
            <svg
              viewBox="0 0 64 64"
              className="h-12 w-12 text-primary transition-transform group-hover:scale-110"
              aria-hidden="true"
            >
              {r.render()}
            </svg>
            <span className="text-center font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground">
              {r.label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
