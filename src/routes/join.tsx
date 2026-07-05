import { createFileRoute } from "@tanstack/react-router";
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
      <div className="surface-card relative w-full max-w-xl overflow-hidden p-10 text-center md:p-14">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <span className="badge-dot relative"><span className="live-dot" /> Discord Server</span>
        <h1 className="relative mt-6 text-4xl font-semibold tracking-tight md:text-5xl">
          Únete a nuestro <span className="text-primary">servidor</span>
        </h1>
        <p className="relative mx-auto mt-4 max-w-sm text-muted-foreground">
          Obtén posiciones en tiempo real haciendo clic en el botón de abajo.
        </p>
        <a
          href="https://discord.gg/mvEvT5FzND"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary relative mt-8 hover:[&]:btn-primary-hover"
        >
          Unirse al servidor
          <span aria-hidden>↗</span>
        </a>
        <div className="relative mt-8 border-t border-border pt-6">
          <div className="mono-label">Invite link</div>
          <div className="mt-1 font-mono text-sm text-foreground">discord.gg/mvEvT5FzND</div>
        </div>
      </div>
    </Layout>
  );
}
