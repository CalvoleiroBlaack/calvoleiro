import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ results: [] }, { status: 401 });

  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();
  if (!q) return NextResponse.json({ results: [] });

  const like = `%${q}%`;

  const [projects, links, games, ideas, videos, research, reminders] = await Promise.all([
    db.execute(sql`SELECT id, name AS title, 'project' AS type, '/app/projects' AS href, description AS subtitle FROM cl_projects WHERE user_id = ${session.userId} AND (lower(name) LIKE ${like} OR lower(coalesce(description,'')) LIKE ${like}) LIMIT 5`),
    db.execute(sql`SELECT id, coalesce(title, url) AS title, 'link' AS type, '/app/links' AS href, url AS subtitle FROM cl_links WHERE user_id = ${session.userId} AND (lower(coalesce(title,'')) LIKE ${like} OR lower(url) LIKE ${like} OR lower(coalesce(site_name,'')) LIKE ${like}) LIMIT 5`),
    db.execute(sql`SELECT id, name AS title, 'game' AS type, '/app/games' AS href, coalesce(studio, platform) AS subtitle FROM cb_games WHERE user_id = ${session.userId} AND lower(name) LIKE ${like} LIMIT 5`),
    db.execute(sql`SELECT id, title, 'idea' AS type, '/app/ideas' AS href, coalesce(hook, description) AS subtitle FROM cb_ideas WHERE user_id = ${session.userId} AND (lower(title) LIKE ${like} OR lower(coalesce(hook,'')) LIKE ${like}) LIMIT 5`),
    db.execute(sql`SELECT id, title, 'video' AS type, '/app/production' AS href, status::text AS subtitle FROM cb_videos WHERE user_id = ${session.userId} AND lower(title) LIKE ${like} LIMIT 5`),
    db.execute(sql`SELECT id, title, 'research' AS type, '/app/research' AS href, source AS subtitle FROM cl_research_items WHERE user_id = ${session.userId} AND (lower(title) LIKE ${like} OR lower(coalesce(notes,'')) LIKE ${like}) LIMIT 5`),
    db.execute(sql`SELECT id, title, 'reminder' AS type, '/app/reminders' AS href, status::text AS subtitle FROM cl_reminders WHERE user_id = ${session.userId} AND lower(title) LIKE ${like} LIMIT 5`),
  ]);

  const results = [
    ...projects.rows,
    ...links.rows,
    ...games.rows,
    ...ideas.rows,
    ...videos.rows,
    ...research.rows,
    ...reminders.rows,
  ];

  return NextResponse.json({ results });
}
