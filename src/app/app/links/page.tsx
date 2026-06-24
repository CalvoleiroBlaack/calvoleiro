import { requireSession } from "@/lib/session";
import { listLinks, listProjects } from "@/services/calvoleiro";
import { PageHeader } from "@/components/layout/shell";
import { LinksBoard } from "./board";

export default async function LinksPage() {
  const session = await requireSession();
  const [links, projects] = await Promise.all([
    listLinks(session.userId),
    listProjects(session.userId),
  ]);
  return (
    <div>
      <PageHeader
        badge="WORKSPACE · LINKS"
        title="Biblioteca de Links"
        subtitle="Salve qualquer URL. Organize por pastas, tags e projetos."
      />
      <LinksBoard links={links} projects={projects} />
    </div>
  );
}
