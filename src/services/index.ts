import "server-only";
import { db } from "@/db";
import {
  users,
  games,
  ideas,
  videos,
  performance,
  graveyard,
  thumbnailTests,
  titles,
  research,
  assets,
  calendarEvents,
} from "@/db/schema";
import { eq, and, desc, sql, count, avg } from "drizzle-orm";
import { hashPassword, verifyPassword, validateEmail, validatePassword } from "@/lib/auth";
import { uid, gradeFromCtr } from "@/lib/utils";
import { calcPriorityScore, type Difficulty } from "@/types";

// ──────────────────────────── USERS ────────────────────────────
export async function createUser(input: {
  name: string;
  email: string;
  password: string;
}) {
  const emailErr = validateEmail(input.email);
  if (emailErr) throw new Error(emailErr);
  const passErr = validatePassword(input.password);
  if (passErr) throw new Error(passErr);
  if (!input.name || input.name.trim().length < 2) {
    throw new Error("Nome inválido");
  }

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, input.email.toLowerCase()))
    .limit(1);
  if (existing.length) throw new Error("Email já cadastrado");

  const id = uid("u_");
  await db.insert(users).values({
    id,
    name: input.name,
    email: input.email.toLowerCase(),
    passwordHash: await hashPassword(input.password),
  });
  return { id };
}

export async function authenticateUser(email: string, password: string) {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1)
    .then((r) => r[0]);
  if (!user) throw new Error("Credenciais inválidas");
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) throw new Error("Credenciais inválidas");
  return { id: user.id, email: user.email, name: user.name };
}

export async function getUserById(id: string) {
  const u = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return u[0] ?? null;
}

// ──────────────────────────── GAMES ────────────────────────────
export async function listGames(userId: string) {
  return db
    .select()
    .from(games)
    .where(eq(games.userId, userId))
    .orderBy(desc(games.createdAt));
}

export async function createGame(
  userId: string,
  input: Omit<typeof games.$inferInsert, "id" | "userId">
) {
  const id = uid("g_");
  await db.insert(games).values({ ...input, id, userId });
  return id;
}

export async function updateGame(
  userId: string,
  id: string,
  patch: Partial<typeof games.$inferInsert>
) {
  await db
    .update(games)
    .set(patch)
    .where(and(eq(games.id, id), eq(games.userId, userId)));
}

export async function deleteGame(userId: string, id: string) {
  await db
    .delete(games)
    .where(and(eq(games.id, id), eq(games.userId, userId)));
}

// ──────────────────────────── IDEAS ────────────────────────────
export async function listIdeas(
  userId: string,
  opts: { channel?: string | null; archived?: boolean | null } = {}
) {
  let q = db
    .select()
    .from(ideas)
    .where(eq(ideas.userId, userId))
    .orderBy(desc(ideas.priorityScore));
  if (opts.archived !== undefined && opts.archived !== null) {
    q = db
      .select()
      .from(ideas)
      .where(and(eq(ideas.userId, userId), eq(ideas.archived, opts.archived)))
      .orderBy(desc(ideas.priorityScore)) as typeof q;
  }
  return q;
}

export async function createIdea(
  userId: string,
  input: Omit<typeof ideas.$inferInsert, "id" | "userId" | "priorityScore">
) {
  const id = uid("i_");
  const score = calcPriorityScore({
    potentialViews: input.potentialViews ?? undefined,
    potentialSubs: input.potentialSubs ?? undefined,
    potentialRetention: input.potentialRetention ?? undefined,
    hypeLevel: input.hypeLevel ?? undefined,
    difficulty: (input.difficulty as Difficulty) ?? undefined,
  });
  await db.insert(ideas).values({ ...input, id, userId, priorityScore: score });
  return id;
}

export async function updateIdea(
  userId: string,
  id: string,
  patch: Partial<typeof ideas.$inferInsert>
) {
  const merged = { ...patch };
  const score = calcPriorityScore({
    potentialViews: merged.potentialViews,
    potentialSubs: merged.potentialSubs,
    potentialRetention: merged.potentialRetention,
    hypeLevel: merged.hypeLevel,
    difficulty: merged.difficulty as Difficulty | undefined,
  });
  if (
    merged.potentialViews != null ||
    merged.potentialSubs != null ||
    merged.potentialRetention != null ||
    merged.hypeLevel != null ||
    merged.difficulty != null
  ) {
    (merged as { priorityScore?: number }).priorityScore = score;
  }
  await db
    .update(ideas)
    .set(merged)
    .where(and(eq(ideas.id, id), eq(ideas.userId, userId)));
}

export async function deleteIdea(userId: string, id: string) {
  await db
    .delete(ideas)
    .where(and(eq(ideas.id, id), eq(ideas.userId, userId)));
}

// ──────────────────────────── VIDEOS ────────────────────────────
export async function listVideos(
  userId: string,
  opts: { status?: string | null; channel?: string | null } = {}
) {
  const where = [eq(videos.userId, userId)];
  if (opts.status) where.push(eq(videos.status, opts.status as any));
  if (opts.channel) where.push(eq(videos.channel, opts.channel as any));
  return db
    .select()
    .from(videos)
    .where(and(...where))
    .orderBy(desc(videos.updatedAt));
}

export async function createVideo(
  userId: string,
  input: Omit<typeof videos.$inferInsert, "id" | "userId">
) {
  const id = uid("v_");
  await db.insert(videos).values({ ...input, id, userId });
  return id;
}

export async function updateVideo(
  userId: string,
  id: string,
  patch: Partial<typeof videos.$inferInsert>
) {
  await db
    .update(videos)
    .set({ ...patch, updatedAt: new Date() })
    .where(and(eq(videos.id, id), eq(videos.userId, userId)));
}

export async function deleteVideo(userId: string, id: string) {
  await db
    .delete(videos)
    .where(and(eq(videos.id, id), eq(videos.userId, userId)));
}

// ──────────────────────────── PERFORMANCE ────────────────────────────
export async function upsertPerformance(
  videoId: string,
  patch: Partial<typeof performance.$inferInsert>
) {
  const existing = await db
    .select()
    .from(performance)
    .where(eq(performance.videoId, videoId))
    .limit(1);
  if (existing.length) {
    await db
      .update(performance)
      .set(patch)
      .where(eq(performance.videoId, videoId));
  } else {
    await db.insert(performance).values({
      id: uid("p_"),
      videoId,
      ...patch,
    });
  }
}

// ──────────────────────────── GRAVEYARD ────────────────────────────
export async function listGraveyard(userId: string) {
  return db
    .select()
    .from(graveyard)
    .where(eq(graveyard.userId, userId))
    .orderBy(desc(graveyard.buriedAt));
}

export async function addToGraveyard(
  userId: string,
  input: Omit<typeof graveyard.$inferInsert, "id" | "userId">
) {
  const id = uid("gv_");
  await db.insert(graveyard).values({ ...input, id, userId });
  return id;
}

export async function removeFromGraveyard(userId: string, id: string) {
  await db
    .delete(graveyard)
    .where(and(eq(graveyard.id, id), eq(graveyard.userId, userId)));
}

// ──────────────────────────── THUMBNAIL TESTS ────────────────────────────
export async function listThumbnailTests(userId: string) {
  return db
    .select()
    .from(thumbnailTests)
    .where(eq(thumbnailTests.userId, userId))
    .orderBy(desc(thumbnailTests.createdAt));
}

export async function createThumbnailTest(
  userId: string,
  input: Omit<typeof thumbnailTests.$inferInsert, "id" | "userId">
) {
  const id = uid("tt_");
  const winner =
    (input.ctrA ?? 0) > 0 && (input.ctrB ?? 0) > 0
      ? (input.ctrA ?? 0) >= (input.ctrB ?? 0)
        ? "A"
        : "B"
      : undefined;
  await db
    .insert(thumbnailTests)
    .values({ ...input, id, userId, winner: winner as any });
  return id;
}

export async function deleteThumbnailTest(userId: string, id: string) {
  await db
    .delete(thumbnailTests)
    .where(and(eq(thumbnailTests.id, id), eq(thumbnailTests.userId, userId)));
}

// ──────────────────────────── TITLES ────────────────────────────
export async function listTitles(userId: string) {
  return db
    .select()
    .from(titles)
    .where(eq(titles.userId, userId))
    .orderBy(desc(titles.ctr));
}

export async function createTitle(
  userId: string,
  input: Omit<typeof titles.$inferInsert, "id" | "userId" | "grade">
) {
  const id = uid("t_");
  const grade = gradeFromCtr(input.ctr ?? 0);
  await db.insert(titles).values({ ...input, id, userId, grade });
  return id;
}

export async function deleteTitle(userId: string, id: string) {
  await db
    .delete(titles)
    .where(and(eq(titles.id, id), eq(titles.userId, userId)));
}

// ──────────────────────────── RESEARCH ────────────────────────────
export async function listResearch(userId: string) {
  return db
    .select()
    .from(research)
    .where(eq(research.userId, userId))
    .orderBy(desc(research.pinned), desc(research.createdAt));
}

export async function createResearchItem(
  userId: string,
  input: Omit<typeof research.$inferInsert, "id" | "userId">
) {
  const id = uid("r_");
  await db.insert(research).values({ ...input, id, userId });
  return id;
}

export async function deleteResearchItem(userId: string, id: string) {
  await db
    .delete(research)
    .where(and(eq(research.id, id), eq(research.userId, userId)));
}

export async function toggleResearchPin(userId: string, id: string) {
  const item = await db
    .select()
    .from(research)
    .where(and(eq(research.id, id), eq(research.userId, userId)))
    .limit(1);
  if (item[0]) {
    await db
      .update(research)
      .set({ pinned: !item[0].pinned })
      .where(eq(research.id, id));
  }
}

// ──────────────────────────── ASSETS ────────────────────────────
export async function listAssets(userId: string) {
  return db
    .select()
    .from(assets)
    .where(eq(assets.userId, userId))
    .orderBy(desc(assets.createdAt));
}

export async function createAsset(
  userId: string,
  input: Omit<typeof assets.$inferInsert, "id" | "userId">
) {
  const id = uid("a_");
  await db.insert(assets).values({ ...input, id, userId });
  return id;
}

export async function deleteAsset(userId: string, id: string) {
  await db
    .delete(assets)
    .where(and(eq(assets.id, id), eq(assets.userId, userId)));
}

// ──────────────────────────── CALENDAR ────────────────────────────
export async function listCalendarEvents(
  userId: string,
  from?: Date,
  to?: Date
) {
  let q = db
    .select()
    .from(calendarEvents)
    .where(eq(calendarEvents.userId, userId))
    .orderBy(calendarEvents.startsAt);
  if (from && to) {
    q = db
      .select()
      .from(calendarEvents)
      .where(
        and(
          eq(calendarEvents.userId, userId),
          sql`${calendarEvents.startsAt} >= ${from}`,
          sql`${calendarEvents.startsAt} <= ${to}`
        )
      )
      .orderBy(calendarEvents.startsAt) as typeof q;
  }
  return q;
}

export async function createCalendarEvent(
  userId: string,
  input: Omit<typeof calendarEvents.$inferInsert, "id" | "userId">
) {
  const id = uid("e_");
  await db.insert(calendarEvents).values({ ...input, id, userId });
  return id;
}

export async function deleteCalendarEvent(userId: string, id: string) {
  await db
    .delete(calendarEvents)
    .where(and(eq(calendarEvents.id, id), eq(calendarEvents.userId, userId)));
}

// ──────────────────────────── INSIGHTS / DASHBOARD ────────────────────
export async function getDashboardStats(userId: string) {
  const [videoCounts, gameCount, ideaCount, graveyardCount] = await Promise.all([
    db
      .select({ status: videos.status, total: count() })
      .from(videos)
      .where(eq(videos.userId, userId))
      .groupBy(videos.status),
    db
      .select({ total: count() })
      .from(games)
      .where(eq(games.userId, userId)),
    db
      .select({ total: count() })
      .from(ideas)
      .where(and(eq(ideas.userId, userId), eq(ideas.archived, false))),
    db
      .select({ total: count() })
      .from(graveyard)
      .where(eq(graveyard.userId, userId)),
  ]);

  const perfStats = await db
    .select({
      avgCtr: avg(performance.ctr),
      avgRetention: avg(performance.retention),
      totalViews: sql<number>`coalesce(sum(${performance.views}), 0)`,
      totalSubs: sql<number>`coalesce(sum(${performance.subscribers}), 0)`,
    })
    .from(performance)
    .innerJoin(videos, eq(videos.id, performance.videoId))
    .where(eq(videos.userId, userId));

  return {
    byStatus: videoCounts,
    games: gameCount[0]?.total ?? 0,
    ideas: ideaCount[0]?.total ?? 0,
    graveyard: graveyardCount[0]?.total ?? 0,
    avgCtr: Number(perfStats[0]?.avgCtr ?? 0),
    avgRetention: Number(perfStats[0]?.avgRetention ?? 0),
    totalViews: Number(perfStats[0]?.totalViews ?? 0),
    totalSubs: Number(perfStats[0]?.totalSubs ?? 0),
  };
}

export async function getMonthlyProduction(userId: string) {
  const rows = await db.execute(sql`
    SELECT
      to_char(published_at, 'YYYY-MM') AS month,
      COUNT(*) AS total
    FROM cb_videos
    WHERE user_id = ${userId}
      AND published_at IS NOT NULL
      AND status = 'published'
    GROUP BY to_char(published_at, 'YYYY-MM')
    ORDER BY month ASC
    LIMIT 12
  `);
  return rows.rows as { month: string; total: string }[];
}

export async function getPerformanceByGame(userId: string) {
  const rows = await db.execute(sql`
    SELECT
      COALESCE(g.name, 'Sem jogo') AS game,
      AVG(p.ctr) AS ctr,
      AVG(p.retention) AS retention,
      SUM(p.views) AS views,
      SUM(p.subscribers) AS subscribers
    FROM cb_videos v
    LEFT JOIN cb_performance p ON p.video_id = v.id
    LEFT JOIN cb_games g ON g.id = v.game_id
    WHERE v.user_id = ${userId} AND v.status = 'published'
    GROUP BY g.name
    ORDER BY views DESC
    LIMIT 10
  `);
  return rows.rows as {
    game: string;
    ctr: string;
    retention: string;
    views: string;
    subscribers: string;
  }[];
}

export async function getInsights(userId: string) {
  const [byGame, titleGrades, thumbStats] = await Promise.all([
    getPerformanceByGame(userId),
    db
      .select({ grade: titles.grade, total: count() })
      .from(titles)
      .where(eq(titles.userId, userId))
      .groupBy(titles.grade),
    db
      .select({
        total: count(),
        avgCtrA: avg(thumbnailTests.ctrA),
        avgCtrB: avg(thumbnailTests.ctrB),
      })
      .from(thumbnailTests)
      .where(eq(thumbnailTests.userId, userId)),
  ]);

  return {
    byGame,
    titleGrades,
    thumbnailTests: thumbStats[0],
  };
}
