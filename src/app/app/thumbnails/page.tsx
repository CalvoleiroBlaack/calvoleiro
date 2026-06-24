import { listThumbnailTests } from "@/services";
import { requireSession } from "@/lib/session";
import { PageHeader } from "@/components/layout/shell";
import { ThumbnailsBoard } from "./board";

export default async function ThumbnailsPage() {
  const session = await requireSession();
  const tests = await listThumbnailTests(session.userId);
  return (
    <div>
      <PageHeader
        badge="LAB · A/B"
        title="Laboratório de Thumbnails"
        subtitle="Compare A vs B. Descubra padrões de clique."
      />
      <ThumbnailsBoard tests={tests} />
    </div>
  );
}
