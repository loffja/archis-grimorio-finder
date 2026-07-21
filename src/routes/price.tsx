import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { useLanguage, type Lang } from "@/lib/i18n";

export const Route = createFileRoute("/price")({
  head: () => ({
    meta: [
      { title: "Precios — DakuBot" },
      {
        name: "description",
        content: "Planes de licencia de DakuBot para completar el Ocre al 100% en Dofus Touch.",
      },
    ],
  }),
  component: PricePage,
});

type Plan = { name: string; cop: string; usd: string; eur: string; tag: string | null; savings: string | null; blurb: string };
type Reason = { t: string; d: string };
type FaqItem = { q: string; a: string };

const PLANS_ES: Plan[] = [
  { name: "1 día", cop: "19.000", usd: "6", eur: "5", tag: null, savings: null, blurb: "Para probar el servicio o una sesión intensiva puntual." },
  { name: "7 días", cop: "46.000", usd: "14", eur: "12", tag: null, savings: "Ahorras un 67%", blurb: "Cubre un fin de semana largo o una semana completa de farmeo." },
  { name: "30 días", cop: "106.000", usd: "32", eur: "28", tag: "Mejor precio", savings: "Ahorras un 82%", blurb: "El mejor precio por día. Tiempo de sobra para terminar el Ocre sin prisa." },
];

const PLANS_FR: Plan[] = [
  { name: "1 jour", cop: "19.000", usd: "6", eur: "5", tag: null, savings: null, blurb: "Pour tester le service ou pour une session intensive ponctuelle." },
  { name: "7 jours", cop: "46.000", usd: "14", eur: "12", tag: null, savings: "Économisez 67%", blurb: "Couvre un long week-end ou une semaine complète de farming." },
  { name: "30 jours", cop: "106.000", usd: "32", eur: "28", tag: "Meilleur prix", savings: "Économisez 82%", blurb: "Le meilleur prix par jour. Largement le temps de terminer l'Ocre sans se presser." },
];

const PLANS_EN: Plan[] = [
  { name: "1 day", cop: "19.000", usd: "6", eur: "5", tag: null, savings: null, blurb: "To try the service or for a one-off intensive session." },
  { name: "7 days", cop: "46.000", usd: "14", eur: "12", tag: null, savings: "Save 67%", blurb: "Covers a long weekend or a full week of farming." },
  { name: "30 days", cop: "106.000", usd: "32", eur: "28", tag: "Best price", savings: "Save 82%", blurb: "The best price per day. Plenty of time to finish the Ocre without rushing." },
];

const REASONS_ES: Reason[] = [
  { t: "Cobertura del 100%, no parcial", d: 'Otros servicios similares en el mercado cubren una parte de los archimonstruos necesarios para el Ocre (por debajo del 60%) — el resto lo tienes que resolver por tu cuenta. DakuBot cubre el 100% de la misión: no hay un "resto" que te quede pendiente.' },
  { t: "Tiempo real, no listas desactualizadas", d: "Las posiciones se actualizan al instante en cuanto se detectan, no cada cierto tiempo ni con retraso. Lo que ves en LIVE es lo que hay ahora mismo." },
  { t: "Precio por día, no por trabajo a medias", d: 'El precio no está pensado como "cuánto cuesta una lista de posiciones" — está pensado como "cuánto vale no tener que buscar nada tú mismo". Cuanto más tiempo contratas, menos pagas por día: el plan mensual es, con diferencia, la opción más barata por día de uso.' },
];

const REASONS_FR: Reason[] = [
  { t: "Couverture à 100%, pas partielle", d: "D'autres services similaires sur le marché couvrent une partie des archimonstres nécessaires pour l'Ocre (moins de 60%) — le reste, vous devez le faire vous-même. DakuBot couvre 100% de la mission : il ne reste rien à faire de votre côté." },
  { t: "Temps réel, pas des listes obsolètes", d: "Les positions se mettent à jour instantanément dès leur détection, pas à intervalles réguliers ni avec du retard. Ce que vous voyez sur LIVE, c'est ce qu'il y a maintenant." },
  { t: "Prix par jour, pas pour un travail à moitié fait", d: 'Le prix n\'est pas pensé comme "combien coûte une liste de positions" — il est pensé comme "combien vaut le fait de ne rien avoir à chercher soi-même". Plus vous prenez de temps, moins vous payez par jour : le plan mensuel est de loin l\'option la moins chère par jour d\'utilisation.' },
];

const REASONS_EN: Reason[] = [
  { t: "100% coverage, not partial", d: 'Other similar services on the market cover only part of the archmonsters needed for the Ocre (under 60%) — the rest you have to figure out yourself. DakuBot covers 100% of the quest: there\'s no "rest" left over.' },
  { t: "Real time, not outdated lists", d: "Positions update instantly as soon as they're detected, not on a set interval or with a delay. What you see on LIVE is what's there right now." },
  { t: "Price per day, not for half a job", d: 'The price isn\'t designed as "how much does a list of positions cost" — it\'s designed as "how much is it worth not having to look for anything yourself". The longer you commit, the less you pay per day: the monthly plan is, by far, the cheapest option per day of use.' },
];

const FAQ_ES: FaqItem[] = [
  { q: "¿Por qué el plan de 1 día cuesta más por día que el mensual?", a: "Porque el plan de 1 día es para probar o para una necesidad puntual, sin compromiso. El plan mensual premia a quien se queda más tiempo con un precio por día mucho menor — es la opción pensada para completar el Ocre con calma." },
  { q: "¿Los precios pueden cambiar?", a: "Sí. Los precios se revisan según el tipo de cambio y la demanda. El precio que ves aquí es el vigente en el momento en que entras." },
  { q: "¿Cómo pago?", a: "Únete a nuestro Discord para coordinar el pago y recibir tu licencia, o canjea un código promocional directamente en REDEEM si ya tienes uno." },
];

const FAQ_FR: FaqItem[] = [
  { q: "Pourquoi le plan de 1 jour coûte-t-il plus cher par jour que le mensuel ?", a: "Parce que le plan de 1 jour sert à tester ou pour un besoin ponctuel, sans engagement. Le plan mensuel récompense ceux qui restent plus longtemps avec un prix par jour bien plus bas — c'est l'option pensée pour terminer l'Ocre tranquillement." },
  { q: "Les prix peuvent-ils changer ?", a: "Oui. Les prix sont révisés selon le taux de change et la demande. Le prix que vous voyez ici est celui en vigueur au moment où vous consultez la page." },
  { q: "Comment est-ce que je paie ?", a: "Rejoignez notre Discord pour coordonner le paiement et recevoir votre licence, ou échangez un code promo directement sur REDEEM si vous en avez déjà un." },
];

const FAQ_EN: FaqItem[] = [
  { q: "Why does the 1-day plan cost more per day than the monthly one?", a: "Because the 1-day plan is for trying it out or a one-off need, with no commitment. The monthly plan rewards those who stay longer with a much lower price per day — it's the option built for finishing the Ocre at your own pace." },
  { q: "Can prices change?", a: "Yes. Prices are reviewed based on exchange rate and demand. The price you see here is the one in effect at the moment you check." },
  { q: "How do I pay?", a: "Join our Discord to arrange payment and receive your license, or redeem a promo code directly on REDEEM if you already have one." },
];

const PLANS_BY_LANG: Record<Lang, Plan[]> = { es: PLANS_ES, fr: PLANS_FR, en: PLANS_EN };
const REASONS_BY_LANG: Record<Lang, Reason[]> = { es: REASONS_ES, fr: REASONS_FR, en: REASONS_EN };
const FAQ_BY_LANG: Record<Lang, FaqItem[]> = { es: FAQ_ES, fr: FAQ_FR, en: FAQ_EN };

function PricePage() {
  const { t, lang } = useLanguage();
  const plans = PLANS_BY_LANG[lang];
  const reasons = REASONS_BY_LANG[lang];
  const faq = FAQ_BY_LANG[lang];
  return (
    <Layout>
      <div className="w-full max-w-4xl">
        <div className="text-center">
          <span className="mono-label">{t("price_label")}</span>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
            {t("price_titlePart1")} <span className="text-primary">100%</span> {t("price_titlePart2")}
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground md:text-base">
            {t("price_subtitle")}
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={
                "surface-card relative flex flex-col p-6 " +
                (p.tag ? "border-primary/50" : "")
              }
            >
              {p.tag && (
                <span className="mono-label absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-primary/50 bg-background px-3 py-1 text-primary">
                  {p.tag}
                </span>
              )}
              <div className="mono-label text-center text-muted-foreground">{p.name}</div>
              <div className="mt-3 text-center">
                <div className="font-display text-3xl font-semibold">
                  <span className="text-primary">${p.usd}</span>
                  <span className="ml-1 text-base font-normal text-muted-foreground">USD</span>
                </div>
                <div className="mono-label mt-1 text-muted-foreground">
                  €{p.eur} · ${p.cop} COP
                </div>
              </div>
              <p className="mt-4 flex-1 text-center text-sm text-muted-foreground">{p.blurb}</p>
              {p.savings && (
                <div className="mono-label mt-3 text-center text-[0.65rem] text-[color:var(--success)]">
                  {p.savings}
                </div>
              )}
              <Link
                to="/join"
                className="btn-primary mt-5 w-full justify-center hover:[&]:btn-primary-hover"
              >
                {t("price_getLicense")}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <h2 className="text-center font-display text-xl font-semibold">
            {t("price_basisTitle")}
          </h2>
          <div className="mt-5 space-y-3">
            {reasons.map((r) => (
              <div key={r.t} className="surface-card p-5">
                <div className="font-display text-sm font-semibold text-primary">{r.t}</div>
                <p className="mt-1.5 text-sm text-muted-foreground">{r.d}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14">
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

        <p className="mt-8 text-center text-xs text-muted-foreground">
          {t("price_footnote")}
        </p>
      </div>
    </Layout>
  );
}
