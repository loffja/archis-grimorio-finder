// Verifica el token de Cloudflare Turnstile contra la API de Cloudflare
// antes de dejar pasar una petición sensible (revelar posición, canjear
// código). La clave secreta vive SOLO en TURNSTILE_SECRET_KEY (variable de
// entorno) — nunca en el código.
//
// Mientras esa variable no esté configurada, esta función deja pasar todo
// sin verificar nada — así el sitio sigue funcionando normal durante la
// activación gradual de Turnstile, sin tener que coordinar un despliegue
// exacto entre frontend y backend.
const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstile(token, remoteIp) {
    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (!secret) {
        return { ok: true, skipped: true };
    }

    if (!token || typeof token !== 'string') {
        return { ok: false, skipped: false };
    }

    try {
        const body = new URLSearchParams({ secret, response: token });
        if (remoteIp) body.append('remoteip', remoteIp);

        const res = await fetch(VERIFY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body
        });
        const data = await res.json();
        return { ok: data.success === true, skipped: false };
    } catch (error) {
        console.error('Error al verificar Turnstile:', error);
        // Si Cloudflare está caído, no le negamos el servicio a gente real
        // por un problema ajeno — se deja pasar, igual que "skipped".
        return { ok: true, skipped: true, errored: true };
    }
}
