#!/usr/bin/env bash
set -e
echo "Limpiando archivos de backend que quedaron mezclados en el repo del frontend..."

git rm --cached -q src/turnstile.js 2>/dev/null || rm -f src/turnstile.js
git rm --cached -q src/webhook.js 2>/dev/null || rm -f src/webhook.js
git rm --cached -q src/models/Licencia.js 2>/dev/null || rm -f src/models/Licencia.js
git rm --cached -q src/routes/licencia.routes.js 2>/dev/null || rm -f src/routes/licencia.routes.js
git rm --cached -q src/routes/promo.routes.js 2>/dev/null || rm -f src/routes/promo.routes.js

# Borra también la carpeta models si quedó vacía
rmdir src/models 2>/dev/null || true

rm -f src/turnstile.js src/webhook.js src/models/Licencia.js src/routes/licencia.routes.js src/routes/promo.routes.js

echo "  OK borrados los 5 archivos de backend"

git add -A
git commit -m "Remove backend files accidentally committed to the frontend repo"
git push
echo "Listo. src/components/Turnstile.tsx (el del frontend) se dejó intacto."
