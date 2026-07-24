import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/potential/AppShell";

export const Route = createFileRoute("/app")({
  component: AppShell,
  head: () => ({
    meta: [
      { title: "Potential — Workspace" },
      { name: "description", content: "A calm, evidence-first workspace for hiring teams." },
      { property: "og:title", content: "Potential — Workspace" },
      { property: "og:description", content: "A calm, evidence-first workspace for hiring teams." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
