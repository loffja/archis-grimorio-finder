import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/")({
  component: Index,
});

function HeroVisual() {
  return (
    <div className="relative mx-auto mt-14 h-[280px] w-full max-w-2xl md:h-[340px]">
      {/* Concentric radar rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-float">
          <svg viewBox="0 0 400 400" className="h-[280px] w-[280px] md:h-[340px] md:w-[340px]">
            <defs>
              <radialGradient id="ring-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff5b1f" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ff5b1f" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="200" cy="200" r="180" fill="url(#ring-glow)" />
            {[40, 80, 120, 160].map((r) => (
              <circle key={r} cx="200" cy="200" r={r} fill="none" stroke="#24242c" strokeWidth="1" />
            ))}
            <line x1="20" y1="200" x2="380" y2="200" stroke="#24242c" />
            <line x1="200" y1="20" x2="200" y2="380" stroke="#24242c" />
            {/* Sweep line */}
            <g style={{ transformOrigin: "200px 200px", animation: "spin 6s linear infinite" }}>
              <defs>
                <linearGradient id="sweep" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#ff5b1f" stopOpacity="0" />
                  <stop offset="100%" stopColor="#ff5b1f" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              <path d="M200,200 L380,200 A180,180 0 0,0 340,73 Z" fill="url(#sweep)" opacity="0.35" />
            </g>
            {/* Data points */}
            <circle cx="140" cy="140" r="4" fill="#ff5b1f" />
            <circle cx="140" cy="140" r="8" fill="none" stroke="#ff5b1f" strokeOpacity="0.4" />
            <circle cx="270" cy="230" r="3" fill="#ededf0" />
            <circle cx="230" cy="110" r="3" fill="#ededf0" opacity="0.5" />
            <circle cx="110" cy="260" r="3" fill="#ededf0" opacity="0.6" />
            {/* Center */}
            <circle cx="200" cy="200" r="6" fill="#0a0a0b" stroke="#ff5b1f" strokeWidth="2" />
          </svg>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
      {/* Floating coordinate chips */}
      <div className="absolute right-0 top-8 hidden md:block">
        <div className="surface-card px-3 py-2 font-mono text-[0.7rem]">
          <div className="text-muted-foreground">Jalatintanic, el Hundido</div>
          <div className="text-primary">[2,-8]</div>
        </div>
      </div>
      <div className="absolute -left-2 bottom-8 hidden md:block">
        <div className="surface-card px-3 py-2 font-mono text-[0.7rem]">
          <div className="text-muted-foreground">SERVER</div>
          <div>Blair</div>
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
            <span className="live-dot" /> Dofus Touch · Posiciones en vivo
          </span>
          <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            Caza cada <span className="text-gradient">archimonstruo</span>
            <br className="hidden sm:block" /> antes de que huya.
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
            DakuBot te entrega coordenadas exactas y en tiempo real de los
            archimonstruos de Dofus Touch, directo desde nuestro pathfinder.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/join"
              className="btn-primary hover:[&]:btn-primary-hover"
            >
              Ingresar
              <span aria-hidden>→</span>
            </Link>
            <a href="#how" className="btn-ghost hover:border-primary/50 hover:text-primary">
              Cómo funciona
            </a>
          </div>
        </div>

        <HeroVisual />

        <div id="how" className="mt-16 grid gap-4 md:grid-cols-3">
          {[
            { k: "01", t: "Únete", d: "Entra al servidor y obtén tu clave de licencia." },
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
