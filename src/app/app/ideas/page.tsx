import { listIdeas, listGames } from "@/services";
import { requireSession } from "@/lib/session";
import { PageHeader } from "@/components/layout/shell";
import { IdeasBoard } from "./board";

export default async function IdeasPage() {
  const session = await requireSession();
  const [ideas, games] = await Promise.all([
    listIdeas(session.userId),
    listGames(session.userId),
  ]);
  return (
    <div>
      <PageHeader
        badge="IDEAS · BANK"
        title="Banco de Ideias"
        subtitle="Cadastre, filtre e priorize. O sistema calcula o Priority Score automaticamente."
      />
      <IdeasBoard ideas={ideas} games={games} />
    </div>
  );
}
