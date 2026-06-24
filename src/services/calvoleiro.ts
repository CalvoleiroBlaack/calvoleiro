import "server-only";
import { db } from "@/db";
import {
  projects,
  links,
  researchItems,
  reminders,
  userProfiles,
  activityLog,
  games,
  ideas,
  videos,
  assets,
  calendarEvents,
} from "@/db/schema";
import { and, desc, eq, sql, count } from "drizzle-orm";
import { uid } from "@/lib/utils";

// ──────────────────────────── PROJECTS ──────────────────────
export async function listProjects(userId: string) {
  return db
    .select()
    .from(projects)
    .where(eq(projects.userId, userId))
    .orderBy(desc(projects.pinned), desc(projects.updatedAt));
}

export async function getProject(userId: string, id: string) {
  const r = await db
    .select()
    .from(projects)
    .where(and(eq(projects.userId, userId), eq(projects.id, id)))
    .limit(1);
  return r[0] ?? null;
}

export async function createProject(
  userId: string,
  input: Omit<typeof projects.$inferInsert, "id" | "userId">
) {
  const id = uid("p_");
  await db.insert(projects).values({ ...input, id, userId });
  return id;
}

export async function updateProject(
  userId: string,
  id: string,
  patch: Partial<typeof projects.$inferInsert>
) {
  await db
    .update(projects)
    .set({ ...patch, updatedAt: new Date() })
    .where(and(eq(projects.id, id), eq(projects.userId, userId)));
}

export async function deleteProject(userId: string, id: string) {
  await db
    .delete(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, userId)));
}

// ──────────────────────────── LINKS ─────────────────────────
export async function listLinks(userId: string) {
  return db
    .select()
    .from(links)
    .where(eq(links.userId, userId))
    .orderBy(desc(links.favorite), desc(links.savedAt));
}

export async function createLink(
  userId: string,
  input: Omit<typeof links.$inferInsert, "id" | "userId">
) {
  const id = uid("ln_");
  await db.insert(links).values({ ...input, id, userId });
  return id;
}

export async function updateLink(
  userId: string,
  id: string,
  patch: Partial<typeof links.$inferInsert>
) {
  await db
    .update(links)
    .set(patch)
    .where(and(eq(links.id, id), eq(links.userId, userId)));
}

export async function deleteLink(userId: string, id: string) {
  await db
    .delete(links)
    .where(and(eq(links.id, id), eq(links.userId, userId)));
}

// ──────────────────────────── RESEARCH ITEMS ────────────────
export async function listResearchItems(userId: string) {
  return db
    .select()
    .from(researchItems)
    .where(eq(researchItems.userId, userId))
    .orderBy(desc(researchItems.pinned), desc(researchItems.createdAt));
}

export async function createResearchItem(
  userId: string,
  input: Omit<typeof researchItems.$inferInsert, "id" | "userId">
) {
  const id = uid("ri_");
  await db.insert(researchItems).values({ ...input, id, userId });
  return id;
}

export async function deleteResearchItemNew(userId: string, id: string) {
  await db
    .delete(researchItems)
    .where(and(eq(researchItems.id, id), eq(researchItems.userId, userId)));
}

// ──────────────────────────── REMINDERS ─────────────────────
export async function listReminders(userId: string) {
  return db
    .select()
    .from(reminders)
    .where(eq(reminders.userId, userId))
    .orderBy(reminders.dueAt);
}

export async function createReminder(
  userId: string,
  input: Omit<typeof reminders.$inferInsert, "id" | "userId">
) {
  const id = uid("rm_");
  await db.insert(reminders).values({ ...input, id, userId });
  return id;
}

export async function updateReminder(
  userId: string,
  id: string,
  patch: Partial<typeof reminders.$inferInsert>
) {
  await db
    .update(reminders)
    .set(patch)
    .where(and(eq(reminders.id, id), eq(reminders.userId, userId)));
}

export async function deleteReminder(userId: string, id: string) {
  await db
    .delete(reminders)
    .where(and(eq(reminders.id, id), eq(reminders.userId, userId)));
}

// ──────────────────────────── PROFILE ───────────────────────
export async function getProfile(userId: string) {
  const r = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, userId))
    .limit(1);
  return r[0] ?? null;
}

export async function upsertProfile(
  userId: string,
  patch: Partial<typeof userProfiles.$inferInsert>
) {
  const existing = await getProfile(userId);
  if (existing) {
    await db
      .update(userProfiles)
      .set({ ...patch, updatedAt: new Date() })
      .where(eq(userProfiles.userId, userId));
  } else {
    await db.insert(userProfiles).values({ ...patch, userId });
  }
}

// ──────────────────────────── ACTIVITY ──────────────────────
export async function logActivity(
  userId: string,
  input: Omit<typeof activityLog.$inferInsert, "id" | "userId">
) {
  await db.insert(activityLog).values({
    ...input,
    id: uid("act_"),
    userId,
  });
}

export async function listActivity(userId: string, limit = 20) {
  return db
    .select()
    .from(activityLog)
    .where(eq(activityLog.userId, userId))
    .orderBy(desc(activityLog.createdAt))
    .limit(limit);
}

// ──────────────────────────── BRAIN STATS ───────────────────
export async function getBrainStats(userId: string) {
  const [p, l, g, i, v, ri, rm, a, ce] = await Promise.all([
    db.select({ c: count() }).from(projects).where(eq(projects.userId, userId)),
    db.select({ c: count() }).from(links).where(eq(links.userId, userId)),
    db.select({ c: count() }).from(games).where(eq(games.userId, userId)),
    db.select({ c: count() }).from(ideas).where(eq(ideas.userId, userId)),
    db.select({ c: count() }).from(videos).where(eq(videos.userId, userId)),
    db
      .select({ c: count() })
      .from(researchItems)
      .where(eq(researchItems.userId, userId)),
    db
      .select({ c: count() })
      .from(reminders)
      .where(eq(reminders.userId, userId)),
    db.select({ c: count() }).from(assets).where(eq(assets.userId, userId)),
    db
      .select({ c: count() })
      .from(calendarEvents)
      .where(eq(calendarEvents.userId, userId)),
  ]);
  return {
    projects: p[0]?.c ?? 0,
    links: l[0]?.c ?? 0,
    games: g[0]?.c ?? 0,
    ideas: i[0]?.c ?? 0,
    videos: v[0]?.c ?? 0,
    research: ri[0]?.c ?? 0,
    reminders: rm[0]?.c ?? 0,
    assets: a[0]?.c ?? 0,
    events: ce[0]?.c ?? 0,
  };
}
