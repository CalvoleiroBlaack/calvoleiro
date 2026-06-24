"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/session";
import * as svc from "@/services";
import { gradeFromCtr } from "@/lib/utils";
import type { Difficulty } from "@/types";

export type ActionResult = { error?: string; success?: string } | null;

async function withAuth<T>(
  fn: (userId: string) => Promise<T>
): Promise<T> {
  const session = await requireSession();
  return fn(session.userId);
}

// ──────────────────────────── GAMES ────────────────────────────
export async function createGameAction(
  _s: ActionResult,
  fd: FormData
): Promise<ActionResult> {
  try {
    await withAuth(async (userId) => {
      await svc.createGame(userId, {
        name: String(fd.get("name")),
        genre: String(fd.get("genre")) as any,
        platform: (fd.get("platform") as string) || null,
        status: (fd.get("status") as any) || "active",
        channel: (fd.get("channel") as any) || "allanos",
        growthPotential: Number(fd.get("growthPotential")) || 50,
        notes: (fd.get("notes") as string) || null,
      });
    });
  } catch (e) {
    return { error: (e as Error).message };
  }
  revalidatePath("/app/games");
  return { success: "Jogo cadastrado" };
}

export async function deleteGameAction(id: string) {
  await withAuth((userId) => svc.deleteGame(userId, id));
  revalidatePath("/app/games");
}

// ──────────────────────────── IDEAS ────────────────────────────
export async function createIdeaAction(
  _s: ActionResult,
  fd: FormData
): Promise<ActionResult> {
  try {
    await withAuth(async (userId) => {
      await svc.createIdea(userId, {
        title: String(fd.get("title")),
        gameId: (fd.get("gameId") as string) || null,
        hook: (fd.get("hook") as string) || null,
        thumbnailConcept: (fd.get("thumbnailConcept") as string) || null,
        type: (fd.get("type") as any) || "video",
        channel: (fd.get("channel") as any) || "allanos",
        difficulty: (fd.get("difficulty") as Difficulty) || "medium",
        potentialViews: Number(fd.get("potentialViews")) || 50,
        potentialSubs: Number(fd.get("potentialSubs")) || 50,
        potentialRetention: Number(fd.get("potentialRetention")) || 50,
        hypeLevel: Number(fd.get("hypeLevel")) || 50,
      });
    });
  } catch (e) {
    return { error: (e as Error).message };
  }
  revalidatePath("/app/ideas");
  return { success: "Ideia cadastrada" };
}

export async function deleteIdeaAction(id: string) {
  await withAuth((userId) => svc.deleteIdea(userId, id));
  revalidatePath("/app/ideas");
}

export async function archiveIdeaAction(id: string, archived: boolean) {
  await withAuth((userId) => svc.updateIdea(userId, id, { archived }));
  revalidatePath("/app/ideas");
}

// ──────────────────────────── VIDEOS ────────────────────────────
export async function createVideoAction(
  _s: ActionResult,
  fd: FormData
): Promise<ActionResult> {
  try {
    await withAuth(async (userId) => {
      await svc.createVideo(userId, {
        title: String(fd.get("title")),
        status: (fd.get("status") as any) || "idea",
        type: (fd.get("type") as any) || "video",
        gameId: (fd.get("gameId") as string) || null,
        channel: (fd.get("channel") as any) || "allanos",
        priority: (fd.get("priority") as any) || "medium",
        difficulty: (fd.get("difficulty") as any) || "medium",
        estimatedMinutes: Number(fd.get("estimatedMinutes")) || null,
        mission: (fd.get("mission") as string) || null,
        promise: (fd.get("promise") as string) || null,
        conflict: (fd.get("conflict") as string) || null,
        satisfaction: (fd.get("satisfaction") as string) || null,
        notes: (fd.get("notes") as string) || null,
        scheduledAt: fd.get("scheduledAt")
          ? new Date(String(fd.get("scheduledAt")))
          : null,
      });
    });
  } catch (e) {
    return { error: (e as Error).message };
  }
  revalidatePath("/app/production");
  revalidatePath("/app");
  return { success: "Vídeo criado" };
}

export async function updateVideoStatusAction(
  id: string,
  status: string,
  extra: { publishedAt?: Date | null; scheduledAt?: Date | null } = {}
) {
  await withAuth(async (userId) => {
    await svc.updateVideo(userId, id, {
      status: status as any,
      ...(status === "published" ? { publishedAt: new Date() } : {}),
      ...extra,
    });
  });
  revalidatePath("/app/production");
  revalidatePath("/app");
}

export async function deleteVideoAction(id: string) {
  await withAuth((userId) => svc.deleteVideo(userId, id));
  revalidatePath("/app/production");
  revalidatePath("/app");
}

// ──────────────────────────── PERFORMANCE ────────────────────────────
export async function upsertPerformanceAction(
  _s: ActionResult,
  fd: FormData
): Promise<ActionResult> {
  try {
    await withAuth(async () => {
      await svc.upsertPerformance(String(fd.get("videoId")), {
        views: Number(fd.get("views")) || 0,
        ctr: Number(fd.get("ctr")) || 0,
        retention: Number(fd.get("retention")) || 0,
        watchTimeMinutes: Number(fd.get("watchTimeMinutes")) || 0,
        subscribers: Number(fd.get("subscribers")) || 0,
        impressions: Number(fd.get("impressions")) || 0,
      });
    });
  } catch (e) {
    return { error: (e as Error).message };
  }
  revalidatePath("/app/performance");
  revalidatePath("/app");
  return { success: "Métricas salvas" };
}

// ──────────────────────────── GRAVEYARD ────────────────────────────
export async function addToGraveyardAction(
  _s: ActionResult,
  fd: FormData
): Promise<ActionResult> {
  try {
    await withAuth(async (userId) => {
      await svc.addToGraveyard(userId, {
        title: String(fd.get("title")),
        views: Number(fd.get("views")) || 0,
        ctr: Number(fd.get("ctr")) || 0,
        retention: Number(fd.get("retention")) || 0,
        failureReason: (fd.get("failureReason") as string) || null,
        gameId: (fd.get("gameId") as string) || null,
        channel: (fd.get("channel") as any) || "allanos",
      });
    });
  } catch (e) {
    return { error: (e as Error).message };
  }
  revalidatePath("/app/graveyard");
  return { success: "Adicionado ao cemitério" };
}

export async function removeFromGraveyardAction(id: string) {
  await withAuth((userId) => svc.removeFromGraveyard(userId, id));
  revalidatePath("/app/graveyard");
}

// ──────────────────────────── THUMBNAIL TESTS ────────────────────────────
export async function createThumbnailTestAction(
  _s: ActionResult,
  fd: FormData
): Promise<ActionResult> {
  try {
    await withAuth(async (userId) => {
      await svc.createThumbnailTest(userId, {
        title: String(fd.get("title")),
        videoId: (fd.get("videoId") as string) || null,
        ctrA: Number(fd.get("ctrA")) || 0,
        ctrB: Number(fd.get("ctrB")) || 0,
        impressionsA: Number(fd.get("impressionsA")) || 0,
        impressionsB: Number(fd.get("impressionsB")) || 0,
        notes: (fd.get("notes") as string) || null,
      });
    });
  } catch (e) {
    return { error: (e as Error).message };
  }
  revalidatePath("/app/thumbnails");
  return { success: "Teste registrado" };
}

export async function deleteThumbnailTestAction(id: string) {
  await withAuth((userId) => svc.deleteThumbnailTest(userId, id));
  revalidatePath("/app/thumbnails");
}

// ──────────────────────────── TITLES ────────────────────────────
export async function createTitleAction(
  _s: ActionResult,
  fd: FormData
): Promise<ActionResult> {
  try {
    await withAuth(async (userId) => {
      await svc.createTitle(userId, {
        title: String(fd.get("title")),
        videoId: (fd.get("videoId") as string) || null,
        ctr: Number(fd.get("ctr")) || 0,
        channel: (fd.get("channel") as any) || "allanos",
      });
    });
  } catch (e) {
    return { error: (e as Error).message };
  }
  revalidatePath("/app/titles");
  return { success: "Título cadastrado" };
}

export async function deleteTitleAction(id: string) {
  await withAuth((userId) => svc.deleteTitle(userId, id));
  revalidatePath("/app/titles");
}

// ──────────────────────────── RESEARCH ────────────────────────────
export async function createResearchAction(
  _s: ActionResult,
  fd: FormData
): Promise<ActionResult> {
  try {
    await withAuth(async (userId) => {
      await svc.createResearchItem(userId, {
        title: String(fd.get("title")),
        category: (fd.get("category") as string) || "trends",
        url: (fd.get("url") as string) || null,
        notes: (fd.get("notes") as string) || null,
        channel: (fd.get("channel") as any) || "allanos",
      });
    });
  } catch (e) {
    return { error: (e as Error).message };
  }
  revalidatePath("/app/research");
  return { success: "Pesquisa adicionada" };
}

export async function deleteResearchAction(id: string) {
  await withAuth((userId) => svc.deleteResearchItem(userId, id));
  revalidatePath("/app/research");
}

export async function togglePinResearchAction(id: string) {
  await withAuth((userId) => svc.toggleResearchPin(userId, id));
  revalidatePath("/app/research");
}

// ──────────────────────────── ASSETS ────────────────────────────
export async function createAssetAction(
  _s: ActionResult,
  fd: FormData
): Promise<ActionResult> {
  try {
    await withAuth(async (userId) => {
      const file = fd.get("file") as File | null;
      let url: string | null = null;
      let sizeBytes: number | null = null;
      let mimeType: string | null = null;
      if (file && file.size > 0) {
        // Simula upload: armazenar como data URL para o preview.
        // Em produção seria Firebase Storage.
        const buf = Buffer.from(await file.arrayBuffer());
        const b64 = buf.toString("base64");
        mimeType = file.type || "application/octet-stream";
        sizeBytes = file.size;
        url = `data:${mimeType};base64,${b64}`;
      }
      await svc.createAsset(userId, {
        name: String(fd.get("name") || file?.name || "asset"),
        type: (fd.get("type") as any) || "thumbnail",
        url,
        mimeType,
        sizeBytes,
        tags: [],
      });
    });
  } catch (e) {
    return { error: (e as Error).message };
  }
  revalidatePath("/app/assets");
  return { success: "Asset cadastrado" };
}

export async function deleteAssetAction(id: string) {
  await withAuth((userId) => svc.deleteAsset(userId, id));
  revalidatePath("/app/assets");
}

// ──────────────────────────── CALENDAR ────────────────────────────
export async function createCalendarEventAction(
  _s: ActionResult,
  fd: FormData
): Promise<ActionResult> {
  try {
    await withAuth(async (userId) => {
      await svc.createCalendarEvent(userId, {
        title: String(fd.get("title")),
        type: (fd.get("type") as any) || "video",
        videoId: (fd.get("videoId") as string) || null,
        channel: (fd.get("channel") as any) || "allanos",
        startsAt: new Date(String(fd.get("startsAt"))),
        notes: (fd.get("notes") as string) || null,
      });
    });
  } catch (e) {
    return { error: (e as Error).message };
  }
  revalidatePath("/app/calendar");
  return { success: "Evento criado" };
}

export async function deleteCalendarEventAction(id: string) {
  await withAuth((userId) => svc.deleteCalendarEvent(userId, id));
  revalidatePath("/app/calendar");
}

// ──────────────────────────── PROFILE ────────────────────────────
export async function updateProfileAction(
  _s: ActionResult,
  fd: FormData
): Promise<ActionResult> {
  try {
    const session = await requireSession();
    const { db } = await import("@/db");
    const { users } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");
    await db
      .update(users)
      .set({
        name: String(fd.get("name")),
        primaryChannel: (fd.get("primaryChannel") as any) || "allanos",
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.userId));
  } catch (e) {
    return { error: (e as Error).message };
  }
  revalidatePath("/app");
  redirect("/app");
}

// Helper re-export for use in pages
export { gradeFromCtr };
