# CONTENT BRAIN – Guia Supabase

## 1. Conectar ao Supabase PostgreSQL

Você recebeu a URL:
```
postgresql://postgres:[YOUR-PASSWORD]@db.tdkzbyjtswigdtxpodfa.supabase.co:5432/postgres
```

### Passo a passo

1. **Substitua `[YOUR-PASSWORD]`** pela senha real do projeto.
   - Pegue em: Supabase Dashboard → Project Settings → Database → Connection string → URI

2. **Arquivos .env já configurados:**
   - `.env` – usado em produção / build
   - `.env.local` – usado em desenvolvimento

   Ambos contêm:
   ```
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.tdkzbyjtswigdtxpodfa.supabase.co:5432/postgres
   SESSION_SECRET=content-brain-prod-change-me-...
   ```

3. **Troque o SESSION_SECRET em produção:**
   ```bash
   openssl rand -base64 48
   ```
   Cole o resultado em `SESSION_SECRET` nos dois arquivos .env e também nas Environment Variables da Vercel.

---

## 2. Criar as tabelas

Você tem **3 opções**:

### Opção A – Drizzle Kit (recomendado)
```bash
export DATABASE_URL="postgresql://postgres:SUA_SENHA@db.tdkzbyjtswigdtxpodfa.supabase.co:5432/postgres"
npx drizzle-kit push
```
Pronto. 11 tabelas + 10 enums criados.

### Opção B – SQL Editor no Supabase
Abra: Supabase Dashboard → SQL Editor → New query  
Cole o conteúdo de `scripts/supabase-setup.sql` → Run

### Opção C – psql
```bash
psql "postgresql://postgres:SUA_SENHA@db.tdkzbyjtswigdtxpodfa.supabase.co:5432/postgres" -f scripts/supabase-setup.sql
```

**Tabelas criadas:**
- `cb_users`
- `cb_games`
- `cb_ideas`
- `cb_videos`
- `cb_performance`
- `cb_graveyard`
- `cb_thumbnail_tests`
- `cb_titles`
- `cb_research`
- `cb_assets`
- `cb_calendar_events`

Verifique em: Supabase → Table Editor – você deve ver as 11 tabelas `cb_*`.

---

## 3. Ajustes feitos para Supabase

O projeto original usava Postgres local. Para Supabase, foram feitos:

**`src/db/index.ts`**
```ts
const isSupabase = databaseUrl.includes("supabase.co");
new Pool({
  connectionString: databaseUrl,
  ssl: isSupabase ? { rejectUnauthorized: false } : undefined,
})
```

**`drizzle.config.ts`** (novo, substitui o .json)
- Lê `DATABASE_URL` do `.env.local`
- Ativa SSL automaticamente para `*.supabase.co`
- `verbose: true, strict: true`

Sem isso, o node-postgres falha com `self-signed certificate` no Supabase.

---

## 4. Pooler / PgBouncer

Supabase oferece pooling (Supavisor). Se bater o limite de conexões:

**Transaction mode (porta 6543):**
```
postgresql://postgres.tdkzbyjtswigdtxpodfa:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

⚠️ Com PgBouncer em transaction mode, **prepared statements precisam ser desabilitados**. O Drizzle/node-postgres do projeto atual não usa prepared statements persistentes, então funciona. Se tiver erro `prepared statement ... does not exist`, adicione ao pool:
```ts
new Pool({ ..., max: 1 })
```

Ou use **Session mode** (porta 5432, a URL direta que você me deu).

Para Vercel / serverless, recomendo Transaction mode + pooler.

---

## 5. Testar login / registro

Local:
```bash
npm run dev
# http://localhost:3000/register
```

1. Crie conta: Nome / Email / Senha (≥6 chars)
2. Será redirecionado para `/app`
3. Faça logout, volte em `/login` e entre novamente
4. No Supabase Table Editor → `cb_users` → deve aparecer 1 linha com `password_hash` iniciado em `$2b$`

Se der `Credenciais inválidas`: verifique se o email foi salvo em lowercase (o sistema faz isso automaticamente).

Se der `DATABASE_URL is required`: verifique se `.env.local` está na raiz e se você reiniciou `npm run dev`.

Se der `self signed certificate`: confirme que `src/db/index.ts` tem o bloco `ssl: { rejectUnauthorized: false }` – já está incluso.

---

## 6. Deploy na Vercel

1. Push para GitHub
2. Vercel → New Project → Import
3. Environment Variables:
   ```
   DATABASE_URL=postgresql://postgres:SUA_SENHA@db.tdkzbyjtswigdtxpodfa.supabase.co:5432/postgres
   SESSION_SECRET=um-segredo-forte-aqui-openssl-rand-base64-48
   NODE_ENV=production
   ```
4. Build Command: `npm run build` (padrão)
5. Deploy

⚠️ Se usar Vercel serverless, considere a URL de pooler (`...pooler.supabase.com:6543/postgres?pgbouncer=true`) na `DATABASE_URL` para evitar esgotar conexões.

---

## 7. Comandos úteis

```bash
# Aplicar schema no Supabase
npx drizzle-kit push

# Gerar migração SQL (opcional)
npx drizzle-kit generate

# Abrir Drizzle Studio (GUI)
npx drizzle-kit studio

# Build / typecheck
npm run build
npm run typecheck

# Dev
npm run dev
```

---

## 8. Schema check

O schema Drizzle em `src/db/schema.ts` está **100% compatível com Supabase Postgres 15**:

- ✅ 10 enums PostgreSQL
- ✅ 11 tabelas com PKs `text`
- ✅ `timestamp`, `integer`, `real`, `boolean`, `varchar`, `jsonb` – todos suportados
- ✅ `jsonb` default `'[]'::jsonb` – válido
- ✅ Sem extensões exóticas
- ✅ Sem RLS (Row Level Security) – auth é próprio via JWT, não via Supabase Auth

Se quiser ativar RLS depois, precisaria reescrever a camada de auth para usar Supabase Auth (não é o caso atual).

---

## Problemas comuns

| Erro | Causa | Solução |
|------|-------|---------|
| `self signed certificate` | SSL não configurado | Já corrigido em `src/db/index.ts` |
| `password authentication failed` | [YOUR-PASSWORD] não substituído | Substitua pela senha real no .env |
| `relation "cb_users" does not exist` | Schema não aplicado | Rode `npx drizzle-kit push` |
| `Email já cadastrado` | Usuário já existe | Use outro email ou delete em Supabase Table Editor |
| Vercel: `too many clients` | Esgotou conexões | Use a URL de pooler (`pooler.supabase.com:6543`) |

---

Pronto para produção. Boa criação de conteúdo! 🎬🔴
