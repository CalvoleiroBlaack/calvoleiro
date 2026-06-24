-- CONTENT BRAIN – Supabase Setup
-- Execute via Supabase SQL Editor, OU use: npx drizzle-kit push
-- Este arquivo é apenas para referência / debug manual.

-- Enums
DO $$ BEGIN CREATE TYPE role AS ENUM ('user','admin'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE channel AS ENUM ('allanos','lowsersave','both'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE video_status AS ENUM ('idea','research','planning','script','recording','editing','thumbnail','scheduled','published'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE priority AS ENUM ('low','medium','high','critical'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE difficulty AS ENUM ('easy','medium','hard','extreme'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE video_type AS ENUM ('video','short','live','series'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE game_genre AS ENUM ('terror','fnaf','mascot_horror','analog_horror','indie','release','curiosities','weird','rpg','campaign','various'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE game_status AS ENUM ('active','paused','dropped','completed'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE title_grade AS ENUM ('excellent','good','weak','bad'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE asset_type AS ENUM ('thumbnail','sound','meme','video','effect','music'); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Tabelas (ordem segura)
CREATE TABLE IF NOT EXISTS cb_users (
  id text PRIMARY KEY,
  name varchar(120) NOT NULL,
  email varchar(200) NOT NULL UNIQUE,
  password_hash text NOT NULL,
  avatar_url text,
  primary_channel channel DEFAULT 'allanos',
  role role DEFAULT 'user',
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS cb_games (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  name varchar(200) NOT NULL,
  genre game_genre NOT NULL,
  platform varchar(80),
  status game_status DEFAULT 'active',
  channel channel DEFAULT 'allanos',
  video_count integer DEFAULT 0,
  last_video_at timestamp,
  growth_potential integer DEFAULT 50,
  notes text,
  cover_url text,
  created_at timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS cb_ideas (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  title varchar(300) NOT NULL,
  game_id text,
  hook text,
  thumbnail_concept text,
  type video_type DEFAULT 'video',
  potential_views integer DEFAULT 50,
  potential_subs integer DEFAULT 50,
  potential_retention integer DEFAULT 50,
  hype_level integer DEFAULT 50,
  priority_score integer DEFAULT 0,
  difficulty difficulty DEFAULT 'medium',
  channel channel DEFAULT 'allanos',
  archived boolean DEFAULT false,
  created_at timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS cb_videos (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  title varchar(400) NOT NULL,
  status video_status DEFAULT 'idea',
  type video_type DEFAULT 'video',
  game_id text,
  idea_id text,
  channel channel DEFAULT 'allanos',
  priority priority DEFAULT 'medium',
  difficulty difficulty DEFAULT 'medium',
  scheduled_at timestamp,
  published_at timestamp,
  estimated_minutes integer,
  mission text,
  promise text,
  conflict text,
  satisfaction text,
  notes text,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS cb_performance (
  id text PRIMARY KEY,
  video_id text NOT NULL UNIQUE,
  views integer DEFAULT 0,
  ctr real DEFAULT 0,
  retention real DEFAULT 0,
  watch_time_minutes real DEFAULT 0,
  subscribers integer DEFAULT 0,
  impressions integer DEFAULT 0,
  recorded_at timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS cb_graveyard (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  title varchar(400) NOT NULL,
  thumbnail_url text,
  views integer DEFAULT 0,
  ctr real DEFAULT 0,
  retention real DEFAULT 0,
  failure_reason text,
  game_id text,
  channel channel DEFAULT 'allanos',
  buried_at timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS cb_thumbnail_tests (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  video_id text,
  title varchar(300) NOT NULL,
  thumbnail_a_url text,
  thumbnail_b_url text,
  ctr_a real DEFAULT 0,
  ctr_b real DEFAULT 0,
  impressions_a integer DEFAULT 0,
  impressions_b integer DEFAULT 0,
  winner varchar(4),
  notes text,
  created_at timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS cb_titles (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  title varchar(400) NOT NULL,
  video_id text,
  ctr real DEFAULT 0,
  grade title_grade DEFAULT 'weak',
  channel channel DEFAULT 'allanos',
  created_at timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS cb_research (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  title varchar(300) NOT NULL,
  category varchar(60) DEFAULT 'trends',
  url text,
  image_url text,
  notes text,
  channel channel DEFAULT 'allanos',
  pinned boolean DEFAULT false,
  created_at timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS cb_assets (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  name varchar(200) NOT NULL,
  type asset_type NOT NULL,
  url text,
  mime_type varchar(60),
  size_bytes integer,
  tags jsonb DEFAULT '[]'::jsonb,
  created_at timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS cb_calendar_events (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  title varchar(300) NOT NULL,
  type video_type DEFAULT 'video',
  video_id text,
  channel channel DEFAULT 'allanos',
  starts_at timestamp NOT NULL,
  ends_at timestamp,
  notes text,
  created_at timestamp DEFAULT now() NOT NULL
);

-- Índices úteis
CREATE INDEX IF NOT EXISTS idx_cb_videos_user_status ON cb_videos(user_id, status);
CREATE INDEX IF NOT EXISTS idx_cb_ideas_user_score ON cb_ideas(user_id, priority_score DESC);
CREATE INDEX IF NOT EXISTS idx_cb_games_user ON cb_games(user_id);

SELECT 'CONTENT BRAIN schema aplicado com sucesso!' AS status;
