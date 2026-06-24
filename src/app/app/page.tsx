import Link from "next/link";
import { requireSession } from "@/lib/session";
import { getUserById } from "@/services";
import {
  listProjects,
  listLinks,
  listReminders,
  listResearchItems,
  getBrainStats,
  listActivity,
} from "@/services/calvoleiro";
import { listIdeas, listVideos } from "@/services";
import { PageHeader } from "@/components/layout/shell";
import { Card, Badge, EmptyState } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FolderKanban,
  Link as LinkIcon,
  Lightbulb,
  Film,
  Bell,
  Sparkles,
  Gamepad2,
  Calendar,
  ArrowUpRight,
  Plus,
  Clock,
  TrendingUp,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await requireSession();
  const [user, projects, links, reminders, ideas, videos, stats, research] =
    await Promise.all([
      getUserById(session.userId),
      listProjects(session.userId),
      listLinks(session.userId),
      listReminders(session.userId),
      listIdeas(session.userId),
      listVideos(session.userId),
      getBrainStats(session.userId),
      listResearchItems(session.userId),
    ]);

  const pendingReminders = reminders.filter((r) => r.status === "pending");
  const recentLinks = links.slice(0, 6);
  const activeProjects = projects.filter((p) => p.status === "active").slice(0, 4);
  const topIdeas = ideas.slice(0, 4);
  const upcoming = videos
    .filter((v) => v.status !== "published")
    .slice(0, 4);
  const recentResearch = research.slice(0, 4);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 6) return "Boa madrugada";
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  })();

  const firstName = user?.name.split(" ")[0] ?? "Allan";

  return (
    <div>
      <PageHeader
        badge="DASHBOARD"
        title={`${greeting}, ${firstName}.`}
        subtitle="Sua central de comando. Tudo conectado, tudo acessível."
        actions={
          <Link href="/app/projects">
            <Button variant="primary" size="sm">
              <Plus className="h-3.5 w-3.5" /> Novo projeto
            </Button>
          </Link>
        }
      />

      {/* Brain stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
        {[
          { label: "Projetos", value: stats.projects, icon: FolderKanban, href: "/app/projects" },
          { label: "Ideias", value: stats.ideas, icon: Lightbulb, href: "/app/ideas" },
          { label: "Links", value: stats.links, icon: LinkIcon, href: "/app/links" },
          { label: "Jogos", value: stats.games, icon: Gamepad2, href: "/app/games" },
          { label: "Vídeos", value: stats.videos, icon: Film, href: "/app/production" },
          { label: "Pesquisas", value: stats.research, icon: Sparkles, href: "/app/research" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="cl-glass rounded-lg p-3 hover:border-border-strong transition-all cl-lift group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <Icon className="h-3.5 w-3.5 text-muted group-hover:text-neon transition-colors" />
                <ArrowUpRight className="h-3 w-3 text-dim group-hover:text-neon transition-colors" />
              </div>
              <div className="text-xl font-semibold text-fg">{s.value}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted">
                {s.label}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Widgets grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Projects widget */}
        <Widget
          className="col-span-12 lg:col-span-8"
          title="Projetos ativos"
          subtitle={`${activeProjects.length} em andamento`}
          icon={FolderKanban}
          href="/app/projects"
        >
          {activeProjects.length === 0 ? (
            <EmptyMini text="Nenhum projeto ativo." cta="Criar projeto" href="/app/projects" />
          ) : (
            <div className="grid sm:grid-cols-2 gap-2">
              {activeProjects.map((p) => (
                <Link
                  key={p.id}
                  href={`/app/projects`}
                  className="group rounded-lg p-3 bg-surface/40 border border-border hover:border-border-strong hover:bg-surface transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="h-7 w-7 rounded-md flex items-center justify-center text-white text-xs font-semibold"
                      style={{
                        background: `linear-gradient(135deg, ${p.color}, ${p.color}99)`,
                      }}
                    >
                      {p.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{p.name}</div>
                      <div className="text-[10px] text-muted truncate">
                        {p.description ?? "—"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="royal">{p.status}</Badge>
                    <span className="text-[10px] text-dim font-mono">
                      {formatDate(p.updatedAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Widget>

        {/* Reminders widget */}
        <Widget
          className="col-span-12 lg:col-span-4"
          title="Lembretes"
          subtitle={`${pendingReminders.length} pendentes`}
          icon={Bell}
          href="/app/reminders"
        >
          {pendingReminders.length === 0 ? (
            <EmptyMini text="Sem lembretes." cta="Criar" href="/app/reminders" />
          ) : (
            <div className="space-y-1.5">
              {pendingReminders.slice(0, 5).map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-2 px-2 py-1.5 rounded bg-surface/40"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-neon flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] truncate">{r.title}</div>
                    {r.dueAt && (
                      <div className="text-[10px] text-muted flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        {formatDate(r.dueAt)}
                      </div>
                    )}
                  </div>
                  <Badge
                    variant={
                      r.priority === "critical" || r.priority === "high"
                        ? "danger"
                        : "muted"
                    }
                  >
                    {r.priority}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Widget>

        {/* Recent links */}
        <Widget
          className="col-span-12 lg:col-span-6"
          title="Últimos links salvos"
          subtitle={`${stats.links} no total`}
          icon={LinkIcon}
          href="/app/links"
        >
          {recentLinks.length === 0 ? (
            <EmptyMini text="Sem links ainda." cta="Salvar" href="/app/links" />
          ) : (
            <div className="space-y-1.5">
              {recentLinks.map((l) => (
                <a
                  key={l.id}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 px-2 py-1.5 rounded hover:bg-surface/60 transition-colors"
                >
                  <div className="h-7 w-7 rounded bg-surface-2 border border-border flex items-center justify-center text-neon flex-shrink-0">
                    <LinkIcon className="h-3 w-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-medium truncate">
                      {l.title ?? l.url}
                    </div>
                    <div className="text-[10px] text-muted truncate">
                      {l.siteName ?? new URL(l.url).hostname}
                    </div>
                  </div>
                  <ArrowUpRight className="h-3 w-3 text-dim group-hover:text-neon" />
                </a>
              ))}
            </div>
          )}
        </Widget>

        {/* Top ideas */}
        <Widget
          className="col-span-12 lg:col-span-6"
          title="Top ideias · Priority Score"
          subtitle={`${stats.ideas} no banco`}
          icon={Lightbulb}
          href="/app/ideas"
        >
          {topIdeas.length === 0 ? (
            <EmptyMini text="Nenhuma ideia." cta="Adicionar" href="/app/ideas" />
          ) : (
            <div className="space-y-1.5">
              {topIdeas.map((i, idx) => (
                <div
                  key={i.id}
                  className="flex items-center gap-3 px-2 py-1.5 rounded hover:bg-surface/60"
                >
                  <div className="font-mono text-[10px] text-neon w-5">
                    #{idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] truncate">{i.title}</div>
                    <div className="text-[10px] text-muted">
                      {i.type} · {i.channel}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm font-semibold cl-gradient-text">
                      {i.priorityScore}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Widget>

        {/* Upcoming videos */}
        <Widget
          className="col-span-12 lg:col-span-6"
          title="Vídeos em produção"
          subtitle={`${upcoming.length} no pipeline`}
          icon={Film}
          href="/app/production"
        >
          {upcoming.length === 0 ? (
            <EmptyMini text="Sem vídeos em produção." cta="Criar" href="/app/production" />
          ) : (
            <div className="space-y-1.5">
              {upcoming.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center gap-3 px-2 py-1.5 rounded hover:bg-surface/60"
                >
                  <div className="h-7 w-7 rounded bg-surface-2 border border-border flex items-center justify-center text-glow flex-shrink-0">
                    <Film className="h-3 w-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] truncate">{v.title}</div>
                    <div className="text-[10px] text-muted">
                      {v.channel} · {v.priority}
                    </div>
                  </div>
                  <Badge variant="royal">{v.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </Widget>

        {/* Research */}
        <Widget
          className="col-span-12 lg:col-span-6"
          title="Últimas pesquisas"
          subtitle={`${stats.research} no centro`}
          icon={Sparkles}
          href="/app/research"
        >
          {recentResearch.length === 0 ? (
            <EmptyMini text="Sem pesquisas." cta="Adicionar" href="/app/research" />
          ) : (
            <div className="space-y-1.5">
              {recentResearch.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-3 px-2 py-1.5 rounded hover:bg-surface/60"
                >
                  <div className="h-7 w-7 rounded bg-surface-2 border border-border flex items-center justify-center text-electric flex-shrink-0">
                    <Sparkles className="h-3 w-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] truncate">{r.title}</div>
                    <div className="text-[10px] text-muted">{r.source ?? r.kind}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Widget>
      </div>
    </div>
  );
}

function Widget({
  className,
  title,
  subtitle,
  icon: Icon,
  href,
  children,
}: {
  className?: string;
  title: string;
  subtitle?: string;
  icon: any;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Card>
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Icon className="h-3.5 w-3.5 text-muted" />
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-fg-2">
                {title}
              </div>
              {subtitle && (
                <div className="text-[10px] text-dim">{subtitle}</div>
              )}
            </div>
          </div>
          <Link
            href={href}
            className="text-[10px] text-muted hover:text-neon transition-colors flex items-center gap-0.5"
          >
            Ver tudo
            <ArrowUpRight className="h-2.5 w-2.5" />
          </Link>
        </div>
        <div className="p-3">{children}</div>
      </Card>
    </div>
  );
}

function EmptyMini({
  text,
  cta,
  href,
}: {
  text: string;
  cta: string;
  href: string;
}) {
  return (
    <div className="text-center py-6">
      <p className="text-sm text-muted mb-3">{text}</p>
      <Link href={href}>
        <Button variant="ghost" size="sm">
          <Plus className="h-3 w-3" /> {cta}
        </Button>
      </Link>
    </div>
  );
}
