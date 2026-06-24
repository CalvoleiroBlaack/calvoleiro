"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/session";
import * as svc from "@/services/calvoleiro";

export type ActionResult = { error?: string; success?: string } | null;

async function withAuth<T>(fn: (userId: string) => Promise<T>) {
  const s = await requireSession();
  return fn(s.userId);
}

// PROJECTS
export async function createProjectAction(
  _s: ActionResult,
  fd: FormData
): Promise<ActionResult> {
  try {
    await withAuth((uid) =>
      svc.createProject(uid, {
        name: String(fd.get("name")),
        description: (fd.get("description") as string) || null,
        status: (fd.get("status") as any) || "active",
        color: (fd.get("color") as string) || "#3b82f6",
        icon: (fd.get("icon") as string) || "folder",
        pinned: fd.get("pinned") === "on",
      })
    );
  } catch (e) {
    return { error: (e as Error).message };
  }
  revalidatePath("/app/projects");
  revalidatePath("/app");
  return { success: "Projeto criado" };
}

export async function updateProjectAction(id: string, patch: any) {
  await withAuth((uid) => svc.updateProject(uid, id, patch));
  revalidatePath("/app/projects");
  revalidatePath("/app");
}

export async function deleteProjectAction(id: string) {
  await withAuth((uid) => svc.deleteProject(uid, id));
  revalidatePath("/app/projects");
  revalidatePath("/app");
}

// LINKS
export async function createLinkAction(
  _s: ActionResult,
  fd: FormData
): Promise<ActionResult> {
  try {
    await withAuth((uid) =>
      svc.createLink(uid, {
        url: String(fd.get("url")),
        title: (fd.get("title") as string) || null,
        description: (fd.get("description") as string) || null,
        siteName: (fd.get("siteName") as string) || null,
        category: (fd.get("category") as string) || null,
        folder: (fd.get("folder") as string) || null,
        notes: (fd.get("notes") as string) || null,
        projectId: (fd.get("projectId") as string) || null,
        favorite: fd.get("favorite") === "on",
      })
    );
  } catch (e) {
    return { error: (e as Error).message };
  }
  revalidatePath("/app/links");
  revalidatePath("/app");
  return { success: "Link salvo" };
}

export async function deleteLinkAction(id: string) {
  await withAuth((uid) => svc.deleteLink(uid, id));
  revalidatePath("/app/links");
}

export async function toggleLinkFavoriteAction(id: string, fav: boolean) {
  await withAuth((uid) => svc.updateLink(uid, id, { favorite: fav }));
  revalidatePath("/app/links");
}

// RESEARCH ITEMS (Calvoleiro v2)
export async function createResearchItemAction(
  _s: ActionResult,
  fd: FormData
): Promise<ActionResult> {
  try {
    await withAuth((uid) =>
      svc.createResearchItem(uid, {
        title: String(fd.get("title")),
        kind: (fd.get("kind") as string) || "article",
        url: (fd.get("url") as string) || null,
        source: (fd.get("source") as string) || null,
        excerpt: (fd.get("excerpt") as string) || null,
        notes: (fd.get("notes") as string) || null,
        projectId: (fd.get("projectId") as string) || null,
      })
    );
  } catch (e) {
    return { error: (e as Error).message };
  }
  revalidatePath("/app/research");
  return { success: "Pesquisa adicionada" };
}

export async function deleteResearchItemAction(id: string) {
  await withAuth((uid) => svc.deleteResearchItemNew(uid, id));
  revalidatePath("/app/research");
}

// REMINDERS
export async function createReminderAction(
  _s: ActionResult,
  fd: FormData
): Promise<ActionResult> {
  try {
    await withAuth((uid) =>
      svc.createReminder(uid, {
        title: String(fd.get("title")),
        notes: (fd.get("notes") as string) || null,
        dueAt: fd.get("dueAt") ? new Date(String(fd.get("dueAt"))) : null,
        priority: (fd.get("priority") as any) || "medium",
        projectId: (fd.get("projectId") as string) || null,
      })
    );
  } catch (e) {
    return { error: (e as Error).message };
  }
  revalidatePath("/app/reminders");
  revalidatePath("/app");
  return { success: "Lembrete criado" };
}

export async function toggleReminderAction(id: string, done: boolean) {
  await withAuth((uid) =>
    svc.updateReminder(uid, id, { status: done ? "done" : "pending" })
  );
  revalidatePath("/app/reminders");
  revalidatePath("/app");
}

export async function deleteReminderAction(id: string) {
  await withAuth((uid) => svc.deleteReminder(uid, id));
  revalidatePath("/app/reminders");
  revalidatePath("/app");
}

// PROFILE
export async function updateProfileAction(
  _s: ActionResult,
  fd: FormData
): Promise<ActionResult> {
  try {
    await withAuth((uid) =>
      svc.upsertProfile(uid, {
        displayName: (fd.get("displayName") as string) || null,
        bio: (fd.get("bio") as string) || null,
        avatarUrl: (fd.get("avatarUrl") as string) || null,
        avatarGifUrl: (fd.get("avatarGifUrl") as string) || null,
        bannerUrl: (fd.get("bannerUrl") as string) || null,
        accentColor: (fd.get("accentColor") as string) || "#3b82f6",
        theme: (fd.get("theme") as string) || "midnight",
        socials: {
          twitter: (fd.get("twitter") as string) || "",
          youtube: (fd.get("youtube") as string) || "",
          twitch: (fd.get("twitch") as string) || "",
          github: (fd.get("github") as string) || "",
          website: (fd.get("website") as string) || "",
        },
      })
    );
  } catch (e) {
    return { error: (e as Error).message };
  }
  revalidatePath("/app/profile");
  return { success: "Perfil atualizado" };
}
