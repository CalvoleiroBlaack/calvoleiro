import { requireSession } from "@/lib/session";
import { getUserById } from "@/services";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/shell";
import { Card, Badge } from "@/components/ui/card";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export default async function AdminPage() {
  const session = await requireSession();
  const user = await getUserById(session.userId);
  if (!user || user.role !== "admin") redirect("/app");

  const users = await db.execute(
    sql`SELECT id, name, email, role, created_at FROM cb_users ORDER BY created_at DESC LIMIT 50`
  );

  const counts = await db.execute(sql`
    SELECT
      (SELECT count(*) FROM cb_users)::int AS users,
      (SELECT count(*) FROM cl_projects)::int AS projects,
      (SELECT count(*) FROM cl_links)::int AS links,
      (SELECT count(*) FROM cb_games)::int AS games,
      (SELECT count(*) FROM cb_ideas)::int AS ideas,
      (SELECT count(*) FROM cb_videos)::int AS videos
  `);
  const c = counts.rows[0] as any;

  return (
    <div>
      <PageHeader
        badge="SYSTEM · ADMIN"
        title="Painel administrativo"
        subtitle="Visão global do sistema."
      />

      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-6">
        {[
          { l: "Usuários", v: c.users },
          { l: "Projetos", v: c.projects },
          { l: "Links", v: c.links },
          { l: "Jogos", v: c.games },
          { l: "Ideias", v: c.ideas },
          { l: "Vídeos", v: c.videos },
        ].map((k) => (
          <Card key={k.l}>
            <div className="p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted">{k.l}</div>
              <div className="text-xl font-semibold">{k.v}</div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-fg-2 mb-4">
            Usuários
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-muted border-b border-border/60">
                <th className="text-left py-2">Nome</th>
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Role</th>
                <th className="text-left py-2">Criado em</th>
              </tr>
            </thead>
            <tbody>
              {users.rows.map((u: any) => (
                <tr key={u.id} className="border-b border-border/40">
                  <td className="py-2">{u.name}</td>
                  <td className="py-2 text-muted">{u.email}</td>
                  <td className="py-2">
                    <Badge variant={u.role === "admin" ? "neon" : "muted"}>
                      {u.role}
                    </Badge>
                  </td>
                  <td className="py-2 text-[11px] font-mono text-dim">
                    {new Date(u.created_at).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
