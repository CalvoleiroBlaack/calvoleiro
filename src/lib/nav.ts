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
  TrendingUp,
  Skull,
  Sparkles,
  Settings,
  User,
  Shield,
  type LucideIcon,
} from "lucide-react";

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  module: string;
  shortcut?: string;
  badge?: string;
  end?: boolean;
};

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Workspace",
    items: [
      {
        href: "/app",
        label: "Dashboard",
        icon: LayoutDashboard,
        module: "dashboard",
        shortcut: "G D",
        end: true,
      },
      {
        href: "/app/projects",
        label: "Projetos",
        icon: FolderKanban,
        module: "projects",
        shortcut: "G P",
      },
      {
        href: "/app/links",
        label: "Links",
        icon: LinkIcon,
        module: "links",
        shortcut: "G L",
      },
      {
        href: "/app/research",
        label: "Pesquisas",
        icon: Search,
        module: "research",
      },
      {
        href: "/app/assets",
        label: "Assets",
        icon: ImageIcon,
        module: "assets",
      },
      {
        href: "/app/calendar",
        label: "Calendário",
        icon: Calendar,
        module: "calendar",
      },
      {
        href: "/app/reminders",
        label: "Lembretes",
        icon: Bell,
        module: "reminders",
      },
    ],
  },
  {
    label: "YouTube",
    items: [
      {
        href: "/app/games",
        label: "Jogos",
        icon: Gamepad2,
        module: "games",
      },
      {
        href: "/app/ideas",
        label: "Ideias",
        icon: Lightbulb,
        module: "ideas",
      },
      {
        href: "/app/production",
        label: "Produção",
        icon: Film,
        module: "videos",
      },
      {
        href: "/app/performance",
        label: "Performance",
        icon: TrendingUp,
        module: "videos",
      },
      {
        href: "/app/graveyard",
        label: "Cemitério",
        icon: Skull,
        module: "videos",
      },
      {
        href: "/app/insights",
        label: "Insights",
        icon: Sparkles,
        module: "videos",
      },
    ],
  },
  {
    label: "Sistema",
    items: [
      {
        href: "/app/profile",
        label: "Perfil",
        icon: User,
        module: "system",
      },
      {
        href: "/app/settings",
        label: "Configurações",
        icon: Settings,
        module: "system",
      },
      {
        href: "/app/admin",
        label: "Admin",
        icon: Shield,
        module: "admin",
      },
    ],
  },
];

export const ALL_NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);
