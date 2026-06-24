"use client";

import { useState, useTransition } from "react";
import {
  CHANNEL_LABELS,
  DIFFICULTY_LABELS,
  TYPE_LABELS,
  GENRE_LABELS,
  type Channel,
  type VideoType,
  type Difficulty,
} from "@/types";
import {
  createIdeaAction,
  deleteIdeaAction,
  archiveIdeaAction,
} from "@/actions/crud";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Badge, Card, Modal, Field, EmptyState } from "@/components/ui/card";
import { Plus, Lightbulb, Trash2, Archive, Filter } from "lucide-react";
import { useRouter } from "next/navigation";

export function IdeasBoard({ ideas, games }: any) {
  const [open, setOpen] = useState(false);
  const [channel, setChannel] = useState("");
  const [, startTransition] = useTransition();
  const router = useRouter();

  const filtered = ideas.filter(
    (i: any) => !channel || i.channel === channel
  );

  const del = (id: string) => {
    if (!confirm("Excluir ideia?")) return;
    startTransition(async () => {
      await deleteIdeaAction(id);
      router.refresh();
    });
  };

  const arch = (id: string) => {
    startTransition(async () => {
      await archiveIdeaAction(id, true);
      router.refresh();
    });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex items-center gap-2 text-xs text-muted font-mono uppercase tracking-widest">
          <Filter className="h-3 w-3" /> Filtros
        </div>
        <Select
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
          className="max-w-[200px]"
        >
          <option value="">Todos os canais</option>
          {Object.entries(CHANNEL_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </Select>
        <div className="ml-auto">
          <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Nova Ideia
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Lightbulb className="h-5 w-5" />}
          title="Nenhuma ideia ainda"
          description="Comece cadastrando sua próxima grande ideia de vídeo."
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((i: any) => {
            const game = games.find((g: any) => g.id === i.gameId);
            return (
              <Card key={i.id} className="hover:border-blood-dark transition-colors">
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold leading-snug flex-1 min-w-0">
                      {i.title}
                    </h3>
                    <div className="text-right">
                      <div className="font-mono text-base font-bold text-acid">
                        {i.priorityScore}
                      </div>
                      <div className="text-[9px] text-dim uppercase tracking-widest">
                        score
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="default">{TYPE_LABELS[(i.type ?? "video") as VideoType]}</Badge>
                    <Badge variant="muted">
                      {CHANNEL_LABELS[(i.channel ?? "allanos") as Channel]}
                    </Badge>
                    <Badge
                      variant={
                        i.difficulty === "easy"
                          ? "success"
                          : i.difficulty === "hard" || i.difficulty === "extreme"
                          ? "danger"
                          : "warn"
                      }
                    >
                      {DIFFICULTY_LABELS[(i.difficulty ?? "medium") as Difficulty]}
                    </Badge>
                  </div>
                  {game && (
                    <div className="text-[11px] text-muted font-mono truncate">
                      ▶ {game.name}
                    </div>
                  )}
                  {i.hook && (
                    <p className="text-xs text-muted line-clamp-2">
                      <span className="text-blood-bright font-mono">▸</span>{" "}
                      {i.hook}
                    </p>
                  )}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border text-center">
                    <MiniStat label="Views" value={i.potentialViews} />
                    <MiniStat label="Inscr." value={i.potentialSubs} />
                    <MiniStat label="Reten." value={i.potentialRetention} />
                  </div>
                  <div className="flex items-center gap-1 pt-2">
                    <div className="flex-1">
                      <Meter value={i.hypeLevel} label="Hype" />
                    </div>
                    <button
                      onClick={() => arch(i.id)}
                      className="h-7 w-7 rounded bg-card-2 hover:bg-card text-dim hover:text-fg flex items-center justify-center"
                      title="Arquivar"
                    >
                      <Archive className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => del(i.id)}
                      className="h-7 w-7 rounded bg-card-2 hover:bg-blood-dark/30 text-dim hover:text-blood-bright flex items-center justify-center"
                      title="Excluir"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {open && <CreateIdeaModal games={games} onClose={() => setOpen(false)} />}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number | null }) {
  return (
    <div>
      <div className="font-mono text-sm font-bold">{value ?? "—"}</div>
      <div className="text-[9px] text-dim uppercase tracking-widest">
        {label}
      </div>
    </div>
  );
}

function Meter({ value, label }: { value: number | null; label: string }) {
  const v = value ?? 0;
  return (
    <div className="flex items-center gap-2">
      <div className="font-mono text-[9px] uppercase tracking-widest text-muted w-10">
        {label}
      </div>
      <div className="flex-1 h-1.5 rounded bg-card-2 overflow-hidden">
        <div
          className="h-full bg-blood-bright"
          style={{ width: `${v}%` }}
        />
      </div>
      <div className="font-mono text-[10px] w-8 text-right">{v}</div>
    </div>
  );
}

function CreateIdeaModal({ games, onClose }: any) {
  const [state, action, pending] = useActionStateCompat(createIdeaAction);
  return (
    <Modal
      open
      onClose={onClose}
      title="Nova Ideia"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" form="idea-form" type="submit">
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
        id="idea-form"
        action={(fd) => action(fd)}
        className="grid md:grid-cols-2 gap-4"
      >
        <Field label="Título da ideia">
          <Input name="title" required />
        </Field>
        <Field label="Jogo">
          <Select name="gameId" defaultValue="">
            <option value="">—</option>
            {games.map((g: any) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </Select>
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
        <Field label="Dificuldade">
          <Select name="difficulty" defaultValue="medium">
            {Object.entries(DIFFICULTY_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
        </Field>
        <div className="md:col-span-2">
          <Field label="Gancho" hint="Frase que prende atenção nos primeiros segundos">
            <Textarea name="hook" placeholder="Ex: Este FNAF me fez gritar de verdade..." />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Thumbnail imaginada">
            <Textarea
              name="thumbnailConcept"
              placeholder="Descreva visualmente sua thumbnail..."
            />
          </Field>
        </div>
        <div className="md:col-span-2 border-t border-border pt-4">
          <div className="font-mono text-[10px] text-blood-bright uppercase tracking-widest mb-3">
            ◈ Potenciais (0-100)
          </div>
          <div className="grid md:grid-cols-4 gap-3">
            <RangeField name="potentialViews" label="Views" />
            <RangeField name="potentialSubs" label="Inscritos" />
            <RangeField name="potentialRetention" label="Retenção" />
            <RangeField name="hypeLevel" label="Hype" />
          </div>
        </div>
      </form>
    </Modal>
  );
}

function RangeField({ name, label }: { name: string; label: string }) {
  const [v, setV] = useState(50);
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
          {label}
        </span>
        <span className="font-mono text-xs text-acid">{v}</span>
      </div>
      <input
        type="range"
        name={name}
        min={0}
        max={100}
        value={v}
        onChange={(e) => setV(Number(e.target.value))}
        className="w-full accent-blood-bright"
      />
    </div>
  );
}

function useActionStateCompat(
  actionFn: (_s: any, fd: FormData) => Promise<any>
) {
  const [state, setState] = useState<any>(null);
  const [pending, setPending] = useState(false);
  const action = (fd: FormData) => {
    setPending(true);
    Promise.resolve(actionFn(state, fd)).then((res) => {
      setState(res);
      setPending(false);
      if (res?.success) {
        setTimeout(() => window.location.reload(), 200);
      }
    });
  };
  return [state, action, pending] as const;
}
