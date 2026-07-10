import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Únete al servidor — Archis Touch" },
      { name: "description", content: "Únete a Discord para recibir posiciones en tiempo real." },
    ],
  }),
  component: Join,
});

function Join() {
  return (
    <Layout>
      <div className="w-full max-w-xl">
        <div className="surface-card relative overflow-hidden p-10 text-center md:p-14">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <span className="badge-dot relative"><span className="live-dot" /> Discord Server</span>
          <h1 className="relative mt-6 text-4xl font-semibold tracking-tight md:text-5xl">
            Únete a nuestro <span className="text-primary">servidor</span>
          </h1>
          <p className="relative mx-auto mt-4 max-w-sm text-muted-foreground">
            Obtén posiciones en tiempo real haciendo clic en el botón de abajo.
          </p>
          <a
            href="https://discord.gg/4FRsf4uyV6"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary relative mt-8 hover:[&]:btn-primary-hover"
          >
            Unirse al servidor
            <span aria-hidden>↗</span>
          </a>
          <div className="relative mt-8 border-t border-border pt-6">
            <div className="mono-label">Invite link</div>
            <div className="mt-1 font-mono text-sm text-foreground">discord.gg/4FRsf4uyV6</div>
          </div>
        </div>

        <div className="surface-card mt-4 p-6 md:p-8">
          <h2 className="text-center font-display text-base font-semibold">
            ¿Qué pasa cuando entras?
          </h2>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <span className="mono-label mt-0.5 text-primary">01</span>
              <span>
                Mira los planes en{" "}
                <Link to="/price" className="text-primary underline decoration-dotted underline-offset-2">
                  PRICING
                </Link>{" "}
                y elige el que te sirva.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mono-label mt-0.5 text-primary">02</span>
              <span>
                Coordina el pago — mira los{" "}
                <Link to="/payment" className="text-primary underline decoration-dotted underline-offset-2">
                  métodos disponibles
                </Link>
                .
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mono-label mt-0.5 text-primary">03</span>
              <span>Recibes tu clave de licencia al confirmar el pago.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mono-label mt-0.5 text-primary">04</span>
              <span>
                ¿Ya tienes un código promocional? Cánjealo directo en{" "}
                <Link to="/redeem" className="text-primary underline decoration-dotted underline-offset-2">
                  REDEEM
                </Link>{" "}
                sin esperar.
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
