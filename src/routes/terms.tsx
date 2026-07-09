import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Términos y aviso legal — DakuBot" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TermsPage,
});

const SECTIONS = [
  {
    t: "Sobre este servicio",
    body: [
      "DakuBot es una herramienta creada por aficionados, sin ningún vínculo, afiliación, patrocinio ni aprobación por parte de Ankama ni de Dofus Touch. Todos los nombres, imágenes e identificadores de archimonstruos pertenecen a sus respectivos dueños y se usan aquí únicamente con fines de referencia dentro de la comunidad.",
    ],
  },
  {
    t: "Uso bajo tu propia responsabilidad",
    body: [
      "Este servicio depende de herramientas de terceros para detectar y reportar información del juego. El uso de este tipo de herramientas puede entrar en conflicto con las normas de uso de Ankama/Dofus Touch, y podría derivar en sanciones sobre tu cuenta de juego según sus propias políticas.",
      "Al usar DakuBot, aceptas que lo haces bajo tu propio criterio y responsabilidad. No garantizamos que el uso de este servicio sea compatible con las normas del juego, y no nos hacemos responsables de sanciones, baneos o pérdidas derivadas de su uso.",
    ],
  },
  {
    t: "Precisión de la información",
    body: [
      "Las posiciones y apariciones de archimonstruos se ofrecen \"tal cual\", sin garantía de exactitud, disponibilidad o actualización en tiempo real. Los datos pueden contener errores, retrasos o quedar desactualizados antes de que los veas.",
    ],
  },
  {
    t: "Datos que guardamos",
    body: [
      "Guardamos únicamente lo necesario para que el servicio funcione: tu PC ID (el identificador que tú mismo eliges), tu clave de licencia, y marcas de tiempo de uso. No pedimos ni almacenamos datos personales adicionales (nombre real, email, dirección, etc.) salvo que tú los compartas voluntariamente por otro medio, como Discord.",
      "No vendemos ni compartimos estos datos con terceros. Los registros de posiciones de archimonstruos se eliminan automáticamente a los 30-60 minutos de su detección.",
    ],
  },
  {
    t: "Licencias y pagos",
    body: [
      "El proceso de obtención de licencias (pago, entrega de clave) se gestiona de forma manual o mediante códigos promocionales, fuera de un sistema de cobro automatizado. No se garantizan reembolsos salvo que se acuerde expresamente caso por caso.",
      "Nos reservamos el derecho de revocar cualquier licencia en caso de uso indebido, abuso del sistema, o incumplimiento de estos términos.",
    ],
  },
  {
    t: "Disponibilidad del servicio",
    body: [
      "DakuBot se ofrece \"tal cual\", sin garantía de disponibilidad continua. El servicio puede modificarse, pausarse o cerrarse en cualquier momento, sin aviso previo.",
    ],
  },
  {
    t: "Contacto",
    body: [
      "Para dudas, soporte, o solicitudes relacionadas con tus datos o tu licencia, contáctanos a través de nuestro servidor de Discord.",
    ],
  },
];

function TermsPage() {
  return (
    <Layout>
      <div className="w-full max-w-2xl">
        <div className="text-center">
          <span className="mono-label">Legal</span>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
            Términos y <span className="text-primary">aviso legal</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Última actualización: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {SECTIONS.map((s) => (
            <div key={s.t} className="surface-card p-5 md:p-6">
              <h2 className="font-display text-base font-semibold text-primary">{s.t}</h2>
              <div className="mt-2 space-y-2">
                {s.body.map((p, i) => (
                  <p key={i} className="text-sm leading-relaxed text-muted-foreground">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
