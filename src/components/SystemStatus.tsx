import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n";

type Status = "checking" | "online" | "offline";

const CHECK_INTERVAL_MS = 30_000;
const TIMEOUT_MS = 6_000;

export function SystemStatus() {
  const { t } = useLanguage();
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    let cancelled = false;

    async function check() {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
      try {
        const res = await fetch("https://api.bnotifier.es/", {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!cancelled) setStatus(res.ok ? "online" : "offline");
      } catch {
        if (!cancelled) setStatus("offline");
      } finally {
        clearTimeout(timeout);
      }
    }

    check();
    const id = setInterval(check, CHECK_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const label =
    status === "online" ? t("systemStatus_operational") : status === "offline" ? t("systemStatus_down") : t("systemStatus_checking");

  const dotStyle =
    status === "online"
      ? { background: "var(--success)" }
      : status === "offline"
        ? { background: "var(--destructive)" }
        : { background: "var(--muted-foreground)" };

  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] text-muted-foreground">
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full"
        style={dotStyle}
      />
      {label}
    </span>
  );
}
