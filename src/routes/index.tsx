import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/")({
  component: Index,
});

function HunterIllustration() {
  return (
    <svg
      viewBox="0 0 400 300"
      className="mx-auto h-56 w-full max-w-md text-primary"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Moon */}
      <circle cx="310" cy="70" r="34" strokeOpacity="0.6" />
      <circle cx="310" cy="70" r="34" fill="currentColor" fillOpacity="0.06" />
      {/* Distant mountains */}
      <path d="M0,220 L70,150 L120,200 L180,130 L240,210 L310,160 L400,220" strokeOpacity="0.4" />
      {/* Ground */}
      <line x1="0" y1="245" x2="400" y2="245" strokeOpacity="0.5" />
      {/* Hunter silhouette */}
      <g transform="translate(140,140)">
        <circle cx="0" cy="0" r="10" />
        <path d="M0,10 L0,55" />
        <path d="M0,20 L-22,45 L-18,55" />
        <path d="M0,20 L25,10 L48,30" />
        <path d="M0,55 L-12,105" />
        <path d="M0,55 L14,105" />
        {/* Bow */}
        <path d="M25,10 Q60,25 25,55" strokeOpacity="0.8" />
        <line x1="25" y1="10" x2="25" y2="55" strokeDasharray="2 2" strokeOpacity="0.6" />
        <line x1="25" y1="32" x2="72" y2="32" />
      </g>
      {/* Monster tracks */}
      <g strokeOpacity="0.7">
        <path d="M240,255 q3,-4 6,0 q3,4 6,0" />
        <path d="M270,262 q3,-4 6,0 q3,4 6,0" />
        <path d="M300,255 q3,-4 6,0 q3,4 6,0" />
        <path d="M330,262 q3,-4 6,0 q3,4 6,0" />
      </g>
      {/* Monster eyes in the dark */}
      <g fill="currentColor">
        <circle cx="370" cy="200" r="2" />
        <circle cx="378" cy="200" r="2" />
      </g>
      {/* Compass mark */}
      <g transform="translate(60,60)" strokeOpacity="0.5">
        <circle cx="0" cy="0" r="18" />
        <polygon points="0,-14 -3,0 0,-2 3,0" fill="currentColor" />
        <polygon points="0,14 -3,0 0,2 3,0" fillOpacity="0.4" fill="currentColor" />
      </g>
    </svg>
  );
}

function Index() {
  return (
    <Layout>
      <div className="w-full max-w-2xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-muted-foreground">
          Archis Touch
        </p>
        <h1 className="mt-4 text-5xl font-medium text-foreground md:text-6xl">
          Bienvenido a <span className="text-primary italic">Archis Touch</span>
        </h1>
        <div className="mx-auto my-10 h-px w-24 bg-primary/60" />
        <HunterIllustration />
        <p className="mx-auto mt-6 max-w-md text-muted-foreground">
          El grimorio del cazador. Sigue el rastro de los archimonstruos que
          osan cruzar tu camino.
        </p>
        <Link to="/join" className="gold-btn mt-10 hover:bg-transparent hover:text-primary">
          Ingresar
        </Link>
      </div>
    </Layout>
  );
}
