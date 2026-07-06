import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/")({
  component: Index,
});

/**
 * Dofus-inspired radar: concentric ley-lines, a rotating sweep, glowing
 * archimonster pings and a ring of class glyphs (Iop, Cra, Sadida, Xelor).
 */
function DofusRadar() {
  const glyphRing = [
    // Iop sword
    <path d="M0 -6 L2 4 L0 8 L-2 4 Z" />,
    // Cra target cross
    <g>
      <circle r="4" fill="none" strokeWidth="1" stroke="currentColor" />
      <circle r="1.2" fill="currentColor" />
    </g>,
    // Sadida leaf
    <path d="M0 -6 C 4 -2, 4 4, 0 8 C -4 4, -4 -2, 0 -6 Z" />,
    // Xelor hourglass
    <path d="M-4 -5 L4 -5 L-4 5 L4 5 Z" />,
    // Sram triangle
    <path d="M0 -6 L5 5 L-5 5 Z" />,
    // Eniripsa arc
    <path d="M-5 3 Q 0 -7 5 3" fill="none" strokeWidth="1.4" stroke="currentColor" />,
    // Dofus egg
    <ellipse rx="3" ry="4.5" />,
    // Kama coin
    <circle r="4.5" fill="none" strokeWidth="1" stroke="currentColor" />,
  ];

  return (
    <div className="relative mx-auto mt-14 h-[300px] w-full max-w-2xl md:h-[380px]">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-float">
          <svg viewBox="0 0 400 400" className="h-[300px] w-[300px] md:h-[380px] md:w-[380px]" role="img" aria-label="Radar de archimonstruos">
            <defs>
              <radialGradient id="ring-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff5b1f" stopOpacity="0.45" />
                <stop offset="70%" stopColor="#ff5b1f" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#ff5b1f" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="sweep" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#ff5b1f" stopOpacity="0" />
                <stop offset="100%" stopColor="#ff5b1f" stopOpacity="0.75" />
              </linearGradient>
              <radialGradient id="ping" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff8f5a" stopOpacity="1" />
                <stop offset="100%" stopColor="#ff5b1f" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Outer soft glow */}
            <circle cx="200" cy="200" r="185" fill="url(#ring-glow)" />

            {/* Rune ring — outer ornamental band */}
            <circle cx="200" cy="200" r="175" fill="none" stroke="#24242c" strokeDasharray="1 6" />

            {/* Concentric rings (ley lines) */}
            {[45, 90, 135, 170].map((r) => (
              <circle key={r} cx="200" cy="200" r={r} fill="none" stroke="#24242c" strokeWidth="1" />
            ))}

            {/* Compass cross */}
            <line x1="30" y1="200" x2="370" y2="200" stroke="#24242c" strokeDasharray="4 6" />
            <line x1="200" y1="30" x2="200" y2="370" stroke="#24242c" strokeDasharray="4 6" />

            {/* Class/rune glyphs positioned around the ring */}
            <g className="text-primary" style={{ opacity: 0.55 }}>
              {glyphRing.map((glyph, i) => {
                const angle = (i / glyphRing.length) * Math.PI * 2 - Math.PI / 2;
                const cx = 200 + Math.cos(angle) * 158;
                const cy = 200 + Math.sin(angle) * 158;
                return (
                  <g key={i} transform={`translate(${cx} ${cy})`} fill="currentColor">
                    {glyph}
                  </g>
                );
              })}
            </g>

            {/* Rotating sweep */}
            <g style={{ transformOrigin: "200px 200px", animation: "spin 6s linear infinite" }}>
              <path d="M200,200 L370,200 A170,170 0 0,0 320,53 Z" fill="url(#sweep)" opacity="0.4" />
            </g>

            {/* Archimonster pings */}
            <g>
              <circle cx="138" cy="132" r="22" fill="url(#ping)" opacity="0.9" />
              <circle cx="138" cy="132" r="4" fill="#ff5b1f" />
              <circle cx="272" cy="248" r="3" fill="#ededf0" />
              <circle cx="238" cy="102" r="3" fill="#ededf0" opacity="0.55" />
              <circle cx="108" cy="272" r="3" fill="#ededf0" opacity="0.65" />
            </g>

            {/* Central sigil — six-pointed rune */}
            <g transform="translate(200 200)">
              <circle r="14" fill="#0a0a0b" stroke="#ff5b1f" strokeWidth="2" />
              <path
                d="M0 -8 L7 -4 L7 4 L0 8 L-7 4 L-7 -4 Z"
                fill="none"
                stroke="#ff5b1f"
                strokeWidth="1.2"
              />
              <circle r="2" fill="#ff5b1f" />
            </g>
          </svg>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>

      {/* Floating coordinate chips */}
      <div className="absolute right-0 top-4 hidden md:block">
        <div className="surface-card px-3 py-2 font-mono text-[0.7rem]">
          <div className="text-muted-foreground">Jalatintanic, el Hundido</div>
          <div className="text-primary">[2,-8] · Sufokia</div>
        </div>
      </div>
      <div className="absolute -left-2 bottom-4 hidden md:block">
        <div className="surface-card px-3 py-2 font-mono text-[0.7rem]">
          <div className="text-muted-foreground">SERVIDOR</div>
          <div>Dodge · Ilyzaelle</div>
        </div>
      </div>
    </div>
  );
}

function Index() {
  return (
    <Layout>
      <div className="w-full max-w-3xl">
        <div className="text-center">
          <span className="badge-dot">
            <span className="live-dot" aria-hidden="true" /> Dofus Touch · Posiciones en vivo
          </span>
          <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            Caza cada <span className="text-gradient">archimonstruo</span>
            <br className="hidden sm:block" /> antes de que huya.
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
            <strong className="text-foreground">DakuBot</strong> te entrega coordenadas exactas y en tiempo real
            de los archimonstruos de Dofus Touch, directo desde nuestro pathfinder.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/join"
              className="btn-primary hover:[&]:btn-primary-hover"
            >
              Ingresar
              <span aria-hidden="true">→</span>
            </Link>
            <a href="#how" className="btn-ghost hover:border-primary/50 hover:text-primary">
              Cómo funciona
            </a>
          </div>
        </div>

        <DofusRadar />

        <div id="how" className="mt-16 grid gap-4 md:grid-cols-3">
          {[
            { k: "01", t: "Únete", d: "Entra al servidor de Discord y obtén tu clave de licencia." },
            { k: "02", t: "Introduce", d: "Pega la clave en la página del archimonstruo objetivo." },
            { k: "03", t: "Revela", d: "Recibe posición, servidor y nombre al instante." },
          ].map((s) => (
            <div key={s.k} className="surface-card p-5">
              <div className="mono-label">{s.k}</div>
              <div className="mt-2 font-display text-lg font-semibold">{s.t}</div>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
