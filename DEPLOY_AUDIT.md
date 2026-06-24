# CONTENT BRAIN — Auditoria Final para Deploy

Status: **APROVADO PARA DEPLOY**

---

## 1. Arquivos `.env` / `.env.local`

Resultado atual do workspace:

- `.env`: **não existe**
- `.env.local`: **não existe**
- `.env.example`: **existe e deve ser commitado**

Regra aplicada no `.gitignore`:

```gitignore
.env
.env.*
!.env.example
!.env.sample
```

Ou seja: mesmo que você crie `.env` localmente, ele não será enviado ao GitHub.

---

## 2. Secrets / senhas no código

Arquivos sensíveis removidos:

- `scripts/admin-allan.sql` removido.
- `.env` removido.
- `.env.local` ausente.

O código-fonte usa apenas variáveis de ambiente:

- `process.env.DATABASE_URL`
- `process.env.SESSION_SECRET`
- `process.env.ADMIN_EMAIL`
- `process.env.ADMIN_PASSWORD`

Não há senha real nem DATABASE_URL real dentro de `src/`.

---

## 3. Variáveis necessárias na Vercel

Configure diretamente em **Vercel → Project → Settings → Environment Variables**:

```env
DATABASE_URL=postgresql://postgres:SUA_SENHA@db.SEU_PROJECT_REF.supabase.co:5432/postgres
SESSION_SECRET=GERE_COM_OPENSSL_RAND_BASE64_48
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app
```

Gere o secret:

```bash
openssl rand -base64 48
```

---

## 4. Arquivos que devem ser enviados ao GitHub

### Raiz

```txt
.gitignore
.env.example
README.md
SUPABASE.md
DEPLOY_AUDIT.md
package.json
package-lock.json
tsconfig.json
next.config.ts
postcss.config.mjs
eslint.config.mjs
drizzle.config.ts
```

### Código-fonte

```txt
src/
```

Inclui:

```txt
src/actions/
src/app/
src/components/
src/db/
src/lib/
src/services/
src/types/
src/middleware.ts
```

### Scripts seguros

```txt
scripts/create-admin.mjs
scripts/seed-supabase.sh
scripts/supabase-setup.sql
```

---

## 5. Arquivos que NÃO devem ser enviados

```txt
.env
.env.local
.env.production
node_modules/
.next/
out/
.vercel/
scripts/admin-allan.sql
*.pem
*.key
*.log
```

---

## 6. Comandos de deploy do zero

### Local / Supabase

```bash
npm install
cp .env.example .env.local
# edite .env.local com DATABASE_URL real e SESSION_SECRET real
npx drizzle-kit push
ADMIN_NAME="Allan" ADMIN_EMAIL="seu-email@example.com" ADMIN_PASSWORD="senha-forte" node scripts/create-admin.mjs
npm run dev
```

### Vercel

1. Envie o repositório ao GitHub.
2. Importe na Vercel.
3. Configure env vars na Vercel.
4. Deploy com build command padrão:

```bash
npm run build
```

---

## 7. Checklist pós-deploy

- [ ] `/api/health` retorna `{ "ok": true }`
- [ ] `/register` cria usuário novo
- [ ] `/login` autentica usuário existente
- [ ] `/app` bloqueia acesso sem login
- [ ] Dashboard carrega
- [ ] Criar jogo em Biblioteca de Jogos
- [ ] Criar ideia em Banco de Ideias
- [ ] Criar vídeo no Kanban de Produção
- [ ] Registrar métricas em Performance
- [ ] Exportar CSV/JSON em Relatórios

---

## 8. Observações finais

- Firebase não está implementado.
- Auth é própria: bcryptjs + JWT jose + cookie HttpOnly.
- Banco: Supabase PostgreSQL via Drizzle ORM.
- Upload de assets ainda é mock local/data URL; para produção real, usar Supabase Storage, S3 ou Vercel Blob.
