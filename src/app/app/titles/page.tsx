import { listTitles } from "@/services";
import { requireSession } from "@/lib/session";
import { PageHeader } from "@/components/layout/shell";
import { TitlesBoard } from "./board";

export default async function TitlesPage() {
  const session = await requireSession();
  const titles = await listTitles(session.userId);
  return (
    <div>
      <PageHeader
        badge="TITLES · BANK"
        title="Banco de Títulos"
        subtitle="Registre e classifique cada título pelo CTR. Descubra padrões vencedores."
      />
      <TitlesBoard titles={titles} />
    </div>
  );
}
