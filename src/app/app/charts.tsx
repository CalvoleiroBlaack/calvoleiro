import { getMonthlyProduction, getPerformanceByGame } from "@/services";
import { requireSession } from "@/lib/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartsClient } from "./charts-client";

export async function DashboardCharts({
  monthly,
}: {
  monthly: { month: string; total: string }[];
}) {
  const session = await requireSession();
  const byGame = await getPerformanceByGame(session.userId);

  const productionData = monthly.map((m) => ({
    month: m.month,
    videos: Number(m.total),
  }));

  const gamePerfData = byGame.map((g) => ({
    game: g.game.length > 14 ? g.game.slice(0, 14) + "…" : g.game,
    ctr: Number(Number(g.ctr).toFixed(2)),
    retention: Number(Number(g.retention).toFixed(2)),
    views: Number(g.views),
    subs: Number(g.subscribers),
  }));

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Produção Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          {productionData.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-sm text-muted">
              Sem publicações ainda.
            </div>
          ) : (
            <ChartsClient type="production" data={productionData} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance por Jogo</CardTitle>
        </CardHeader>
        <CardContent>
          {gamePerfData.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-sm text-muted">
              Publique vídeos com métricas para visualizar.
            </div>
          ) : (
            <ChartsClient type="games" data={gamePerfData} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
