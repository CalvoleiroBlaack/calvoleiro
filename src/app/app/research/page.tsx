import { requireSession } from "@/lib/session";
import { listResearchItems, listProjects } from "@/services/calvoleiro";
import { PageHeader } from "@/components/layout/shell";
import { ResearchBoard } from "./board";

export default async function ResearchPage() {
  const session = await requireSession();
  const [items, projects] = await Promise.all([
    listResearchItems(session.userId),
    listProjects(session.userId),
  ]);
  return (
    <div>
      <PageHeader
        badge="WORKSPACE · RESEARCH"
        title="Centro de Pesquisa"
        subtitle="Artigos, vídeos, tweets, threads. Tudo organizado para revisão profunda."
      />
      <ResearchBoard items={items} projects={projects} />
    </div>
  );
}
