import { listAssets } from "@/services";
import { requireSession } from "@/lib/session";
import { PageHeader } from "@/components/layout/shell";
import { AssetsBoard } from "./board";

export default async function AssetsPage() {
  const session = await requireSession();
  const items = await listAssets(session.userId);
  return (
    <div>
      <PageHeader
        badge="LIBRARY · ASSETS"
        title="Biblioteca de Assets"
        subtitle="Thumbnails, sons, memes, vídeos, efeitos e músicas. Tudo em um só lugar."
      />
      <AssetsBoard assets={items} />
    </div>
  );
}
