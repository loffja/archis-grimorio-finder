import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/payment")({
  head: () => ({
    meta: [
      { title: "Métodos de pago — DakuBot" },
      {
        name: "description",
        content: "Formas de pago aceptadas para las licencias de DakuBot.",
      },
    ],
  }),
  component: PaymentPage,
});

const METHODS = [
  {
    name: "Nequi",
    tag: "Colombia",
    d: "Pago rápido si estás en Colombia. Te pasamos el número al coordinar en Discord.",
  },
  {
    name: "Bizum",
    tag: "España",
    d: "Para pagos desde España. El número se comparte al coordinar en Discord.",
  },
  {
    name: "Litecoin (LTC)",
    tag: "Cripto",
    d: "Pago en cripto, sin importar tu país. La wallet se comparte al coordinar en Discord.",
  },
];

function PaymentPage() {
  return (
    <Layout>
      <div className="w-full max-w-2xl">
        <div className="text-center">
          <span className="mono-label">Pagos</span>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
            Métodos de <span className="text-primary">pago</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Elige el que te quede mejor. Los datos exactos (número o wallet) te los damos
            directamente al coordinar en Discord — por seguridad, no los publicamos aquí.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {METHODS.map((m) => (
            <div key={m.name} className="surface-card flex items-center justify-between gap-4 p-5">
              <div>
                <div className="font-display text-base font-semibold">{m.name}</div>
                <p className="mt-1 text-sm text-muted-foreground">{m.d}</p>
              </div>
              <span className="mono-label shrink-0 rounded-full border border-primary/30 px-3 py-1 text-primary">
                {m.tag}
              </span>
            </div>
          ))}
        </div>

        <div className="surface-card mt-8 p-6 text-center md:p-8">
          <h2 className="font-display text-lg font-semibold">¿Cómo funciona el pago?</h2>
          <ol className="mx-auto mt-4 max-w-sm space-y-2 text-left text-sm text-muted-foreground">
            <li>
              <span className="text-primary">1.</span> Elige tu plan en{" "}
              <Link to="/price" className="text-primary underline decoration-dotted underline-offset-2">
                PRICING
              </Link>
            </li>
            <li>
              <span className="text-primary">2.</span> Únete a Discord y dinos qué plan quieres
            </li>
            <li>
              <span className="text-primary">3.</span> Te pasamos los datos del método que elijas
            </li>
            <li>
              <span className="text-primary">4.</span> En cuanto confirmamos el pago, recibes tu clave de licencia
            </li>
          </ol>
          <a
            href="https://discord.gg/4FRsf4uyV6"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-6 hover:[&]:btn-primary-hover"
          >
            Ir a Discord
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </Layout>
  );
}
