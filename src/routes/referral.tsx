import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/referral")({
  head: () => ({
    meta: [
      { title: "Programa de referidos — DakuBot" },
      {
        name: "description",
        content: "Invita amigos a DakuBot y gana días extra de licencia.",
      },
    ],
  }),
  component: ReferralPage,
});

const STEPS = [
  {
    k: "01",
    t: "Consigue tu código",
    d: "En cuanto tienes una licencia (por Discord o canjeando un código promocional), el sistema te da automáticamente tu propio código de referido, tipo REF-XK4M9Q.",
  },
  {
    k: "02",
    t: "Encuéntralo",
    d: "Aparece al revelar una posición en /position, o justo después de canjear un código en REDEEM — con botón para copiarlo directo.",
  },
  {
    k: "03",
    t: "Compártelo",
    d: "Pásaselo a un amigo que todavía no tenga licencia — por Discord, donde quieras.",
  },
  {
    k: "04",
    t: "Tu amigo lo usa",
    d: "Cuando consiga su propia licencia (canjeando un código o recibiéndola por Discord), pone tu código en el campo \"Código de referido\".",
  },
  {
    k: "05",
    t: "Ganas +1 día",
    d: "En cuanto se confirma su licencia, tu licencia gana 1 día extra automáticamente. Sin límite de veces — cada amigo nuevo, +1 día más.",
  },
];

const FAQ = [
  {
    q: "¿Mi amigo también gana algo?",
    a: "No — el bono es solo para quien invita. Tu amigo consigue su licencia normal, sin descuento ni tiempo extra por usar tu código.",
  },
  {
    q: "¿Puedo usar mi propio código?",
    a: "No, el sistema lo detecta y lo ignora — el código de referido no puede acreditarte a ti mismo.",
  },
  {
    q: "Mi licencia es permanente, ¿igual puedo referir?",
    a: "Puedes compartir tu código, pero si tu licencia ya es permanente no hay nada que extenderle — el bono de +1 día solo aplica a licencias con fecha de caducidad.",
  },
  {
    q: "¿Cuántas veces puedo ganar el bono?",
    a: "Sin límite. Cada persona nueva que use tu código te suma otro día, se van acumulando.",
  },
  {
    q: "Ya vi mi código una vez pero no lo copié, ¿dónde lo recupero?",
    a: "En cualquier momento, en MI LICENCIA — solo necesitas tu clave de licencia, sin importar si tienes un archimonstruo activo o no.",
  },
];

function ReferralPage() {
  return (
    <Layout>
      <div className="w-full max-w-3xl">
        <div className="text-center">
          <span className="mono-label">Referidos</span>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
            Invita y <span className="text-primary">gana</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground md:text-base">
            Cada amigo que invitas y consigue su licencia, te suma +1 día — sin límite.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {STEPS.map((s) => (
            <div key={s.k} className="surface-card flex items-start gap-4 p-5">
              <span className="mono-label shrink-0 text-xl text-primary">{s.k}</span>
              <div>
                <div className="font-display text-sm font-semibold">{s.t}</div>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h2 className="text-center font-display text-xl font-semibold">Preguntas frecuentes</h2>
          <div className="mt-5 space-y-3">
            {FAQ.map((item) => (
              <div key={item.q} className="surface-card p-5">
                <div className="font-display text-sm font-semibold">{item.q}</div>
                <p className="mt-1.5 text-sm text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">¿Todavía no tienes licencia?</p>
          <Link to="/price" className="btn-primary mt-3 inline-flex hover:[&]:btn-primary-hover">
            Ver planes
            <span aria-hidden="true">→</span>
          </Link>
          <p className="mt-6 text-sm">
            <Link
              to="/my-license"
              className="mono-label text-muted-foreground transition-colors hover:text-primary"
            >
              ¿Ya tienes una? Consulta tu código aquí →
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
