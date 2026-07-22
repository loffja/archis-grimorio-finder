import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        }
      ) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
export const TURNSTILE_ENABLED = Boolean(SITE_KEY);
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

let scriptPromise: Promise<void> | null = null;
function loadTurnstileScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("No se pudo cargar Turnstile"));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

/**
 * Widget anti-bot de Cloudflare Turnstile. Si no hay VITE_TURNSTILE_SITE_KEY
 * configurada (todavía no se activó en Cloudflare), este componente no
 * renderiza nada y no bloquea el formulario — así el sitio sigue funcionando
 * normal mientras se termina de configurar.
 */
export function Turnstile({ onVerify }: { onVerify: (token: string | null) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!SITE_KEY) return;
    let cancelled = false;
    loadTurnstileScript()
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch(() => {
        // Si Turnstile no carga (bloqueador de anuncios, red, etc.), no
        // impedimos el uso del formulario — mejor eso que dejar a todo el
        // mundo sin poder usar el sitio por un script de terceros caído.
        onVerify(null);
      });
    return () => {
      cancelled = true;
    };
  }, [onVerify]);

  useEffect(() => {
    if (!ready || !containerRef.current || !window.turnstile || !SITE_KEY) return;
    window.turnstile.render(containerRef.current, {
      sitekey: SITE_KEY,
      theme: "dark",
      callback: (token) => onVerify(token),
      "expired-callback": () => onVerify(null),
      "error-callback": () => onVerify(null),
    });
  }, [ready, onVerify]);

  if (!SITE_KEY) return null;

  return <div ref={containerRef} className="flex justify-center" />;
}
