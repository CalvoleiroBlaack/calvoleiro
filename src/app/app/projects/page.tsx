import { requireSession } from "@/lib/session";
import { listProjects } from "@/services/calvoleiro";
import { PageHeader } from "@/components/layout/shell";
import { ProjectsBoard } from "./board";

export default async function ProjectsPage() {
  const session = await requireSession();
  const projects = await listProjects(session.userId);
  return (
    <div>
      <PageHeader
        badge="WORKSPACE · PROJECTS"
        title="Projetos"
        subtitle="Cada iniciativa em seu próprio universo. Conecte ideias, jogos, links e assets."
      />
      <ProjectsBoard projects={projects} />
    </div>
  );
}
