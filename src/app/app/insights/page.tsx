import { getInsights, listVideos, listGraveyard } from "@/services";
import { requireSession } from "@/lib/session";
import { PageHeader } from "@/components/layout/shell";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui/card";
import { Sparkles, TrendingUp, TrendingDown, Trophy, AlertTriangle } from "lucide-react";

export default async function InsightsPage() {
  const session = await requireSession();
  const [insights, videos, graveyard] = await Promise.all([
    getInsights(session.userId),
    listVideos(session.userId, { status: "published" }),
    listGraveyard(session.userId),
  ]);

  const topGames = insights.byGame.slice(0, 5);
  const worstGames = [...insights.byGame].sort((a, b) => Number(b.ctr) - Number(a.ctr)).slice(-5).reverse();

  const grades = insights.titleGrades as { grade: string; total: number }[];
  const excellent = grades.find((g) => g.grade === "excellent")?.total ?? 0;
  const good = grades.find((g) => g.grade === "good")?.total ?? 0;
  const weak = grades.find((g) => g.grade === "weak")?.total ?? 0;
  const bad = grades.find((g) => g.grade === "bad")?.total ?? 0;
  const totalTitles = excellent + good + weak + bad;

  return (
    <div>
      <PageHeader
        badge="INTELLIGENCE · AUTO"
        title="Insights Automáticos"
        subtitle="Análises calculadas com base nos dados do seu sistema."
      />

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-acid" /> Top jogos por views
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topGames.length === 0 ? (
              <div className="text-sm text-muted">Publique vídeos com métricas.</div>
            ) : (
              <div className="space-y-2">
                {topGames.map((g, idx) => (
                  <div key={g.game} className="flex items-center gap-3 text-sm">
                    <div className="font-mono text-blood-bright w-6">#{idx + 1}</div>
                    <div className="flex-1 truncate">{g.game}</div>
                    <div className="font-mono text-xs">
                      {Number(g.views).toLocaleString("pt-BR")} views
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-blood-bright" /> Jogos para reconsiderar
            </CardTitle>
          </CardHeader>
          <CardContent>
            {worstGames.length === 0 ? (
              <div className="text-sm text-muted">Sem dados ainda.</div>
            ) : (
              <div className="space-y-2">
                {worstGames.map((g, idx) => (
                  <div key={g.game} className="flex items-center gap-3 text-sm">
                    <div className="font-mono text-dim w-6">#{idx + 1}</div>
                    <div className="flex-1 truncate">{g.game}</div>
                    <Badge variant={Number(g.ctr) < 3 ? "danger" : "warn"}>
                      CTR {Number(g.ctr).toFixed(1)}%
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <InsightCard
          icon={TrendingUp}
          label="Vídeos publicados"
          value={videos.length}
          hint="Total com status 'published'"
        />
        <InsightCard
          icon={TrendingDown}
          label="Falhas documentadas"
          value={graveyard.length}
          hint="Cemitério de ideias"
        />
        <InsightCard
          icon={Sparkles}
          label="Títulos analisados"
          value={totalTitles}
          hint={`${excellent} excelentes, ${good} bons, ${weak} fracos, ${bad} ruins`}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Distribuição de títulos por qualidade</CardTitle>
        </CardHeader>
        <CardContent>
          {totalTitles === 0 ? (
            <div className="text-sm text-muted">
              Cadastre títulos em "Banco de Títulos" para ver a distribuição.
            </div>
          ) : (
            <div className="space-y-3">
              <Bar label="Excelente (CTR ≥ 10%)" pct={(excellent / totalTitles) * 100} color="bg-emerald-500" />
              <Bar label="Bom (CTR 6-9.9%)" pct={(good / totalTitles) * 100} color="bg-acid" />
              <Bar label="Fraco (CTR 3-5.9%)" pct={(weak / totalTitles) * 100} color="bg-amber-500" />
              <Bar label="Ruim (CTR < 3%)" pct={(bad / totalTitles) * 100} color="bg-blood-bright" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function InsightCard({ icon: Icon, label, value, hint }: any) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded border border-border bg-bg flex items-center justify-center text-blood-bright">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
            {label}
          </div>
          <div className="text-xl font-bold">{value}</div>
          {hint && <div className="text-[10px] text-dim mt-0.5">{hint}</div>}
        </div>
      </CardContent>
    </Card>
  );
}

function Bar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span>{label}</span>
        <span className="font-mono">{pct.toFixed(0)}%</span>
      </div>
      <div className="h-2 rounded bg-card-2 overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
