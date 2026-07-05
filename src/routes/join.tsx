import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Únete al servidor — Archis Touch" },
      { name: "description", content: "Únete al servidor de Discord para recibir posiciones en tiempo real." },
    ],
  }),
  component: Join,
});

function Join() {
  return (
    <Layout>
      <div className="parchment-card w-full max-w-xl p-10 text-center md:p-14">
        <h1 className="text-4xl text-foreground md:text-5xl">
          ¡Únete a Nuestro <span className="text-primary italic">Servidor</span>!
        </h1>
        <div className="mx-auto my-6 h-px w-16 bg-primary/60" />
        <p className="text-muted-foreground">
          Obtén posiciones en tiempo real haciendo clic en el botón de abajo.
        </p>
        <a
          href="https://discord.gg/mvEvT5FzND"
          target="_blank"
          rel="noopener noreferrer"
          className="gold-btn mt-8 hover:bg-transparent hover:text-primary"
        >
          Unirse al Servidor
        </a>
      </div>
    </Layout>
  );
}
