"use client";

import { useState, useTransition } from "react";
import {
  GENRE_LABELS,
  CHANNEL_LABELS,
  type GameGenre,
  type Channel,
} from "@/types";
import { createGameAction, deleteGameAction } from "@/actions/crud";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Badge, Card, Modal, Field, EmptyState } from "@/components/ui/card";
import { Plus, Gamepad2, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function GamesBoard({ games }: any) {
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();

  const del = (id: string) => {
    if (!confirm("Excluir jogo?")) return;
    startTransition(async () => {
      await deleteGameAction(id);
      router.refresh();
    });
  };

  const genreIcon: Record<string, string> = {
    terror: "👻",
    fnaf: "🐻",
    mascot_horror: "🎭",
    analog_horror: "📺",
    indie: "🎮",
    release: "🆕",
    curiosities: "🔍",
    weird: "🤯",
    rpg: "⚔️",
    campaign: "🗺️",
    various: "🎲",
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> Novo Jogo
        </Button>
      </div>

      {games.length === 0 ? (
        <EmptyState
          icon={<Gamepad2 className="h-5 w-5" />}
          title="Nenhum jogo cadastrado"
          description="Cadastre os jogos que você pretende cobrir."
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {games.map((g: any) => (
            <Card
              key={g.id}
              className="hover:border-blood-dark transition-colors relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 h-24 w-24 bg-blood-bright/5 blur-3xl" />
              <div className="p-4 space-y-2 relative">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl">
                      {genreIcon[g.genre as GameGenre] ?? "🎮"}
                    </div>
                    <div>
                      <h3 className="font-semibold">{g.name}</h3>
                      <div className="text-xs text-muted">
                        {GENRE_LABELS[g.genre as GameGenre]} · {g.platform ?? "—"}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => del(g.id)}
                    className="h-7 w-7 rounded hover:bg-blood-dark/30 text-dim hover:text-blood-bright flex items-center justify-center"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  <Badge
                    variant={
                      g.status === "active"
                        ? "success"
                        : g.status === "completed"
                        ? "default"
                        : "muted"
                    }
                  >
                    {g.status}
                  </Badge>
                  <Badge variant="default">
                    {CHANNEL_LABELS[(g.channel ?? "allanos") as Channel]}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                  <div>
                    <div className="font-mono text-xs text-muted uppercase tracking-widest">
                      Vídeos
                    </div>
                    <div className="text-lg font-bold">{g.videoCount}</div>
                  </div>
                  <div>
                    <div className="font-mono text-xs text-muted uppercase tracking-widest">
                      Crescimento
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="flex-1 h-1.5 rounded bg-card-2 overflow-hidden">
                        <div
                          className="h-full bg-blood-bright"
                          style={{ width: `${g.growthPotential}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs w-8 text-right">
                        {g.growthPotential}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-dim font-mono">
                  Último vídeo: {formatDate(g.lastVideoAt)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {open && <CreateGameModal onClose={() => setOpen(false)} />}
    </div>
  );
}

function CreateGameModal({ onClose }: { onClose: () => void }) {
  const [state, action, pending] = useActionStateCompat(createGameAction);
  return (
    <Modal
      open
      onClose={onClose}
      title="Novo Jogo"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" form="game-form" type="submit">
            {pending ? "..." : "Criar ▸"}
          </Button>
        </>
      }
    >
      {state?.error && (
        <div className="mb-4 rounded border border-blood-dark bg-blood-dark/20 px-3 py-2 text-xs font-mono text-blood-bright">
          ▸ {state.error}
        </div>
      )}
      <form id="game-form" action={(fd) => action(fd)} className="space-y-4">
        <Field label="Nome do jogo">
          <Input name="name" required />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Gênero">
            <Select name="genre" defaultValue="terror">
              {Object.entries(GENRE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Plataforma">
            <Input name="platform" placeholder="PC, PS5, etc." />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Canal">
            <Select name="channel" defaultValue="allanos">
              {Object.entries(CHANNEL_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Status">
            <Select name="status" defaultValue="active">
              <option value="active">Ativo</option>
              <option value="paused">Pausado</option>
              <option value="dropped">Abandonado</option>
              <option value="completed">Completo</option>
            </Select>
          </Field>
        </div>
        <Field
          label="Potencial de crescimento (0-100)"
          hint="Quanto você acredita no jogo"
        >
          <Input
            name="growthPotential"
            type="number"
            min={0}
            max={100}
            defaultValue={50}
          />
        </Field>
        <Field label="Observações">
          <Textarea name="notes" />
        </Field>
      </form>
    </Modal>
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
      if (res?.success) setTimeout(() => window.location.reload(), 200);
    });
  };
  return [state, action, pending] as const;
}
