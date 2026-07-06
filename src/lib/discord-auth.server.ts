// Server-only Discord OAuth helpers. Never import this from client code.
import { useSession } from "@tanstack/react-start/server";

// Discord user IDs allowed to access /admin. Edit this list to grant/revoke.
export const ALLOWED_ADMIN_DISCORD_IDS = new Set<string>([
  "1274774061020483668",
]);

export const DISCORD_SCOPES = "identify";

export type AdminSessionData = {
  discordId?: string;
  username?: string;
  avatar?: string | null;
  isAdmin?: boolean;
  // OAuth state (short-lived) stored in the same session cookie
  oauthState?: string;
};

export const sessionConfig = {
  password: process.env.SESSION_SECRET!,
  name: "dakubot-session",
  maxAge: 60 * 60 * 24 * 30, // 30 days
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
  },
};

export async function getSessionServer() {
  return useSession<AdminSessionData>(sessionConfig);
}

export function isAdminId(id: string | undefined | null): boolean {
  if (!id) return false;
  return ALLOWED_ADMIN_DISCORD_IDS.has(id);
}

export function buildDiscordAuthorizeUrl(params: {
  clientId: string;
  redirectUri: string;
  state: string;
}) {
  const url = new URL("https://discord.com/oauth2/authorize");
  url.searchParams.set("client_id", params.clientId);
  url.searchParams.set("redirect_uri", params.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", DISCORD_SCOPES);
  url.searchParams.set("state", params.state);
  url.searchParams.set("prompt", "consent");
  return url.toString();
}

export async function exchangeCodeForToken(params: {
  code: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}) {
  const body = new URLSearchParams({
    client_id: params.clientId,
    client_secret: params.clientSecret,
    grant_type: "authorization_code",
    code: params.code,
    redirect_uri: params.redirectUri,
  });
  const res = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Discord token exchange failed [${res.status}]: ${errText}`);
  }
  return (await res.json()) as {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
  };
}

export async function fetchDiscordUser(accessToken: string) {
  const res = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Discord user fetch failed [${res.status}]: ${errText}`);
  }
  return (await res.json()) as {
    id: string;
    username: string;
    global_name?: string | null;
    avatar: string | null;
  };
}

export function buildRedirectUri(request: Request): string {
  const url = new URL(request.url);
  return `${url.origin}/api/auth/discord/callback`;
}
