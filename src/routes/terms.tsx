import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { useLanguage, type Lang } from "@/lib/i18n";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Términos y aviso legal — DakuBot" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TermsPage,
});

type Section = { t: string; body: string[] };

const SECTIONS_ES: Section[] = [
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

const SECTIONS_FR: Section[] = [
  {
    t: "À propos de ce service",
    body: [
      "DakuBot est un outil créé par des passionnés, sans aucun lien, affiliation, parrainage ni approbation de la part d'Ankama ni de Dofus Touch. Tous les noms, images et identifiants d'archimonstres appartiennent à leurs propriétaires respectifs et sont utilisés ici uniquement à titre de référence au sein de la communauté.",
    ],
  },
  {
    t: "Utilisation sous votre propre responsabilité",
    body: [
      "Ce service dépend d'outils tiers pour détecter et signaler des informations du jeu. L'utilisation de ce type d'outils peut entrer en conflit avec les règles d'utilisation d'Ankama/Dofus Touch, et pourrait entraîner des sanctions sur votre compte de jeu selon leurs propres politiques.",
      "En utilisant DakuBot, vous acceptez de le faire selon votre propre jugement et sous votre propre responsabilité. Nous ne garantissons pas que l'utilisation de ce service soit compatible avec les règles du jeu, et nous ne sommes pas responsables des sanctions, bannissements ou pertes résultant de son utilisation.",
    ],
  },
  {
    t: "Exactitude des informations",
    body: [
      "Les positions et apparitions d'archimonstres sont fournies « telles quelles », sans garantie d'exactitude, de disponibilité ou de mise à jour en temps réel. Les données peuvent contenir des erreurs, des retards, ou être obsolètes avant que vous ne les consultiez.",
    ],
  },
  {
    t: "Données que nous conservons",
    body: [
      "Nous ne conservons que ce qui est nécessaire au fonctionnement du service : votre PC ID (l'identifiant que vous choisissez vous-même), votre clé de licence, et des horodatages d'utilisation. Nous ne demandons ni ne stockons de données personnelles supplémentaires (nom réel, e-mail, adresse, etc.) sauf si vous les partagez volontairement par un autre moyen, comme Discord.",
      "Nous ne vendons ni ne partageons ces données avec des tiers. Les enregistrements de positions d'archimonstres sont supprimés automatiquement 30 à 60 minutes après leur détection.",
    ],
  },
  {
    t: "Licences et paiements",
    body: [
      "Le processus d'obtention des licences (paiement, remise de clé) est géré manuellement ou via des codes promotionnels, en dehors d'un système de facturation automatisé. Aucun remboursement n'est garanti sauf accord exprès au cas par cas.",
      "Nous nous réservons le droit de révoquer toute licence en cas d'utilisation abusive, d'abus du système, ou de non-respect de ces conditions.",
    ],
  },
  {
    t: "Disponibilité du service",
    body: [
      "DakuBot est fourni « tel quel », sans garantie de disponibilité continue. Le service peut être modifié, suspendu ou fermé à tout moment, sans préavis.",
    ],
  },
  {
    t: "Contact",
    body: [
      "Pour toute question, assistance ou demande liée à vos données ou à votre licence, contactez-nous via notre serveur Discord.",
    ],
  },
];

const SECTIONS_EN: Section[] = [
  {
    t: "About this service",
    body: [
      "DakuBot is a fan-made tool, with no affiliation, sponsorship, or endorsement from Ankama or Dofus Touch. All archmonster names, images, and identifiers belong to their respective owners and are used here strictly for reference purposes within the community.",
    ],
  },
  {
    t: "Use at your own risk",
    body: [
      "This service relies on third-party tools to detect and report in-game information. Using this type of tool may conflict with Ankama/Dofus Touch's terms of use, and could lead to sanctions on your game account under their own policies.",
      "By using DakuBot, you agree that you do so at your own discretion and responsibility. We do not guarantee that using this service is compatible with the game's rules, and we are not responsible for sanctions, bans, or losses resulting from its use.",
    ],
  },
  {
    t: "Accuracy of information",
    body: [
      "Archmonster positions and spawns are provided \"as is\", with no guarantee of accuracy, availability, or real-time updates. Data may contain errors, delays, or be outdated by the time you see it.",
    ],
  },
  {
    t: "Data we store",
    body: [
      "We only store what's necessary for the service to work: your PC ID (an identifier you choose yourself), your license key, and usage timestamps. We do not request or store additional personal data (real name, email, address, etc.) unless you voluntarily share it through another channel, such as Discord.",
      "We do not sell or share this data with third parties. Archmonster position records are automatically deleted 30-60 minutes after detection.",
    ],
  },
  {
    t: "Licenses and payments",
    body: [
      "The process of obtaining licenses (payment, key delivery) is handled manually or via promo codes, outside of an automated billing system. Refunds are not guaranteed unless expressly agreed on a case-by-case basis.",
      "We reserve the right to revoke any license in case of misuse, system abuse, or breach of these terms.",
    ],
  },
  {
    t: "Service availability",
    body: [
      "DakuBot is provided \"as is\", with no guarantee of continuous availability. The service may be modified, paused, or shut down at any time, without prior notice.",
    ],
  },
  {
    t: "Contact",
    body: [
      "For questions, support, or requests related to your data or license, contact us through our Discord server.",
    ],
  },
];

const SECTIONS_BY_LANG: Record<Lang, Section[]> = {
  es: SECTIONS_ES,
  fr: SECTIONS_FR,
  en: SECTIONS_EN,
};

function TermsPage() {
  const { t, lang } = useLanguage();
  const sections = SECTIONS_BY_LANG[lang];
  return (
    <Layout>
      <div className="w-full max-w-2xl">
        <div className="text-center">
          <span className="mono-label">{t("terms_legalLabel")}</span>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
            {t("terms_titlePart1")} <span className="text-primary">{t("terms_titleHighlight")}</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {t("terms_lastUpdated")}: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {sections.map((s) => (
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
