import { LANGUAGES, useLanguage, type Lang } from "@/lib/i18n";

function FlagES() {
  return (
    <svg viewBox="0 0 20 14" width="20" height="14" role="img" aria-hidden="true">
      <rect width="20" height="14" fill="#c60b1e" />
      <rect y="3.5" width="20" height="7" fill="#ffc400" />
    </svg>
  );
}

function FlagFR() {
  return (
    <svg viewBox="0 0 20 14" width="20" height="14" role="img" aria-hidden="true">
      <rect width="20" height="14" fill="#ffffff" />
      <rect width="6.66" height="14" fill="#0055a4" />
      <rect x="13.33" width="6.67" height="14" fill="#ef4135" />
    </svg>
  );
}

function FlagUS() {
  return (
    <svg viewBox="0 0 20 14" width="20" height="14" role="img" aria-hidden="true">
      <rect width="20" height="14" fill="#ffffff" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} y={i * (14 / 13) * 2} width="20" height={14 / 13} fill="#b22234" />
      ))}
      <rect width="8.6" height="7.5" fill="#3c3b6e" />
    </svg>
  );
}

const FLAGS: Record<Lang, () => React.ReactElement> = {
  es: FlagES,
  fr: FlagFR,
  en: FlagUS,
};

export function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t("languageSelectorLabel")}
      className="flex items-center gap-1 rounded-full border border-border bg-surface-2/40 p-1"
    >
      {LANGUAGES.map((l) => {
        const Flag = FLAGS[l.code];
        const active = l.code === lang;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => setLang(l.code)}
            aria-label={l.label}
            aria-pressed={active}
            title={l.label}
            className={
              "flex h-7 w-8 items-center justify-center rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary " +
              (active
                ? "bg-primary/15 ring-1 ring-primary/60"
                : "opacity-60 hover:opacity-100 hover:bg-surface-2")
            }
          >
            <span className="overflow-hidden rounded-[2px]">
              <Flag />
            </span>
          </button>
        );
      })}
    </div>
  );
}
