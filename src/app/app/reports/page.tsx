import {
  listVideos,
  listIdeas,
  listGames,
  listGraveyard,
  listTitles,
  listResearch,
  listThumbnailTests,
  getDashboardStats,
} from "@/services";
import { requireSession } from "@/lib/session";
import { PageHeader } from "@/components/layout/shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DownloadButton } from "./download";

export default async function ReportsPage() {
  const session = await requireSession();
  const [videos, ideas, games, graveyard, titles, research, thumbs, stats] =
    await Promise.all([
      listVideos(session.userId),
      listIdeas(session.userId),
      listGames(session.userId),
      listGraveyard(session.userId),
      listTitles(session.userId),
      listResearch(session.userId),
      listThumbnailTests(session.userId),
      getDashboardStats(session.userId),
    ]);

  return (
    <div>
      <PageHeader
        badge="EXPORT · REPORTS"
        title="Relatórios"
        subtitle="Exporte seus dados para analisar em outras ferramentas."
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        <ReportCard
          title="Vídeos"
          description="Todos os vídeos do sistema com status, jogo e canal."
          data={videos.map((v) => ({
            id: v.id,
            title: v.title,
            status: v.status,
            type: v.type,
            channel: v.channel,
            priority: v.priority,
            scheduled: v.scheduledAt,
            published: v.publishedAt,
          }))}
          filename="videos"
          count={videos.length}
        />
        <ReportCard
          title="Ideias"
          description="Banco de ideias com scores e potenciais."
          data={ideas.map((i) => ({
            id: i.id,
            title: i.title,
            type: i.type,
            channel: i.channel,
            priority_score: i.priorityScore,
            potential_views: i.potentialViews,
            potential_subs: i.potentialSubs,
            potential_retention: i.potentialRetention,
            hype: i.hypeLevel,
          }))}
          filename="ideias"
          count={ideas.length}
        />
        <ReportCard
          title="Jogos"
          description="Biblioteca de jogos cadastrados."
          data={games.map((g) => ({
            id: g.id,
            name: g.name,
            genre: g.genre,
            platform: g.platform,
            channel: g.channel,
            status: g.status,
            videos: g.videoCount,
            growth: g.growthPotential,
          }))}
          filename="jogos"
          count={games.length}
        />
        <ReportCard
          title="Títulos"
          description="Títulos com CTR e classificação automática."
          data={titles.map((t) => ({
            title: t.title,
            ctr: t.ctr,
            grade: t.grade,
            channel: t.channel,
          }))}
          filename="titulos"
          count={titles.length}
        />
        <ReportCard
          title="Cemitério"
          description="Vídeos fracassados documentados."
          data={graveyard.map((g) => ({
            title: g.title,
            views: g.views,
            ctr: g.ctr,
            retention: g.retention,
            reason: g.failureReason,
          }))}
          filename="cemiterio"
          count={graveyard.length}
        />
        <ReportCard
          title="Pesquisas"
          description="Centro de pesquisa e tendências."
          data={research.map((r) => ({
            title: r.title,
            category: r.category,
            url: r.url,
            notes: r.notes,
            pinned: r.pinned,
          }))}
          filename="pesquisas"
          count={research.length}
        />
        <ReportCard
          title="Thumbnails A/B"
          description="Testes A/B registrados."
          data={thumbs.map((t) => ({
            title: t.title,
            ctr_a: t.ctrA,
            ctr_b: t.ctrB,
            impressions_a: t.impressionsA,
            impressions_b: t.impressionsB,
            winner: t.winner,
          }))}
          filename="thumbnails"
          count={thumbs.length}
        />
        <ReportCard
          title="Dashboard Stats"
          description="Resumo geral de métricas."
          data={[stats]}
          filename="dashboard"
          count={1}
        />
      </div>
    </div>
  );
}

function ReportCard({
  title,
  description,
  data,
  filename,
  count,
}: {
  title: string;
  description: string;
  data: any[];
  filename: string;
  count: number;
}) {
  return (
    <Card className="hover:border-blood-dark transition-colors">
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3>
          <span className="font-mono text-[10px] uppercase tracking-widest text-blood-bright">
            {count} items
          </span>
        </div>
        <p className="text-xs text-muted">{description}</p>
        <div className="flex gap-2 pt-2">
          <DownloadButton
            data={data}
            filename={filename}
            format="csv"
            label="CSV"
          />
          <DownloadButton
            data={data}
            filename={filename}
            format="json"
            label="JSON"
          />
        </div>
      </div>
    </Card>
  );
}
