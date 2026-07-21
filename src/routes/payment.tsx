import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { useLanguage, type Lang } from "@/lib/i18n";

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

type Method = { name: string; tag: string; d: string };

const METHODS_ES: Method[] = [
  { name: "Nequi", tag: "Colombia", d: "Pago rápido si estás en Colombia. Te pasamos el número al coordinar en Discord." },
  { name: "Bizum", tag: "España", d: "Para pagos desde España. El número se comparte al coordinar en Discord." },
  { name: "Litecoin (LTC)", tag: "Cripto", d: "Pago en cripto, sin importar tu país. La wallet se comparte al coordinar en Discord." },
];

const METHODS_FR: Method[] = [
  { name: "Nequi", tag: "Colombie", d: "Paiement rapide si vous êtes en Colombie. On vous donne le numéro lors de la coordination sur Discord." },
  { name: "Bizum", tag: "Espagne", d: "Pour les paiements depuis l'Espagne. Le numéro est partagé lors de la coordination sur Discord." },
  { name: "Litecoin (LTC)", tag: "Crypto", d: "Paiement en crypto, quel que soit votre pays. Le portefeuille est partagé lors de la coordination sur Discord." },
];

const METHODS_EN: Method[] = [
  { name: "Nequi", tag: "Colombia", d: "Fast payment if you're in Colombia. We share the number when coordinating on Discord." },
  { name: "Bizum", tag: "Spain", d: "For payments from Spain. The number is shared when coordinating on Discord." },
  { name: "Litecoin (LTC)", tag: "Crypto", d: "Crypto payment, no matter your country. The wallet is shared when coordinating on Discord." },
];

const METHODS_BY_LANG: Record<Lang, Method[]> = { es: METHODS_ES, fr: METHODS_FR, en: METHODS_EN };

function PaymentPage() {
  const { t, lang } = useLanguage();
  const methods = METHODS_BY_LANG[lang];
  return (
    <Layout>
      <div className="w-full max-w-2xl">
        <div className="text-center">
          <span className="mono-label">{t("payment_label")}</span>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
            {t("payment_titlePart1")} <span className="text-primary">{t("payment_titleHighlight")}</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            {t("payment_desc")}
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {methods.map((m) => (
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
          <h2 className="font-display text-lg font-semibold">{t("payment_howItWorksTitle")}</h2>
          <ol className="mx-auto mt-4 max-w-sm space-y-2 text-left text-sm text-muted-foreground">
            <li>
              <span className="text-primary">1.</span> {t("payment_step1Prefix")}{" "}
              <Link to="/price" className="text-primary underline decoration-dotted underline-offset-2">
                PRICING
              </Link>
            </li>
            <li>
              <span className="text-primary">2.</span> {t("payment_step2")}
            </li>
            <li>
              <span className="text-primary">3.</span> {t("payment_step3")}
            </li>
            <li>
              <span className="text-primary">4.</span> {t("payment_step4")}
            </li>
          </ol>
          <a
            href="https://discord.gg/4FRsf4uyV6"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-6 hover:[&]:btn-primary-hover"
          >
            {t("payment_goToDiscord")}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </Layout>
  );
}
