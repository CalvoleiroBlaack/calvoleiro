# Calvoleiro

### Your Second Brain Operating System

Calvoleiro é seu **sistema operacional digital**. Projetos, jogos, ideias, links, pesquisas, calendário, lembretes e mais — tudo conectado, fluido e extremamente rápido.

Inspirado em **Linear, Notion, Arc, Raycast, Vercel Dashboard, Framer e Obsidian**.

---

## Stack

| Camada       | Tecnologia                                       |
| ------------ | ------------------------------------------------ |
| Frontend     | Next.js 16 (App Router) · TypeScript · Tailwind 4 |
| UI Primitives| shadcn-style · lucide-react · recharts            |
| Backend      | Next.js Server Actions · Route Handlers           |
| Database     | PostgreSQL · Drizzle ORM                          |
| Hosting DB   | Supabase                                          |
| Auth         | bcryptjs · jose (JWT) · Cookies HttpOnly          |
| Deploy       | Vercel                                            |

---

## Módulos

### Workspace
- **Dashboard** — visão geral com widgets (projetos, links, lembretes, ideias, vídeos, pesquisas)
- **Projetos** — workspaces dedicados (Canal Allanos, LowserSave, Empresa, Curso, qualquer coisa)
- **Links** — biblioteca universal de URLs com pastas, tags, favoritos, busca
- **Pesquisas** — artigos, vídeos, tweets, reddit, PDFs
- **Assets** — imagens, GIFs, áudios, vídeos, templates, logos
- **Calendário** — visão dia/semana/mês
- **Lembretes** — to-do com prioridade e prazos

### YouTube
- **Jogos** — biblioteca rica com auto-preenchimento futuro via APIs públicas (RAWG/IGDB)
- **Ideias** — banco com Priority Score automático
- **Produção** — Kanban 9 colunas (Ideia → Publicado)
- **Performance** — métricas YouTube Studio
- **Cemitério** — vídeos fracassados para aprender
- **Insights** — análises automáticas

### Sistema
- **Perfil** — avatar estático/GIF, banner, bio, cor personalizada, links sociais
- **Configurações** — toggles modulares
- **Admin** — painel administrativo (apenas role=admin)

### Universal
- **Cmd + K** — busca global tipo Spotlight em projetos, jogos, links, ideias, vídeos, pesquisas

---

## Identidade visual

- Dark mode obrigatório
- Paleta: midnight black, royal blue, neon blue, electric, graphite (zero vermelho)
- Glassmorphism leve
- Sombras suaves, animações rápidas e fluidas
- Tipografia: Inter + JetBrains Mono

---

## Estrutura

```
src/
  app/
    page.tsx                  # Landing
    login / register / forgot-password
    api/health, api/search    # Healthcheck + busca global
    app/                      # Área autenticada
      page.tsx                # Dashboard
      projects/               # Workspaces
      links/                  # Biblioteca de links
      reminders/              # To-do
      research/               # Centro de pesquisa
      profile/                # Perfil
      settings/               # Módulos
      admin/                  # Admin panel
      games / ideas / production / performance / etc (módulos YouTube)
  components/
    brand/logo.tsx
    layout/                   # Sidebar, Topbar, Shell, Mobile, Search
    command/palette.tsx       # Cmd+K
    ui/                       # button, input, card, modal, badge
  db/
    schema.ts                 # 17 tabelas: cb_* (legacy) + cl_* (novas)
  services/
    index.ts                  # Legacy
    calvoleiro.ts             # Projects, links, reminders, profile, etc
  actions/
    auth.ts
    crud.ts                   # Legacy
    calvoleiro.ts             # Novas actions
  lib/
    auth.ts                   # bcrypt
    session.ts                # JWT jose
    nav.ts                    # Navegação modular
    utils.ts
  types/
  middleware.ts
```

---

## Como rodar do zero

```bash
git clone <repo>
cd calvoleiro
npm install

# .env.local com sua DATABASE_URL e SESSION_SECRET
cp .env.example .env.local
# edite valores reais

# aplica schema
npx drizzle-kit push

# cria admin
ADMIN_NAME="Allan" \
ADMIN_EMAIL="seu@email.com" \
ADMIN_PASSWORD="senha-forte" \
node scripts/create-admin.mjs

npm run dev
```

Abra http://localhost:3000

---

## Variáveis de ambiente

```env
DATABASE_URL=postgresql://user:pass@host:5432/postgres
SESSION_SECRET=openssl-rand-base64-48
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app
```

---

## Atalhos

| Atalho     | Ação                       |
| ---------- | -------------------------- |
| `⌘ K`      | Busca global               |
| `Esc`      | Fechar busca/modal         |
| `↑ ↓`      | Navegar resultados         |
| `↵`        | Abrir item                 |

---

## Futuras integrações (arquitetura preparada)

Google Drive · Discord · Steam · RAWG · IGDB · YouTube API · Google Calendar · OpenAI · Claude · Gemini · GitHub · Notion

---

## Scripts

| Comando                 | O que faz                          |
| ----------------------- | ---------------------------------- |
| `npm run dev`           | Dev server                         |
| `npm run build`         | Build produção                     |
| `npm run start`         | Servidor de produção               |
| `npm run typecheck`     | TypeScript                         |
| `npx drizzle-kit push`  | Aplicar schema                     |
| `npx drizzle-kit studio`| GUI do banco                       |

---

Calvoleiro v2.0 — Your Second Brain.
