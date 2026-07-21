import { useEffect, useRef, useState } from "react";
import { LANGUAGES, useLanguage } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];
  const others = LANGUAGES.filter((l) => l.code !== lang);

  return (
    <div ref={wrapperRef} className="relative flex items-center">
      <div className="flex items-center overflow-hidden rounded-full border border-border bg-surface-2/40">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="true"
          aria-label={t("languageSelectorLabel")}
          title={current.label}
          className="flex h-8 w-9 items-center justify-center text-base leading-none transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span aria-hidden="true">{current.flag}</span>
        </button>
        <div
          className="flex items-center transition-[max-width,opacity] duration-200 ease-out"
          style={{
            maxWidth: open ? `${others.length * 36}px` : "0px",
            opacity: open ? 1 : 0,
            overflow: "hidden",
          }}
        >
          {others.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => {
                setLang(l.code);
                setOpen(false);
              }}
              aria-label={l.label}
              title={l.label}
              tabIndex={open ? 0 : -1}
              className="flex h-8 w-9 shrink-0 items-center justify-center border-l border-border text-base leading-none transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span aria-hidden="true">{l.flag}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
