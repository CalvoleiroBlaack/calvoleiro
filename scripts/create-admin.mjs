import bcrypt from "bcryptjs";
import pg from "pg";
const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL não definida");
  process.exit(1);
}

const email = process.env.ADMIN_EMAIL;
const name = process.env.ADMIN_NAME || "Admin";
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  console.error("ADMIN_EMAIL e ADMIN_PASSWORD são obrigatórios");
  console.error("Exemplo:");
  console.error("ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD='senha-forte' node scripts/create-admin.mjs");
  process.exit(1);
}

const isSupabase =
  databaseUrl.includes("supabase.co") || databaseUrl.includes("pooler.supabase.com");
const pool = new Pool({
  connectionString: databaseUrl,
  ssl: isSupabase ? { rejectUnauthorized: false } : undefined,
});

const uid = () =>
  "u_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);

async function main() {
  console.log("Conectando em:", databaseUrl.replace(/:[^:@]+@/, ":***@"));
  const hash = await bcrypt.hash(password, 10);
  const client = await pool.connect();
  try {
    const tables = await client.query("SELECT to_regclass('public.cb_users') as t");
    if (!tables.rows[0].t) {
      console.error("❌ Tabela cb_users não existe. Rode: npx drizzle-kit push");
      process.exit(1);
    }

    const normalizedEmail = email.toLowerCase();
    const existing = await client.query("SELECT id FROM cb_users WHERE email = $1", [
      normalizedEmail,
    ]);

    if (existing.rows.length) {
      await client.query(
        "UPDATE cb_users SET name = $1, password_hash = $2, role = 'admin', updated_at = now() WHERE email = $3",
        [name, hash, normalizedEmail]
      );
      console.log("✓ Admin atualizado:", normalizedEmail);
      console.log("  id:", existing.rows[0].id);
    } else {
      const id = uid();
      await client.query(
        `INSERT INTO cb_users (id, name, email, password_hash, role, primary_channel, created_at, updated_at)
         VALUES ($1,$2,$3,$4,'admin','allanos', now(), now())`,
        [id, name, normalizedEmail, hash]
      );
      console.log("✓ Admin criado:", normalizedEmail);
      console.log("  id:", id);
    }
    console.log("  ✅ Login pronto!");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => {
  console.error("Erro:", e.message);
  process.exit(1);
});
