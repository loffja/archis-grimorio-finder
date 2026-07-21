import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { useLanguage, type Lang } from "@/lib/i18n";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "Cómo funciona — DakuBot" },
      {
        name: "description",
        content: "Cómo usar DakuBot para encontrar archimonstruos en Dofus Touch.",
      },
    ],
  }),
  component: HowItWorksPage,
});

type Step = { k: string; t: string; d: string; to: "/live" | "/redeem" | null; cta: string | null };
type FaqItem = { q: string; a: string };

const STEPS_ES: Step[] = [
  { k: "01", t: "Explora en vivo", d: "Entra a LIVE y mira qué archimonstruos están activos ahora mismo — se actualiza solo, al instante, cada vez que aparece uno nuevo.", to: "/live", cta: "Ver en vivo" },
  { k: "02", t: "Consigue una licencia", d: "Únete a nuestro Discord para conseguir una licencia, o si ya tienes un código promocional, cánjealo tú mismo en REDEEM y recibe tu clave al instante.", to: "/redeem", cta: "Canjear código" },
  { k: "03", t: "Elige tu objetivo", d: "Toca cualquier archimonstruo en LIVE — te lleva directo a su página, sin tener que buscar el ID a mano.", to: null, cta: null },
  { k: "04", t: "Revela la posición", d: "Introduce tu licencia ahí. Al instante verás nombre, servidor y posición exacta — y cuánto tiempo le queda a tu licencia, en vivo.", to: null, cta: null },
];

const STEPS_FR: Step[] = [
  { k: "01", t: "Explorez en direct", d: "Allez sur LIVE et regardez quels archimonstres sont actifs en ce moment — ça se met à jour tout seul, instantanément, dès qu'un nouveau apparaît.", to: "/live", cta: "Voir en direct" },
  { k: "02", t: "Obtenez une licence", d: "Rejoignez notre Discord pour obtenir une licence, ou si vous avez déjà un code promo, échangez-le vous-même sur REDEEM et recevez votre clé instantanément.", to: "/redeem", cta: "Échanger un code" },
  { k: "03", t: "Choisissez votre cible", d: "Touchez n'importe quel archimonstre sur LIVE — ça vous emmène directement sur sa page, sans avoir à chercher l'ID à la main.", to: null, cta: null },
  { k: "04", t: "Révélez la position", d: "Entrez votre licence ici. Vous verrez instantanément le nom, le serveur et la position exacte — ainsi que le temps restant de votre licence, en direct.", to: null, cta: null },
];

const STEPS_EN: Step[] = [
  { k: "01", t: "Browse live", d: "Go to LIVE and see which archmonsters are active right now — it updates on its own, instantly, every time a new one appears.", to: "/live", cta: "View live" },
  { k: "02", t: "Get a license", d: "Join our Discord to get a license, or if you already have a promo code, redeem it yourself on REDEEM and get your key instantly.", to: "/redeem", cta: "Redeem code" },
  { k: "03", t: "Pick your target", d: "Tap any archmonster on LIVE — it takes you straight to its page, no need to look up the ID by hand.", to: null, cta: null },
  { k: "04", t: "Reveal the position", d: "Enter your license there. You'll instantly see the name, server, and exact position — and how much time your license has left, live.", to: null, cta: null },
];

const FAQ_ES: FaqItem[] = [
  { q: "¿Cuánto dura un archimonstruo activo?", a: "30 minutos desde la última vez que se detectó. Si sigue ahí, se renueva solo; si no, desaparece de la base de datos y de LIVE." },
  { q: "¿Qué pasa cuando caduca mi licencia?", a: "Deja de funcionar para revelar posiciones nuevas. Puedes conseguir otra por Discord o canjeando un código nuevo en REDEEM." },
  { q: "¿Puedo usar la misma licencia varias veces?", a: "Sí, pero hay un límite de una consulta cada 2 minutos por archimonstruo, para evitar abuso." },
  { q: "¿Necesito instalar algo?", a: "No. Todo funciona desde el navegador — LIVE, REDEEM y la revelación de posiciones." },
];

const FAQ_FR: FaqItem[] = [
  { q: "Combien de temps dure un archimonstre actif ?", a: "30 minutes depuis la dernière détection. S'il est toujours là, ça se renouvelle tout seul ; sinon, il disparaît de la base de données et de LIVE." },
  { q: "Que se passe-t-il quand ma licence expire ?", a: "Elle cesse de fonctionner pour révéler de nouvelles positions. Vous pouvez en obtenir une autre via Discord ou en échangeant un nouveau code sur REDEEM." },
  { q: "Puis-je utiliser la même licence plusieurs fois ?", a: "Oui, mais il y a une limite d'une requête toutes les 2 minutes par archimonstre, pour éviter les abus." },
  { q: "Dois-je installer quelque chose ?", a: "Non. Tout fonctionne depuis le navigateur — LIVE, REDEEM et la révélation des positions." },
];

const FAQ_EN: FaqItem[] = [
  { q: "How long does an active archmonster last?", a: "30 minutes from the last time it was detected. If it's still there, it renews on its own; if not, it disappears from the database and from LIVE." },
  { q: "What happens when my license expires?", a: "It stops working for revealing new positions. You can get another one via Discord or by redeeming a new code on REDEEM." },
  { q: "Can I use the same license multiple times?", a: "Yes, but there's a limit of one lookup every 2 minutes per archmonster, to prevent abuse." },
  { q: "Do I need to install anything?", a: "No. Everything works from the browser — LIVE, REDEEM, and revealing positions." },
];

const STEPS_BY_LANG: Record<Lang, Step[]> = { es: STEPS_ES, fr: STEPS_FR, en: STEPS_EN };
const FAQ_BY_LANG: Record<Lang, FaqItem[]> = { es: FAQ_ES, fr: FAQ_FR, en: FAQ_EN };

function HowItWorksPage() {
  const { t, lang } = useLanguage();
  const steps = STEPS_BY_LANG[lang];
  const faq = FAQ_BY_LANG[lang];
  return (
    <Layout>
      <div className="w-full max-w-3xl">
        <div className="text-center">
          <span className="mono-label">{t("how_quickGuide")}</span>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
            {t("how_titlePart1")} <span className="text-primary">{t("how_titleHighlight")}</span>
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground md:text-base">
            {t("how_subtitle")}
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {steps.map((s) => (
            <div key={s.k} className="surface-card flex flex-wrap items-center gap-4 p-5">
              <div className="mono-label shrink-0 text-2xl text-primary">{s.k}</div>
              <div className="min-w-[200px] flex-1">
                <div className="font-display text-base font-semibold">{s.t}</div>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </div>
              {s.to && (
                <Link
                  to={s.to}
                  className="btn-primary shrink-0 hover:[&]:btn-primary-hover"
                >
                  {s.cta}
                  <span aria-hidden="true">→</span>
                </Link>
              )}
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
      </div>
    </Layout>
  );
}
