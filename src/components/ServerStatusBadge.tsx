import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n";

/**
 * Decorative "live" server-status pill. Not tied to any real API — Dofus Touch
 * does not expose one publicly. Value drifts slightly to feel alive.
 */
export function ServerStatusBadge() {
  const { t, lang } = useLanguage();
  const [ping, setPing] = useState(28);
  const [players, setPlayers] = useState(3);

  useEffect(() => {
    const id = setInterval(() => {
      setPing((p) => Math.max(14, Math.min(52, p + (Math.random() * 8 - 4))));
      setPlayers(() => 1 + Math.floor(Math.random() * 5));
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={t("statusBadge_ariaLabel", { ping: Math.round(ping), players })}
      className="hidden items-center gap-3 rounded-full border border-border bg-surface-2/60 px-3 py-1.5 font-mono text-[0.7rem] sm:inline-flex"
    >
      <span className="flex items-center gap-1.5">
        <span className="live-dot" aria-hidden="true" />
        <span className="text-muted-foreground">{t("statusBadge_online")}</span>
      </span>
      <span className="h-3 w-px bg-border" aria-hidden="true" />
      <span className="text-primary">{Math.round(ping)}ms</span>
      <span className="h-3 w-px bg-border" aria-hidden="true" />
      <span className="text-foreground">{players.toLocaleString(lang === "es" ? "es-ES" : lang === "fr" ? "fr-FR" : "en-US")}</span>
      <span className="text-muted-foreground">{t("statusBadge_players")}</span>
    </div>
  );
}
