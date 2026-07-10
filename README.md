# DakuBot — Archis Grimorio Finder (bnotifier.es)

Frontend de DakuBot: rastreador de archimonstruos en tiempo real para Dofus
Touch. Generado originalmente con Lovable (TanStack Start), desplegado en
Vercel.

## Páginas

| Ruta | Qué hace | Acceso |
|---|---|---|
| `/` | Home — presentación, precio de entrada, radar visual | Público |
| `/live` | Archimonstruos activos en tiempo real (SSE). Muestra una demo rotando con datos reales del juego mientras no hay archimonstruos activos de verdad | Público |
| `/price` | Planes y precios, con prueba en vivo de las estadísticas reales | Público |
| `/join` | Invitación a Discord + qué pasa después de entrar | Público |
| `/payment` | Métodos de pago aceptados (sin publicar datos sensibles) | Público |
| `/redeem` | Canjear un código promocional por una licencia | Público |
| `/referral` | Explica el programa de referidos | Público |
| `/my-license` | Consulta el estado de tu licencia y recupera tu código de referido en cualquier momento | Público |
| `/position/$id` | Introduce tu licencia y revela la posición de un archimonstruo | Público (necesita licencia válida) |
| `/how-it-works` | Guía rápida de uso | Público |
| `/terms` | Aviso legal | Público |
| `/admin` | Panel de administración completo (licencias, promos, estadísticas, registro de actividad, interruptor de emergencia, gestión de administradores) | Protegido, login con clave de admin |

## Sobre las URLs de la API

**No usa variables de entorno.** Las llamadas al backend
(`https://api.bnotifier.es/...`) están escritas directamente en cada archivo
de `src/routes/`. Si el dominio del backend cambia algún día, hay que buscar
y reemplazar manualmente en cada uno de esos archivos.

## Componentes clave

```
src/
  components/
    Layout.tsx            # header, menú de navegación, footer
    SystemStatus.tsx       # indicador de "sistema operativo" en el footer
    ServerStatusBadge.tsx  # (generado por Lovable)

  routes/
    __root.tsx             # meta tags, SEO, PWA, manejo de errores/404
    ...(ver tabla de páginas arriba)

public/
  manifest.json             # PWA — instalable en pantalla de inicio
  apple-touch-icon.png       # ícono con fondo sólido para "Añadir a inicio"
  og-image.PNG                # imagen de vista previa al compartir el link
  robots.txt / sitemap.xml    # SEO
```

## Desarrollo local

Este proyecto usa TanStack Start (Vite + Nitro). Para ejecutarlo localmente
necesitas Node.js y `bun` o `npm`:

```bash
bun install   # o npm install
bun run dev   # o npm run dev
```

## Desplegar en Vercel

1. Conecta este repositorio en [vercel.com](https://vercel.com).
2. Vercel detecta la configuración de Vite/Nitro automáticamente — no hace
   falta configurar variables de entorno.
3. Dominio propio: **Settings → Domains** → añade `bnotifier.es` y
   `www.bnotifier.es`, y sigue las instrucciones de DNS que te da Vercel.

### Si un cambio no se refleja tras un deploy

Compara el hash del commit más reciente en GitHub contra el que Vercel dice
haber desplegado (en **Deployments**). Si no coinciden, fuerza un
**Redeploy** sin usar caché.

## Backend

El backend vive en un repositorio aparte: `archis-touch-api` (Node/Express,
desplegado en Render). Ver su propio README para endpoints, variables de
entorno, y arquitectura completa.
