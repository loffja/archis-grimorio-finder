import { createServerFn } from "@tanstack/react-start";

export type AdminSessionInfo =
  | { isAdmin: false; user: null }
  | {
      isAdmin: true;
      user: { discordId: string; username: string; avatar: string | null };
    };

export const getAdminSession = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminSessionInfo> => {
    const { getSessionServer, isAdminId } = await import("./discord-auth.server");
    const session = await getSessionServer();
    const { discordId, username, avatar, isAdmin } = session.data;
    if (!isAdmin || !discordId || !isAdminId(discordId)) {
      return { isAdmin: false, user: null };
    }
    return {
      isAdmin: true,
      user: { discordId, username: username ?? "admin", avatar: avatar ?? null },
    };
  },
);

export const logoutAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const { getSessionServer } = await import("./discord-auth.server");
  const session = await getSessionServer();
  await session.clear();
  return { ok: true as const };
});
