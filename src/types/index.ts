export type Channel = "allanos" | "lowsersave" | "both";

export type VideoStatus =
  | "idea"
  | "research"
  | "planning"
  | "script"
  | "recording"
  | "editing"
  | "thumbnail"
  | "scheduled"
  | "published";

export type Priority = "low" | "medium" | "high" | "critical";
export type Difficulty = "easy" | "medium" | "hard" | "extreme";
export type VideoType = "video" | "short" | "live" | "series";
export type TitleGrade = "excellent" | "good" | "weak" | "bad";
export type GameStatus = "active" | "paused" | "dropped" | "completed";

export type GameGenre =
  | "terror"
  | "fnaf"
  | "mascot_horror"
  | "analog_horror"
  | "indie"
  | "release"
  | "curiosities"
  | "weird"
  | "rpg"
  | "campaign"
  | "various";

export const VIDEO_STATUS_LABELS: Record<VideoStatus, string> = {
  idea: "💡 Ideia",
  research: "🔎 Pesquisa",
  planning: "📐 Planejamento",
  script: "📝 Roteiro",
  recording: "🎥 Gravação",
  editing: "🎬 Edição",
  thumbnail: "🖼️ Thumbnail",
  scheduled: "📅 Agendado",
  published: "🚀 Publicado",
};

export const VIDEO_STATUSES: VideoStatus[] = [
  "idea",
  "research",
  "planning",
  "script",
  "recording",
  "editing",
  "thumbnail",
  "scheduled",
  "published",
];

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
  critical: "Crítica",
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Fácil",
  medium: "Médio",
  hard: "Difícil",
  extreme: "Extremo",
};

export const GENRE_LABELS: Record<GameGenre, string> = {
  terror: "Terror",
  fnaf: "FNAF",
  mascot_horror: "Mascot Horror",
  analog_horror: "Analog Horror",
  indie: "Indie",
  release: "Lançamentos",
  curiosities: "Curiosidades",
  weird: "Jogos Estranhos",
  rpg: "RPG",
  campaign: "Campanhas",
  various: "Variados",
};

export const CHANNEL_LABELS: Record<Channel, string> = {
  allanos: "Allanos (Terror)",
  lowsersave: "LowserSave",
  both: "Ambos",
};

export const TYPE_LABELS: Record<VideoType, string> = {
  video: "Vídeo",
  short: "Short",
  live: "Live",
  series: "Série",
};

export const GRADE_LABELS: Record<TitleGrade, string> = {
  excellent: "Excelente",
  good: "Bom",
  weak: "Fraco",
  bad: "Ruim",
};

export function calcPriorityScore(input: {
  potentialViews?: number | null;
  potentialSubs?: number | null;
  potentialRetention?: number | null;
  hypeLevel?: number | null;
  difficulty?: Difficulty | null;
}): number {
  const diffPenalty: Record<Difficulty, number> = {
    easy: 0,
    medium: 8,
    hard: 18,
    extreme: 30,
  };
  const views = input.potentialViews ?? 50;
  const subs = input.potentialSubs ?? 50;
  const retention = input.potentialRetention ?? 50;
  const hype = input.hypeLevel ?? 50;
  const penalty = diffPenalty[input.difficulty ?? "medium"];
  const raw =
    views * 0.3 + subs * 0.35 + retention * 0.2 + hype * 0.15 - penalty;
  return Math.max(0, Math.min(100, Math.round(raw)));
}
