import { createFileRoute } from "@tanstack/react-router";
import {
  buildDiscordAuthorizeUrl,
  buildRedirectUri,
  getSessionServer,
} from "@/lib/discord-auth.server";

export const Route = createFileRoute("/api/auth/discord/login")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const clientId = process.env.DISCORD_CLIENT_ID;
        if (!clientId) {
          return new Response("Discord OAuth is not configured (missing DISCORD_CLIENT_ID)", {
            status: 500,
          });
        }
        const session = await getSessionServer();
        const state = crypto.randomUUID();
        await session.update({ ...session.data, oauthState: state });
        const authorizeUrl = buildDiscordAuthorizeUrl({
          clientId,
          redirectUri: buildRedirectUri(request),
          state,
        });
        return new Response(null, {
          status: 302,
          headers: { Location: authorizeUrl, "Cache-Control": "no-store" },
        });
      },
    },
  },
});
