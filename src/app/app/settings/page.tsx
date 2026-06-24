import { requireSession } from "@/lib/session";
import { getProfile } from "@/services/calvoleiro";
import { PageHeader } from "@/components/layout/shell";
import { Card, Badge } from "@/components/ui/card";
import {
  LayoutDashboard,
  FolderKanban,
  Gamepad2,
  Lightbulb,
  Film,
  Link as LinkIcon,
  Search,
  Image as ImageIcon,
  Calendar,
  Bell,
} from "lucide-react";

const MODULES = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, desc: "Central de comando" },
  { id: "projects", label: "Projetos", icon: FolderKanban, desc: "Workspaces dedicados" },
  { id: "games", label: "Jogos", icon: Gamepad2, desc: "Biblioteca de jogos para canal" },
  { id: "ideas", label: "Ideias", icon: Lightbulb, desc: "Banco de ideias com priorização" },
  { id: "videos", label: "Vídeos", icon: Film, desc: "Kanban de produção YouTube" },
  { id: "links", label: "Links", icon: LinkIcon, desc: "Biblioteca universal de links" },
  { id: "research", label: "Pesquisas", icon: Search, desc: "Centro de pesquisa" },
  { id: "assets", label: "Assets", icon: ImageIcon, desc: "Mídia, templates, GIFs" },
  { id: "calendar", label: "Calendário", icon: Calendar, desc: "Eventos e agenda" },
  { id: "reminders", label: "Lembretes", icon: Bell, desc: "Tarefas e to-do" },
];

export default async function SettingsPage() {
  const session = await requireSession();
  const profile = await getProfile(session.userId);
  const enabled = (profile?.enabledModules ?? []) as string[];

  return (
    <div>
      <PageHeader
        badge="SYSTEM · SETTINGS"
        title="Configurações"
        subtitle="Ative apenas os módulos que você usa."
      />

      <Card>
        <div className="p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-fg-2 mb-4">
            Módulos
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {MODULES.map((m) => {
              const Icon = m.icon;
              const on = enabled.includes(m.id);
              return (
                <div
                  key={m.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-surface/40 border border-border"
                >
                  <div className="h-9 w-9 rounded-md bg-surface-2 border border-border-2 flex items-center justify-center text-neon">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{m.label}</div>
                    <div className="text-[11px] text-muted">{m.desc}</div>
                  </div>
                  <Badge variant={on ? "success" : "muted"}>
                    {on ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              );
            })}
          </div>
          <div className="text-[11px] text-dim mt-4">
            Customização de módulos será expandida em breve. Por ora, todos estão acessíveis na navegação.
          </div>
        </div>
      </Card>

      <div className="mt-4">
        <Card>
          <div className="p-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-fg-2 mb-4">
              Futuras integrações
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {[
                "Google Drive",
                "Discord",
                "Steam",
                "RAWG",
                "IGDB",
                "YouTube",
                "Google Calendar",
                "OpenAI",
                "Claude",
                "Gemini",
                "GitHub",
                "Notion",
              ].map((s) => (
                <div
                  key={s}
                  className="p-3 rounded-lg bg-surface/40 border border-border text-sm flex items-center justify-between"
                >
                  <span className="text-fg-2">{s}</span>
                  <Badge variant="muted">soon</Badge>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
