#!/usr/bin/env bash
set -euo pipefail

# CONTENT BRAIN – Supabase setup + seed admin
# Uso:
#   export DATABASE_URL="postgresql://postgres:SENHA@db.PROJECT.supabase.co:5432/postgres"
#   export ADMIN_NAME="Allan"
#   export ADMIN_EMAIL="admin@example.com"
#   export ADMIN_PASSWORD="senha-forte"
#   ./scripts/seed-supabase.sh

if [ -z "${DATABASE_URL:-}" ]; then
  echo "❌ Defina DATABASE_URL primeiro."
  exit 1
fi

if [ -z "${ADMIN_EMAIL:-}" ] || [ -z "${ADMIN_PASSWORD:-}" ]; then
  echo "❌ Defina ADMIN_EMAIL e ADMIN_PASSWORD primeiro."
  exit 1
fi

echo "→ Content Brain – Supabase Setup"
echo "  DB: $(echo "$DATABASE_URL" | sed 's/:[^:@]*@/:***@/')"
echo

echo "1/3 npm install"
npm install --silent

echo
echo "2/3 npx drizzle-kit push"
npx drizzle-kit push

echo
echo "3/3 Criando/atualizando admin"
node scripts/create-admin.mjs

echo
echo "✅ Pronto! Login admin configurado para: $ADMIN_EMAIL"
