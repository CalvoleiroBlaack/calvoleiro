"use client";

import { useState, useTransition } from "react";
import {
  VIDEO_STATUS_LABELS,
  VIDEO_STATUSES,
  PRIORITY_LABELS,
  DIFFICULTY_LABELS,
  GENRE_LABELS,
  CHANNEL_LABELS,
  TYPE_LABELS,
  type VideoStatus,
  type GameGenre,
} from "@/types";
import {
  createVideoAction,
  updateVideoStatusAction,
  deleteVideoAction,
} from "@/actions/crud";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Badge, Card, Modal, Field, EmptyState } from "@/components/ui/card";
import {
  Plus,
  GripVertical,
  Clock,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type Game = { id: string; name: string; genre: any };
type Video = {
  id: string;
  title: string;
  status: VideoStatus | null;
  type: string | null;
  priority: string | null;
  difficulty: string | null;
  channel: string | null;
  gameId: string | null;
  scheduledAt: Date | null;
  estimatedMinutes: number | null;
  mission: string | null;
  promise: string | null;
  conflict: string | null;
  satisfaction: string | null;
};

export function ProductionBoard({
  videos,
  games,
}: {
  videos: Video[];
  games: Game[];
}) {
  const [creating, setCreating] = useState(false);
  const [moving, setMoving] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const router = useRouter();

  const grouped: Record<VideoStatus, Video[]> = {
    idea: [],
    research: [],
    planning: [],
    script: [],
    recording: [],
    editing: [],
    thumbnail: [],
    scheduled: [],
    published: [],
  };
  videos.forEach((v) => {
    const s = (v.status ?? "idea") as VideoStatus;
    grouped[s]?.push(v);
  });

  const move = (id: string, status: VideoStatus) => {
    startTransition(async () => {
      await updateVideoStatusAction(id, status);
      setMoving(null);
      router.refresh();
    });
  };

  const del = (id: string) => {
    if (!confirm("Excluir este vídeo?")) return;
    startTransition(async () => {
      await deleteVideoAction(id);
      router.refresh();
    });
  };

  return (
    <div>
      <div className="flex justify-end mb-3">
        <Button
          variant="primary"
          size="sm"
          onClick={() => setCreating(true)}
        >
          <Plus className="h-4 w-4" /> Novo Vídeo
        </Button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
        {VIDEO_STATUSES.map((status) => {
          const items = grouped[status];
          return (
            <div
              key={status}
              className="flex-shrink-0 w-[280px] md:w-[260px] rounded-lg border border-border bg-bg flex flex-col"
            >
              <div className="border-b border-border px-3 py-2 flex items-center justify-between">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  {VIDEO_STATUS_LABELS[status]}
                </div>
                <Badge variant="muted">{items.length}</Badge>
              </div>
              <div className="p-2 space-y-2 min-h-[120px]">
                {items.length === 0 ? (
                  <div className="text-center text-[10px] text-dim py-8 font-mono uppercase tracking-widest">
                    vazio
                  </div>
                ) : (
                  items.map((v) => (
                    <VideoCard
                      key={v.id}
                      video={v}
                      games={games}
                      onMove={move}
                      onDelete={del}
                      moving={moving === v.id}
                      setMoving={(b) => setMoving(b ? v.id : null)}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {creating && (
        <CreateVideoModal games={games} onClose={() => setCreating(false)} />
      )}
    </div>
  );
}

function VideoCard({
  video,
  games,
  onMove,
  onDelete,
  moving,
  setMoving,
}: {
  video: Video;
  games: Game[];
  onMove: (id: string, s: VideoStatus) => void;
  onDelete: (id: string) => void;
  moving: boolean;
  setMoving: (b: boolean) => void;
}) {
  const game = games.find((g) => g.id === video.gameId);
  const priorityColor: Record<string, "default" | "danger" | "warn" | "muted"> = {
    critical: "danger",
    high: "danger",
    medium: "warn",
    low: "muted",
  };
  const current = (video.status ?? "idea") as VideoStatus;
  const next = VIDEO_STATUSES[VIDEO_STATUSES.indexOf(current) + 1];

  return (
    <div
      className={cn(
        "rounded border border-border bg-card p-2.5 text-xs space-y-1.5 hover:border-border-strong transition-colors",
        video.priority === "critical" && "cb-pulse-critical"
      )}
    >
      <div className="flex items-start gap-1.5">
        <GripVertical className="h-3 w-3 text-dim mt-0.5 flex-shrink-0" />
        <div className="font-medium text-[13px] leading-snug flex-1 min-w-0">
          {video.title}
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {video.priority && (
          <Badge variant={priorityColor[video.priority]}>
            {PRIORITY_LABELS[video.priority as keyof typeof PRIORITY_LABELS]}
          </Badge>
        )}
        {video.channel && (
          <Badge variant="default">
            {CHANNEL_LABELS[video.channel as keyof typeof CHANNEL_LABELS] ??
              video.channel}
          </Badge>
        )}
      </div>
      {game && (
        <div className="text-[10px] text-muted font-mono uppercase tracking-wider truncate">
          ▶ {game.name}
        </div>
      )}
      {(video.estimatedMinutes || video.scheduledAt) && (
        <div className="flex items-center gap-2 text-[10px] text-dim">
          {video.estimatedMinutes && (
            <span className="flex items-center gap-1">
              <Clock className="h-2.5 w-2.5" />
              {video.estimatedMinutes}min
            </span>
          )}
          {video.scheduledAt && (
            <span>
              {new Date(video.scheduledAt).toLocaleDateString("pt-BR")}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-1 pt-1 border-t border-border">
        {next && (
          <button
            onClick={() => onMove(video.id, next)}
            className="flex-1 h-6 rounded bg-card-2 hover:bg-blood-dark/30 text-[10px] font-mono uppercase tracking-wider flex items-center justify-center gap-1 transition-colors"
            title={`Mover para ${VIDEO_STATUS_LABELS[next]}`}
          >
            Avançar <ArrowRight className="h-2.5 w-2.5" />
          </button>
        )}
        <button
          onClick={() => onDelete(video.id)}
          className="h-6 w-6 rounded bg-card-2 hover:bg-blood-dark/30 text-dim hover:text-blood-bright flex items-center justify-center transition-colors"
          title="Excluir"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

function CreateVideoModal({
  games,
  onClose,
}: {
  games: Game[];
  onClose: () => void;
}) {
  const [state, action, pending] = useActionStateCompat(createVideoAction);

  return (
    <Modal
      open
      onClose={onClose}
      title="Novo Vídeo · Missão"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" form="create-video-form" type="submit">
            {pending ? "Criando..." : "Criar ▸"}
          </Button>
        </>
      }
      wide
    >
      {state?.error && (
        <div className="mb-4 rounded border border-blood-dark bg-blood-dark/20 px-3 py-2 text-xs font-mono text-blood-bright">
          ▸ {state.error}
        </div>
      )}
      <form
        id="create-video-form"
        action={(fd) => {
          action(fd);
        }}
        className="grid md:grid-cols-2 gap-4"
      >
        <Field label="Título">
          <Input name="title" required placeholder="Ex: Sobrevivi à Night 6..." />
        </Field>
        <Field label="Canal">
          <Select name="channel" defaultValue="allanos">
            {Object.entries(CHANNEL_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Tipo">
          <Select name="type" defaultValue="video">
            {Object.entries(TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Jogo">
          <Select name="gameId" defaultValue="">
            <option value="">— Nenhum —</option>
            {games.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Prioridade">
          <Select name="priority" defaultValue="medium">
            {Object.entries(PRIORITY_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Dificuldade">
          <Select name="difficulty" defaultValue="medium">
            {Object.entries(DIFFICULTY_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Tempo estimado (min)">
          <Input name="estimatedMinutes" type="number" min={0} placeholder="30" />
        </Field>
        <Field label="Data agendada">
          <Input name="scheduledAt" type="datetime-local" />
        </Field>

        <div className="md:col-span-2 border-t border-border pt-4 mt-2">
          <div className="font-mono text-[10px] text-blood-bright uppercase tracking-widest mb-3">
            ◈ Sistema de Missão
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Missão" hint="Objetivo central do vídeo">
              <Textarea name="mission" placeholder="Ex: Sobreviver à Night 6" />
            </Field>
            <Field label="Promessa" hint="O que o espectador vai ver">
              <Textarea
                name="promise"
                placeholder="Ex: Mostrar o remake mais assustador de FNAF 2"
              />
            </Field>
            <Field label="Conflito" hint="Obstáculos / antagonistas">
              <Textarea name="conflict" placeholder="Ex: Mangle e Foxy" />
            </Field>
            <Field label="Satisfação" hint="Payoff final">
              <Textarea name="satisfaction" placeholder="Ex: Conseguir zerar" />
            </Field>
          </div>
        </div>

        <Field label="Observações">
          <Textarea name="notes" placeholder="Notas extras..." />
        </Field>
      </form>
    </Modal>
  );
}

function useActionStateCompat(
  actionFn: (_s: any, fd: FormData) => Promise<any>
) {
  const [state, setState] = useState<any>(null);
  const [, start] = useTransition();
  const [pending, setPending] = useState(false);
  const action = (fd: FormData) => {
    setPending(true);
    start(async () => {
      const res = await actionFn(state, fd);
      setState(res);
      setPending(false);
      if (res?.success) {
        setTimeout(() => window.location.reload(), 200);
      }
    });
  };
  return [state, action, pending] as const;
}
