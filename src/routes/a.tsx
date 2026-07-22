import { createFileRoute, redirect } from "@tanstack/react-router";

// Atajo corto: bnotifier.es/a en vez de bnotifier.es/admin.
export const Route = createFileRoute("/a")({
  beforeLoad: () => {
    throw redirect({ to: "/admin" });
  },
});
