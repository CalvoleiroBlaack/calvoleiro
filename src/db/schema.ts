import {
  pgTable,
  text,
  timestamp,
  integer,
  real,
  boolean,
  pgEnum,
  jsonb,
  varchar,
} from "drizzle-orm/pg-core";

// ──────────────────────────── ENUMS ────────────────────────────
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const channelEnum = pgEnum("channel", ["allanos", "lowsersave", "both"]);
export const videoStatusEnum = pgEnum("video_status", [
  "idea",
  "research",
  "planning",
  "script",
  "recording",
  "editing",
  "thumbnail",
  "scheduled",
  "published",
]);
export const priorityEnum = pgEnum("priority", ["low", "medium", "high", "critical"]);
export const difficultyEnum = pgEnum("difficulty", ["easy", "medium", "hard", "extreme"]);
export const videoTypeEnum = pgEnum("video_type", [
  "video",
  "short",
  "live",
  "series",
]);
export const gameGenreEnum = pgEnum("game_genre", [
  "terror",
  "fnaf",
  "mascot_horror",
  "analog_horror",
  "indie",
  "release",
  "curiosities",
  "weird",
  "rpg",
  "campaign",
  "various",
]);
export const gameStatusEnum = pgEnum("game_status", [
  "active",
  "paused",
  "dropped",
  "completed",
]);
export const titleGradeEnum = pgEnum("title_grade", [
  "excellent",
  "good",
  "weak",
  "bad",
]);
export const assetTypeEnum = pgEnum("asset_type", [
  "thumbnail",
  "sound",
  "meme",
  "video",
  "effect",
  "music",
  "image",
  "gif",
  "audio",
  "template",
  "logo",
  "other",
]);
export const projectStatusEnum = pgEnum("project_status", [
  "active",
  "planning",
  "on_hold",
  "completed",
  "archived",
]);
export const reminderStatusEnum = pgEnum("reminder_status", [
  "pending",
  "done",
  "snoozed",
  "cancelled",
]);
export const linkStatusEnum = pgEnum("link_status", [
  "unread",
  "reading",
  "read",
  "archived",
]);

// ──────────────────────────── USERS ────────────────────────────
export const users = pgTable("cb_users", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 200 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  avatarUrl: text("avatar_url"),
  primaryChannel: channelEnum("primary_channel").default("allanos"),
  role: roleEnum("role").default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ──────────────────────────── USER PROFILE / PREFS ─────────────
export const userProfiles = pgTable("cl_user_profiles", {
  userId: text("user_id").primaryKey(),
  displayName: varchar("display_name", { length: 120 }),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  avatarGifUrl: text("avatar_gif_url"),
  bannerUrl: text("banner_url"),
  accentColor: varchar("accent_color", { length: 20 }).default("#3b82f6"),
  theme: varchar("theme", { length: 30 }).default("midnight"),
  socials: jsonb("socials").$type<Record<string, string>>().default({}),
  preferences: jsonb("preferences").$type<Record<string, unknown>>().default({}),
  enabledModules: jsonb("enabled_modules").$type<string[]>().default([
    "dashboard",
    "projects",
    "games",
    "ideas",
    "videos",
    "links",
    "research",
    "assets",
    "calendar",
    "reminders",
  ]),
  widgetLayout: jsonb("widget_layout").$type<string[]>().default([
    "projects",
    "recent_links",
    "upcoming_videos",
    "reminders",
    "ideas",
    "research",
  ]),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ──────────────────────────── PROJECTS ─────────────────────────
export const projects = pgTable("cl_projects", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }),
  description: text("description"),
  status: projectStatusEnum("status").default("active"),
  color: varchar("color", { length: 20 }).default("#3b82f6"),
  icon: varchar("icon", { length: 30 }).default("folder"),
  pinned: boolean("pinned").default(false),
  tags: jsonb("tags").$type<string[]>().default([]),
  coverUrl: text("cover_url"),
  archivedAt: timestamp("archived_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ──────────────────────────── LINKS LIBRARY ─────────────────────
export const links = pgTable("cl_links", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  projectId: text("project_id"),
  url: text("url").notNull(),
  title: varchar("title", { length: 400 }),
  description: text("description"),
  imageUrl: text("image_url"),
  faviconUrl: text("favicon_url"),
  siteName: varchar("site_name", { length: 200 }),
  category: varchar("category", { length: 60 }),
  folder: varchar("folder", { length: 120 }),
  tags: jsonb("tags").$type<string[]>().default([]),
  notes: text("notes"),
  favorite: boolean("favorite").default(false),
  status: linkStatusEnum("status").default("unread"),
  savedAt: timestamp("saved_at").defaultNow().notNull(),
});

// ──────────────────────────── RESEARCH ITEMS ────────────────────
export const researchItems = pgTable("cl_research_items", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  projectId: text("project_id"),
  title: varchar("title", { length: 400 }).notNull(),
  kind: varchar("kind", { length: 30 }).default("article"), // article, video, tweet, reddit, image, pdf, note
  url: text("url"),
  source: varchar("source", { length: 120 }),
  excerpt: text("excerpt"),
  imageUrl: text("image_url"),
  tags: jsonb("tags").$type<string[]>().default([]),
  notes: text("notes"),
  favorite: boolean("favorite").default(false),
  pinned: boolean("pinned").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ──────────────────────────── REMINDERS / TASKS ─────────────────
export const reminders = pgTable("cl_reminders", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  projectId: text("project_id"),
  title: varchar("title", { length: 300 }).notNull(),
  notes: text("notes"),
  dueAt: timestamp("due_at"),
  status: reminderStatusEnum("status").default("pending"),
  priority: priorityEnum("priority").default("medium"),
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ──────────────────────────── GAMES (estendido) ─────────────────
export const games = pgTable("cb_games", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  genre: gameGenreEnum("genre").notNull(),
  platform: varchar("platform", { length: 80 }),
  status: gameStatusEnum("status").default("active"),
  channel: channelEnum("channel").default("allanos"),
  projectId: text("project_id"),
  videoCount: integer("video_count").default(0),
  lastVideoAt: timestamp("last_video_at"),
  growthPotential: integer("growth_potential").default(50),
  notes: text("notes"),
  coverUrl: text("cover_url"),
  // ── novos campos (preenchimento via API pública futura) ──
  logoUrl: text("logo_url"),
  bannerUrl: text("banner_url"),
  trailerUrl: text("trailer_url"),
  releaseYear: integer("release_year"),
  releaseDate: timestamp("release_date"),
  studio: varchar("studio", { length: 200 }),
  publisher: varchar("publisher", { length: 200 }),
  description: text("description"),
  platforms: jsonb("platforms").$type<string[]>().default([]),
  rating: real("rating"),
  externalId: varchar("external_id", { length: 120 }), // RAWG/IGDB ID
  externalSource: varchar("external_source", { length: 30 }), // 'rawg' | 'igdb' | 'manual'
  // ── valor para o canal ──
  worthShort: boolean("worth_short").default(false),
  worthLive: boolean("worth_live").default(false),
  worthSeries: boolean("worth_series").default(false),
  worthReview: boolean("worth_review").default(false),
  worthCuriosities: boolean("worth_curiosities").default(false),
  worthIceberg: boolean("worth_iceberg").default(false),
  estimatedVideos: integer("estimated_videos"),
  estimatedHours: real("estimated_hours"),
  priority: priorityEnum("priority").default("medium"),
  checklist: jsonb("checklist").$type<{ text: string; done: boolean }[]>().default([]),
  tags: jsonb("tags").$type<string[]>().default([]),
  favorite: boolean("favorite").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ──────────────────────────── IDEAS BANK ────────────────────
export const ideas = pgTable("cb_ideas", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  projectId: text("project_id"),
  title: varchar("title", { length: 300 }).notNull(),
  gameId: text("game_id"),
  hook: text("hook"),
  description: text("description"),
  thumbnailConcept: text("thumbnail_concept"),
  type: videoTypeEnum("type").default("video"),
  potentialViews: integer("potential_views").default(50),
  potentialSubs: integer("potential_subs").default(50),
  potentialRetention: integer("potential_retention").default(50),
  hypeLevel: integer("hype_level").default(50),
  priorityScore: integer("priority_score").default(0),
  difficulty: difficultyEnum("difficulty").default("medium"),
  channel: channelEnum("channel").default("allanos"),
  tags: jsonb("tags").$type<string[]>().default([]),
  archived: boolean("archived").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ──────────────────────────── VIDEOS / KANBAN ────────────────────
export const videos = pgTable("cb_videos", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  projectId: text("project_id"),
  title: varchar("title", { length: 400 }).notNull(),
  status: videoStatusEnum("status").default("idea"),
  type: videoTypeEnum("type").default("video"),
  gameId: text("game_id"),
  ideaId: text("idea_id"),
  channel: channelEnum("channel").default("allanos"),
  priority: priorityEnum("priority").default("medium"),
  difficulty: difficultyEnum("difficulty").default("medium"),
  scheduledAt: timestamp("scheduled_at"),
  publishedAt: timestamp("published_at"),
  estimatedMinutes: integer("estimated_minutes"),
  mission: text("mission"),
  promise: text("promise"),
  conflict: text("conflict"),
  satisfaction: text("satisfaction"),
  notes: text("notes"),
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ──────────────────────────── PERFORMANCE ────────────────────
export const performance = pgTable("cb_performance", {
  id: text("id").primaryKey(),
  videoId: text("video_id").notNull().unique(),
  views: integer("views").default(0),
  ctr: real("ctr").default(0),
  retention: real("retention").default(0),
  watchTimeMinutes: real("watch_time_minutes").default(0),
  subscribers: integer("subscribers").default(0),
  impressions: integer("impressions").default(0),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
});

// ──────────────────────────── GRAVEYARD ────────────────────
export const graveyard = pgTable("cb_graveyard", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: varchar("title", { length: 400 }).notNull(),
  thumbnailUrl: text("thumbnail_url"),
  views: integer("views").default(0),
  ctr: real("ctr").default(0),
  retention: real("retention").default(0),
  failureReason: text("failure_reason"),
  gameId: text("game_id"),
  channel: channelEnum("channel").default("allanos"),
  buriedAt: timestamp("buried_at").defaultNow().notNull(),
});

// ──────────────────────────── THUMBNAIL LAB ────────────────────
export const thumbnailTests = pgTable("cb_thumbnail_tests", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  videoId: text("video_id"),
  title: varchar("title", { length: 300 }).notNull(),
  thumbnailAUrl: text("thumbnail_a_url"),
  thumbnailBUrl: text("thumbnail_b_url"),
  ctrA: real("ctr_a").default(0),
  ctrB: real("ctr_b").default(0),
  impressionsA: integer("impressions_a").default(0),
  impressionsB: integer("impressions_b").default(0),
  winner: varchar("winner", { length: 4 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ──────────────────────────── TITLES ────────────────────
export const titles = pgTable("cb_titles", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: varchar("title", { length: 400 }).notNull(),
  videoId: text("video_id"),
  ctr: real("ctr").default(0),
  grade: titleGradeEnum("grade").default("weak"),
  channel: channelEnum("channel").default("allanos"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ──────────────────────────── RESEARCH (legacy module) ──────────
export const research = pgTable("cb_research", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: varchar("title", { length: 300 }).notNull(),
  category: varchar("category", { length: 60 }).default("trends"),
  url: text("url"),
  imageUrl: text("image_url"),
  notes: text("notes"),
  channel: channelEnum("channel").default("allanos"),
  pinned: boolean("pinned").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ──────────────────────────── ASSETS ────────────────────
export const assets = pgTable("cb_assets", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  projectId: text("project_id"),
  name: varchar("name", { length: 200 }).notNull(),
  type: assetTypeEnum("type").notNull(),
  url: text("url"),
  thumbnailUrl: text("thumbnail_url"),
  folder: varchar("folder", { length: 120 }),
  mimeType: varchar("mime_type", { length: 60 }),
  sizeBytes: integer("size_bytes"),
  tags: jsonb("tags").$type<string[]>().default([]),
  favorite: boolean("favorite").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ──────────────────────────── CALENDAR EVENTS ────────────────────
export const calendarEvents = pgTable("cb_calendar_events", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  projectId: text("project_id"),
  title: varchar("title", { length: 300 }).notNull(),
  type: videoTypeEnum("type").default("video"),
  videoId: text("video_id"),
  channel: channelEnum("channel").default("allanos"),
  color: varchar("color", { length: 20 }),
  startsAt: timestamp("starts_at").notNull(),
  endsAt: timestamp("ends_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ──────────────────────────── ACTIVITY LOG ──────────────────────
export const activityLog = pgTable("cl_activity_log", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  action: varchar("action", { length: 40 }).notNull(),
  entityType: varchar("entity_type", { length: 40 }).notNull(),
  entityId: text("entity_id"),
  meta: jsonb("meta").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
