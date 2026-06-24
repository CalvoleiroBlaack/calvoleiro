import {
  listVideos,
  listGames,
  getDashboardStats,
  getMonthlyProduction,
  getPerformanceByGame,
} from "@/services";
import { requireSession } from "@/lib/session";
import { PageHeader } from "@/components/layout/shell";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from "@/components/ui/card";
import { formatNumber, formatPercent } from "@/lib/utils";
import { VIDEO_STATUS_LABELS, GENRE_LABELS, CHANNEL_LABELS } from "@/types";
import { ProductionBoard } from "./board";

export default async function ProductionPage() {
  const session = await requireSession();
  const [videos, games] = await Promise.all([
    listVideos(session.userId),
    listGames(session.userId),
  ]);

  return (
    <div>
      <PageHeader
        badge="KANBAN · PRODUCTION"
        title="Centro de Produção"
        subtitle="Arraste os cards entre as 9 colunas. Cada vídeo é uma missão."
      />
      <ProductionBoard videos={videos} games={games} />
    </div>
  );
}
