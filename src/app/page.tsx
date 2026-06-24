import Link from "next/link";
import {
  ArrowRight,
  Brain,
  FolderKanban,
  Search,
  Gamepad2,
  Link as LinkIcon,
  Calendar,
  Sparkles,
  Layers,
  Zap,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg text-fg relative overflow-hidden">
      {/* Background mesh */}
      <div className="absolute inset-0 pointer-events-none cl-grid opacity-40" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] bg-gradient-radial from-royal/20 via-transparent to-transparent blur-3xl pointer-events-none" />

      {/* Nav */}
      <header className="relative z-10 cl-glass border-b border-border/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 h-9 rounded-md text-sm text-fg-2 hover:text-fg hover:bg-surface/60 flex items-center transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="px-4 h-9 rounded-md cl-gradient-brand text-white text-sm cl-glow-soft hover:opacity-90 flex items-center gap-1.5 font-medium"
            >
              Começar agora <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-36 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full cl-glass border border-neon/30 text-[10px] uppercase tracking-[0.18em] text-neon mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-neon cl-pulse" />
          Your Second Brain · v2.0
        </div>
        <h1 className="text-5xl md:text-7xl font-semibold leading-[1.02] tracking-tight mb-6">
          Seu cérebro digital,
          <br />
          <span className="cl-gradient-text">organizado em um só lugar.</span>
        </h1>
        <p className="text-muted text-lg max-w-2xl mx-auto mb-10">
          Calvoleiro é o sistema operacional para criadores, estrategistas e
          curiosos. Projetos, jogos, ideias, links, pesquisas, calendário e mais
          — conectados de forma fluida e extremamente rápida.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/register"
            className="h-12 px-7 rounded-md cl-gradient-brand text-white text-sm font-semibold cl-glow-blue hover:opacity-95 flex items-center gap-2"
          >
            <Brain className="h-4 w-4" /> Criar meu Second Brain
          </Link>
          <Link
            href="#features"
            className="h-12 px-7 rounded-md border border-border-2 cl-glass text-fg-2 text-sm font-medium hover:text-fg hover:border-border-strong flex items-center gap-2"
          >
            Ver módulos
          </Link>
        </div>

        {/* Browser mock */}
        <div className="mt-20 relative">
          <div className="relative mx-auto max-w-5xl rounded-xl cl-glass-strong overflow-hidden cl-glow-soft">
            <div className="flex items-center gap-1.5 px-4 h-9 border-b border-border/60">
              <div className="h-2.5 w-2.5 rounded-full bg-rose-500/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
              <div className="ml-3 px-3 py-0.5 rounded-md bg-bg/60 border border-border text-[10px] font-mono text-muted">
                calvoleiro.app/dashboard
              </div>
            </div>
            <div className="grid grid-cols-12 gap-3 p-4 min-h-[380px] bg-gradient-to-br from-bg-2 to-bg">
              <div className="col-span-3 cl-glass rounded-lg p-3 space-y-2">
                {[
                  "Dashboard",
                  "Projetos",
                  "Jogos",
                  "Ideias",
                  "Links",
                  "Calendário",
                  "Pesquisas",
                ].map((s, i) => (
                  <div
                    key={s}
                    className={`text-[11px] px-2 py-1.5 rounded ${
                      i === 0
                        ? "cl-active-glow text-fg"
                        : "text-muted"
                    }`}
                  >
                    {s}
                  </div>
                ))}
              </div>
              <div className="col-span-9 space-y-3">
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { l: "Projetos", v: "12" },
                    { l: "Ideias", v: "47" },
                    { l: "Links", v: "183" },
                    { l: "Jogos", v: "29" },
                  ].map((k) => (
                    <div key={k.l} className="cl-glass rounded-lg p-3">
                      <div className="text-[9px] uppercase tracking-wider text-muted">
                        {k.l}
                      </div>
                      <div className="text-xl font-semibold cl-gradient-text">
                        {k.v}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cl-glass rounded-lg p-4 h-44 relative overflow-hidden">
                  <div className="text-[10px] uppercase tracking-wider text-muted mb-2">
                    Atividade recente
                  </div>
                  <div className="space-y-2">
                    {[
                      "Nova ideia · Iceberg FNAF Help Wanted 2",
                      "Link salvo · IGDB · Silent Hill f",
                      "Projeto atualizado · Canal Allanos",
                      "Lembrete · Gravar Lives Sábado",
                    ].map((l, i) => (
                      <div
                        key={i}
                        className="text-[11px] text-fg-2 flex items-center gap-2"
                      >
                        <div className="h-1 w-1 rounded-full bg-neon" />
                        {l}
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 cl-shimmer pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -inset-x-20 -bottom-20 h-40 bg-gradient-to-t from-bg via-bg/50 to-transparent" />
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="relative z-10 max-w-6xl mx-auto px-6 py-24"
      >
        <div className="text-center mb-16">
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-neon mb-2">
            CORE MODULES
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Cada peça do seu cérebro,
            <br />
            <span className="cl-gradient-text">um módulo dedicado.</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="cl-glass rounded-xl p-6 hover:border-border-strong transition-all cl-lift group"
              >
                <div className="h-10 w-10 rounded-lg bg-surface-2 border border-border-2 flex items-center justify-center text-neon mb-4 group-hover:border-neon/40 group-hover:text-neon transition-colors">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="font-semibold mb-1 text-fg">{f.title}</h3>
                <p className="text-[13px] text-muted leading-relaxed">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/60 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <div className="text-[11px] font-mono text-dim flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 cl-pulse" />
            All systems operational · v2.0
          </div>
        </div>
      </footer>
    </div>
  );
}

const FEATURES = [
  {
    icon: FolderKanban,
    title: "Projetos",
    desc: "Cada iniciativa em seu próprio workspace. Conecte ideias, links, jogos, assets e tarefas.",
  },
  {
    icon: Gamepad2,
    title: "Biblioteca de Jogos",
    desc: "Catálogo inteligente com auto-preenchimento via APIs públicas. Ideal para canais de gameplay.",
  },
  {
    icon: LinkIcon,
    title: "Links Universais",
    desc: "Salve qualquer site. Preview automático, tags, pastas e busca instantânea.",
  },
  {
    icon: Sparkles,
    title: "Banco de Ideias",
    desc: "Capture insights em segundos. Priorize automaticamente com Priority Score.",
  },
  {
    icon: Search,
    title: "Centro de Pesquisa",
    desc: "Artigos, vídeos, tweets, PDFs. Tudo organizado para revisão profunda.",
  },
  {
    icon: Calendar,
    title: "Calendário Editorial",
    desc: "Visão por dia, semana, mês ou timeline. Arraste, agende, lembre.",
  },
  {
    icon: Layers,
    title: "Assets",
    desc: "Imagens, GIFs, áudios, vídeos e templates. Pastas, tags, busca instantânea.",
  },
  {
    icon: Zap,
    title: "Cmd + K Universal",
    desc: "Spotlight global. Encontre qualquer coisa no seu cérebro em milissegundos.",
  },
  {
    icon: Brain,
    title: "Modular & Extensível",
    desc: "Ative apenas o que você usa. Preparado para integrações Drive, GitHub, OpenAI e mais.",
  },
];
