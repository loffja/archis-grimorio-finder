import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

const SITE_URL = "https://www.bnotifier.es";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="surface-card max-w-md p-10 text-center">
        <div className="mono-label text-primary">404</div>
        <h1 className="mt-3 font-display text-3xl font-semibold">
          Sendero perdido en la niebla.
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Esta página no existe o ya no está disponible.
        </p>
        <a href="/" className="btn-primary mt-6 inline-flex hover:[&]:btn-primary-hover">
          Volver al inicio
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="surface-card max-w-md p-10 text-center">
        <h1 className="font-display text-2xl font-semibold text-primary">Algo se ha torcido</h1>
        <p className="mt-2 text-sm text-muted-foreground">Vuelve a intentarlo.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="btn-primary mt-6 hover:[&]:btn-primary-hover"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "DakuBot — Rastreador de archimonstruos de Dofus Touch" },
      {
        name: "description",
        content: "DakuBot rastrea archimonstruos de Dofus Touch en tiempo real: posiciones, servidor y nombre al instante con tu licencia.",
      },
      { property: "og:site_name", content: "DakuBot" },
      { property: "og:title", content: "DakuBot — Rastreador de archimonstruos de Dofus Touch" },
      {
        property: "og:description",
        content: "Posiciones de archimonstruos en tiempo real para Dofus Touch. Explora, canjea tu licencia y revela dónde están.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: `${SITE_URL}/og-image.PNG` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "DakuBot — Rastreador de archimonstruos de Dofus Touch" },
      {
        name: "twitter:description",
        content: "Posiciones de archimonstruos en tiempo real para Dofus Touch.",
      },
      { name: "twitter:image", content: `${SITE_URL}/og-image.PNG` },
      { name: "theme-color", content: "#0a0a0b" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "DakuBot" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/dakubot-icon.png" },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "canonical", href: SITE_URL },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
