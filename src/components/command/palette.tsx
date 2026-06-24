"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  FolderKanban,
  Link as LinkIcon,
  Gamepad2,
  Lightbulb,
  Film,
  Bell,
  Sparkles,
  ArrowRight,
  LayoutDashboard,
  Calendar,
  Image,
  User,
  Settings,
  Plus,
} from "lucide-react";
import { Kbd } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ALL_NAV_ITEMS } from "@/lib/nav";

type Result = {
  id: string;
  title: string;
  type: string;
  href: string;
  subtitle?: string | null;
};

const TYPE_META: Record<string, { icon: any; label: string; color: string }> = {
  project: { icon: FolderKanban, label: "Projeto", color: "text-glow" },
  link: { icon: LinkIcon, label: "Link", color: "text-neon" },
  game: { icon: Gamepad2, label: "Jogo", color: "text-electric" },
  idea: { icon: Lightbulb, label: "Ideia", color: "text-amber-300" },
  video: { icon: Film, label: "Vídeo", color: "text-glow" },
  research: { icon: Sparkles, label: "Pesquisa", color: "text-neon" },
  reminder: { icon: Bell, label: "Lembrete", color: "text-rose-300" },
};

export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQ("");
      setResults([]);
      setActive(0);
    }
  }, [open]);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults(data.results ?? []);
        setActive(0);
      } finally {
        setLoading(false);
      }
    }, 150);
    return () => clearTimeout(t);
  }, [q]);

  // Quick nav (when query empty, show nav items)
  const navMatches = !q.trim()
    ? ALL_NAV_ITEMS.slice(0, 8).map((n) => ({
        id: "nav-" + n.href,
        title: n.label,
        type: "nav",
        href: n.href,
        subtitle: null,
        icon: n.icon,
      }))
    : ALL_NAV_ITEMS.filter((n) =>
        n.label.toLowerCase().includes(q.toLowerCase())
      ).map((n) => ({
        id: "nav-" + n.href,
        title: n.label,
        type: "nav",
        href: n.href,
        subtitle: "Ir para…",
        icon: n.icon,
      }));

  const allResults = [...navMatches, ...results];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((i) => Math.min(allResults.length - 1, i + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((i) => Math.max(0, i - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const r = allResults[active];
        if (r) {
          router.push(r.href);
          onClose();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [allResults, active, open, router, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/70 backdrop-blur-md pt-[12vh] px-4 cl-fade-in"
      onClick={onClose}
    >
      <div
        className="cl-glass-strong w-full max-w-xl rounded-xl overflow-hidden cl-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 h-12 border-b border-border/60">
          <Search className="h-4 w-4 text-muted" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar projetos, jogos, links, ideias…"
            className="flex-1 bg-transparent outline-none text-sm text-fg placeholder:text-dim"
          />
          {loading && (
            <div className="text-[10px] text-dim font-mono">…</div>
          )}
          <Kbd>esc</Kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {allResults.length === 0 && (
            <div className="px-3 py-12 text-center text-sm text-muted">
              {q.trim()
                ? "Nada encontrado."
                : "Comece a digitar para buscar tudo no seu Calvoleiro."}
            </div>
          )}
          {allResults.map((r, idx) => {
            const meta = r.type === "nav"
              ? { icon: (r as any).icon, label: "Navegar", color: "text-muted" }
              : TYPE_META[r.type];
            if (!meta) return null;
            const Icon = meta.icon;
            return (
              <button
                key={r.id}
                onMouseEnter={() => setActive(idx)}
                onClick={() => {
                  router.push(r.href);
                  onClose();
                }}
                className={cn(
                  "w-full flex items-center gap-3 rounded-md px-3 py-2 text-left transition-colors",
                  idx === active
                    ? "bg-surface-2 border border-border-2"
                    : "border border-transparent hover:bg-surface/60"
                )}
              >
                <div
                  className={cn(
                    "h-7 w-7 rounded-md bg-surface-3 border border-border flex items-center justify-center",
                    meta.color
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-fg truncate">
                    {r.title}
                  </div>
                  {r.subtitle && (
                    <div className="text-[11px] text-muted truncate">
                      {r.subtitle}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] uppercase tracking-wider text-dim">
                    {meta.label}
                  </span>
                  {idx === active && (
                    <ArrowRight className="h-3 w-3 text-neon" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="border-t border-border/60 px-4 py-2 flex items-center justify-between text-[10px] text-dim">
          <div className="flex items-center gap-2">
            <Kbd>↑↓</Kbd> navegar <Kbd>↵</Kbd> abrir
          </div>
          <div className="cl-gradient-text font-semibold">Calvoleiro</div>
        </div>
      </div>
    </div>
  );
}
