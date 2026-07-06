import { createFileRoute } from "@tanstack/react-router";
import {
  buildRedirectUri,
  exchangeCodeForToken,
  fetchDiscordUser,
  getSessionServer,
  isAdminId,
} from "@/lib/discord-auth.server";

function errorRedirect(reason: string) {
  const target = `/admin?error=${encodeURIComponent(reason)}`;
  return new Response(null, {
    status: 302,
    headers: { Location: target, "Cache-Control": "no-store" },
  });
}

export const Route = createFileRoute("/api/auth/discord/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");
        const errorParam = url.searchParams.get("error");

        if (errorParam) return errorRedirect(errorParam);
        if (!code || !state) return errorRedirect("missing_params");

        const session = await getSessionServer();
        const expectedState = session.data.oauthState;
        if (!expectedState || expectedState !== state) {
          return errorRedirect("invalid_state");
        }

        const clientId = process.env.DISCORD_CLIENT_ID;
        const clientSecret = process.env.DISCORD_CLIENT_SECRET;
        if (!clientId || !clientSecret) {
          return errorRedirect("server_misconfigured");
        }

        try {
          const token = await exchangeCodeForToken({
            code,
            clientId,
            clientSecret,
            redirectUri: buildRedirectUri(request),
          });
          const user = await fetchDiscordUser(token.access_token);

          if (!isAdminId(user.id)) {
            await session.clear();
            return errorRedirect("not_authorized");
          }

          await session.update({
            discordId: user.id,
            username: user.global_name || user.username,
            avatar: user.avatar,
            isAdmin: true,
            oauthState: undefined,
          });

          return new Response(null, {
            status: 302,
            headers: { Location: "/admin", "Cache-Control": "no-store" },
          });
        } catch (err) {
          console.error("Discord OAuth callback failed:", err);
          return errorRedirect("oauth_failed");
        }
      },
    },
  },
});
