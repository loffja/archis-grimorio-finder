import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/")({
  component: Index,
});

/**
 * Modern minimal radar: soft concentric rings, rotating sweep, glowing pings.
 */
function DofusRadar() {
  return (
    <div className="relative mx-auto mt-14 h-[300px] w-full max-w-2xl md:h-[380px]">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-float">
          <svg viewBox="0 0 400 400" className="h-[300px] w-[300px] md:h-[380px] md:w-[380px]" role="img" aria-label="Radar de archimonstruos">
            <defs>
              <radialGradient id="ring-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff2d87" stopOpacity="0.35" />
                <stop offset="70%" stopColor="#ff2d87" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#ff2d87" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="sweep" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#ff2d87" stopOpacity="0" />
                <stop offset="100%" stopColor="#ff2d87" stopOpacity="0.7" />
              </linearGradient>
              <radialGradient id="ping" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff7ab6" stopOpacity="1" />
                <stop offset="100%" stopColor="#ff2d87" stopOpacity="0" />
              </radialGradient>
            </defs>

            <circle cx="200" cy="200" r="185" fill="url(#ring-glow)" />

            {[60, 105, 150, 185].map((r) => (
              <circle key={r} cx="200" cy="200" r={r} fill="none" stroke="#24242c" strokeWidth="1" />
            ))}

            <line x1="15" y1="200" x2="385" y2="200" stroke="#1c1c22" strokeDasharray="2 8" />
            <line x1="200" y1="15" x2="200" y2="385" stroke="#1c1c22" strokeDasharray="2 8" />

            <g style={{ transformOrigin: "200px 200px", animation: "spin 6s linear infinite" }}>
              <path d="M200,200 L385,200 A185,185 0 0,0 330,49 Z" fill="url(#sweep)" opacity="0.55" />
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
