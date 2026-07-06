import { createFileRoute } from "@tanstack/react-router";
import { getSessionServer } from "@/lib/discord-auth.server";

export const Route = createFileRoute("/api/auth/discord/logout")({
  server: {
    handlers: {
      POST: async () => {
        const session = await getSessionServer();
        await session.clear();
        return new Response(null, {
          status: 302,
          headers: { Location: "/admin", "Cache-Control": "no-store" },
        });
      },
      GET: async () => {
        const session = await getSessionServer();
        await session.clear();
        return new Response(null, {
          status: 302,
          headers: { Location: "/admin", "Cache-Control": "no-store" },
        });
      },
    },
  },
});
