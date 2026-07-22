import { useEffect, useState } from "react";

type Rates = { cop: number; eur: number };

const CACHE_KEY = "bnotifier-usd-rates";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 horas — la API en sí solo se actualiza 1 vez al día

// Tasas de respaldo, por si la API falla o el usuario está sin internet en el
// primer request. Se usan solo hasta que la llamada real responda.
const FALLBACK_RATES: Rates = { cop: 4000, eur: 0.92 };

function readCache(): Rates | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { rates: Rates; savedAt: number };
    if (Date.now() - parsed.savedAt > CACHE_TTL_MS) return null;
    return parsed.rates;
  } catch {
    return null;
  }
}

function writeCache(rates: Rates) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify({ rates, savedAt: Date.now() }));
  } catch {
    // Si falla el guardado (modo privado, cuota llena, etc.), no pasa nada grave.
  }
}

/**
 * Tasas de cambio USD → COP / USD → EUR en vivo, vía la API pública y sin
 * clave de exchangerate-api.com (open.er-api.com). Se cachean en localStorage
 * por unas horas para no golpear la API en cada carga de página.
 */
export function useExchangeRates(): { rates: Rates; loading: boolean } {
  const [rates, setRates] = useState<Rates>(() => readCache() ?? FALLBACK_RATES);
  const [loading, setLoading] = useState(() => readCache() === null);

  useEffect(() => {
    const cached = readCache();
    if (cached) {
      setRates(cached);
      setLoading(false);
      return;
    }

    let cancelled = false;
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data?.rates?.COP || !data?.rates?.EUR) return;
        const fresh: Rates = { cop: data.rates.COP, eur: data.rates.EUR };
        setRates(fresh);
        writeCache(fresh);
      })
      .catch(() => {
        // Si falla, nos quedamos con el valor de respaldo ya seteado.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { rates, loading };
}

/** Redondea hacia arriba, para que el precio convertido nunca quede por debajo del real. */
export function formatConverted(amountUsd: number, rate: number): string {
  const value = amountUsd * rate;
  if (rate > 100) {
    // Monedas de alto valor nominal (COP, etc.): redondea hacia arriba al millar.
    return (Math.ceil(value / 1000) * 1000).toLocaleString("es-CO");
  }
  // Monedas de bajo valor nominal (EUR, etc.): redondea hacia arriba, con 2 decimales.
  return (Math.ceil(value * 100) / 100).toFixed(2);
}
