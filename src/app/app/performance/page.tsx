import { listVideos, listGames } from "@/services";
import { db } from "@/db";
import { performance } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireSession } from "@/lib/session";
import { PageHeader } from "@/components/layout/shell";
import { PerformanceBoard } from "./board";

export default async function PerformancePage() {
  const session = await requireSession();
  const [videos, games, perfRows] = await Promise.all([
    listVideos(session.userId, { status: "published" }),
    listGames(session.userId),
    db.select().from(performance),
  ]);
  return (
    <div>
      <PageHeader
        badge="ANALYTICS · PERFORMANCE"
        title="Centro de Performance"
        subtitle="Registre views, CTR, retenção e inscritos por vídeo publicado."
      />
      <PerformanceBoard videos={videos} games={games} performance={perfRows} />
    </div>
  );
}
