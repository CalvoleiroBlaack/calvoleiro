import { listGames } from "@/services";
import { requireSession } from "@/lib/session";
import { PageHeader } from "@/components/layout/shell";
import { GamesBoard } from "./board";

export default async function GamesPage() {
  const session = await requireSession();
  const games = await listGames(session.userId);
  return (
    <div>
      <PageHeader
        badge="LIBRARY · GAMES"
        title="Biblioteca de Jogos"
        subtitle="Catálogo de todos os jogos do sistema. Terror, FNAF, Analog Horror e mais."
      />
      <GamesBoard games={games} />
    </div>
  );
}
