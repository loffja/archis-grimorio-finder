import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { useLanguage, type Lang } from "@/lib/i18n";

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

type Step = { k: string; t: string; d: string };
type FaqItem = { q: string; a: string };

const STEPS_ES: Step[] = [
  { k: "01", t: "Consigue tu código", d: "En cuanto tienes una licencia (por Discord o canjeando un código promocional), el sistema te da automáticamente tu propio código de referido, tipo REF-XK4M9Q." },
  { k: "02", t: "Encuéntralo", d: "Aparece al revelar una posición en /position, o justo después de canjear un código en REDEEM — con botón para copiarlo directo." },
  { k: "03", t: "Compártelo", d: "Pásaselo a un amigo que todavía no tenga licencia — por Discord, donde quieras." },
  { k: "04", t: "Tu amigo lo usa", d: 'Cuando consiga su propia licencia (canjeando un código o recibiéndola por Discord), pone tu código en el campo "Código de referido".' },
  { k: "05", t: "Ganas +1 día", d: "En cuanto se confirma su licencia, tu licencia gana 1 día extra automáticamente. Sin límite de veces — cada amigo nuevo, +1 día más." },
];

const STEPS_FR: Step[] = [
  { k: "01", t: "Obtenez votre code", d: "Dès que vous avez une licence (via Discord ou en échangeant un code promo), le système vous donne automatiquement votre propre code de parrainage, du type REF-XK4M9Q." },
  { k: "02", t: "Trouvez-le", d: "Il apparaît en révélant une position sur /position, ou juste après avoir échangé un code sur REDEEM — avec un bouton pour le copier directement." },
  { k: "03", t: "Partagez-le", d: "Donnez-le à un ami qui n'a pas encore de licence — sur Discord, où vous voulez." },
  { k: "04", t: "Votre ami l'utilise", d: 'Quand il obtient sa propre licence (en échangeant un code ou en la recevant via Discord), il met votre code dans le champ « Code de parrainage ».' },
  { k: "05", t: "Vous gagnez +1 jour", d: "Dès que sa licence est confirmée, votre licence gagne automatiquement 1 jour de plus. Sans limite de fois — chaque nouvel ami, +1 jour de plus." },
];

const STEPS_EN: Step[] = [
  { k: "01", t: "Get your code", d: "As soon as you have a license (via Discord or by redeeming a promo code), the system automatically gives you your own referral code, like REF-XK4M9Q." },
  { k: "02", t: "Find it", d: "It appears when revealing a position on /position, or right after redeeming a code on REDEEM — with a button to copy it directly." },
  { k: "03", t: "Share it", d: "Pass it to a friend who doesn't have a license yet — on Discord, wherever." },
  { k: "04", t: "Your friend uses it", d: 'When they get their own license (redeeming a code or receiving one via Discord), they enter your code in the "Referral code" field.' },
  { k: "05", t: "You earn +1 day", d: "As soon as their license is confirmed, your license automatically earns 1 extra day. No limit on how many times — each new friend, +1 more day." },
];

const FAQ_ES: FaqItem[] = [
  { q: "¿Mi amigo también gana algo?", a: "No — el bono es solo para quien invita. Tu amigo consigue su licencia normal, sin descuento ni tiempo extra por usar tu código." },
  { q: "¿Puedo usar mi propio código?", a: "No, el sistema lo detecta y lo ignora — el código de referido no puede acreditarte a ti mismo." },
  { q: "Mi licencia es permanente, ¿igual puedo referir?", a: "Puedes compartir tu código, pero si tu licencia ya es permanente no hay nada que extenderle — el bono de +1 día solo aplica a licencias con fecha de caducidad." },
  { q: "¿Cuántas veces puedo ganar el bono?", a: "Sin límite. Cada persona nueva que use tu código te suma otro día, se van acumulando." },
  { q: "Ya vi mi código una vez pero no lo copié, ¿dónde lo recupero?", a: "En cualquier momento, en MI LICENCIA — solo necesitas tu clave de licencia, sin importar si tienes un archimonstruo activo o no." },
];

const FAQ_FR: FaqItem[] = [
  { q: "Mon ami gagne-t-il aussi quelque chose ?", a: "Non — le bonus est réservé à celui qui invite. Votre ami obtient sa licence normale, sans réduction ni temps supplémentaire pour avoir utilisé votre code." },
  { q: "Puis-je utiliser mon propre code ?", a: "Non, le système le détecte et l'ignore — le code de parrainage ne peut pas vous créditer vous-même." },
  { q: "Ma licence est permanente, puis-je quand même parrainer ?", a: "Vous pouvez partager votre code, mais si votre licence est déjà permanente, il n'y a rien à prolonger — le bonus de +1 jour s'applique uniquement aux licences avec une date d'expiration." },
  { q: "Combien de fois puis-je gagner le bonus ?", a: "Sans limite. Chaque nouvelle personne qui utilise votre code vous ajoute un jour de plus, ça s'accumule." },
  { q: "J'ai vu mon code une fois mais je ne l'ai pas copié, où le retrouver ?", a: "À tout moment, dans MA LICENCE — vous n'avez besoin que de votre clé de licence, peu importe si vous avez un archimonstre actif ou non." },
];

const FAQ_EN: FaqItem[] = [
  { q: "Does my friend also earn something?", a: "No — the bonus is only for the person who invites. Your friend gets their normal license, with no discount or extra time for using your code." },
  { q: "Can I use my own code?", a: "No, the system detects it and ignores it — a referral code can't credit yourself." },
  { q: "My license is permanent, can I still refer?", a: "You can still share your code, but if your license is already permanent there's nothing to extend — the +1 day bonus only applies to licenses with an expiration date." },
  { q: "How many times can I earn the bonus?", a: "No limit. Every new person who uses your code adds another day, they stack up." },
  { q: "I saw my code once but didn't copy it, where do I find it again?", a: "Anytime, on MY LICENSE — you only need your license key, no matter if you have an active archmonster or not." },
];

const STEPS_BY_LANG: Record<Lang, Step[]> = { es: STEPS_ES, fr: STEPS_FR, en: STEPS_EN };
const FAQ_BY_LANG: Record<Lang, FaqItem[]> = { es: FAQ_ES, fr: FAQ_FR, en: FAQ_EN };

function ReferralPage() {
  const { t, lang } = useLanguage();
  const steps = STEPS_BY_LANG[lang];
  const faq = FAQ_BY_LANG[lang];
  return (
    <Layout>
      <div className="w-full max-w-3xl">
        <div className="text-center">
          <span className="mono-label">{t("referral_label")}</span>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
            {t("referral_titlePart1")} <span className="text-primary">{t("referral_titleHighlight")}</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground md:text-base">
            {t("referral_subtitle")}
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {steps.map((s) => (
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
          <h2 className="text-center font-display text-xl font-semibold">{t("how_faqTitle")}</h2>
          <div className="mt-5 space-y-3">
            {faq.map((item) => (
              <div key={item.q} className="surface-card p-5">
                <div className="font-display text-sm font-semibold">{item.q}</div>
                <p className="mt-1.5 text-sm text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">{t("referral_noLicenseYet")}</p>
          <Link to="/price" className="btn-primary mt-3 inline-flex hover:[&]:btn-primary-hover">
            {t("referral_seePlans")}
            <span aria-hidden="true">→</span>
          </Link>
          <p className="mt-6 text-sm">
            <Link
              to="/my-license"
              className="mono-label text-muted-foreground transition-colors hover:text-primary"
            >
              {t("referral_alreadyHaveOne")}
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
