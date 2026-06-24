import { listGraveyard, listGames } from "@/services";
import { requireSession } from "@/lib/session";
import { PageHeader } from "@/components/layout/shell";
import { GraveyardBoard } from "./board";

export default async function GraveyardPage() {
  const session = await requireSession();
  const [entries, games] = await Promise.all([
    listGraveyard(session.userId),
    listGames(session.userId),
  ]);
  return (
    <div>
      <PageHeader
        badge="GRAVEYARD · LEARN"
        title="Cemitério de Ideias"
        subtitle="Onde os fracassos descansam — para que você não os repita."
      />
      <GraveyardBoard entries={entries} games={games} />
    </div>
  );
}
