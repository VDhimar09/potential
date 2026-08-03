import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/potential/AppShell";
import { workspaceService } from "@/services/workspaceService";
import { candidateService } from "@/services/candidateService";

export const Route = createFileRoute("/app")({
  component: AppLayout,
  beforeLoad: async () => {
    const workspace = await workspaceService.getOrCreateDefaultWorkspace();
    return { workspaceId: workspace.id };
  },
  loader: async ({ context }) => {
    const candidates = await candidateService.listCandidates({
      workspaceId: context.workspaceId,
    });
    return { recentCandidates: candidates.slice(0, 5) };
  },
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

function AppLayout() {
  const { recentCandidates } = Route.useLoaderData();
  return <AppShell recentCandidates={recentCandidates} />;
}
