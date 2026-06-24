"use client";

import { useState } from "react";
import { CHANNEL_LABELS } from "@/types";
import {
  addToGraveyardAction,
  removeFromGraveyardAction,
} from "@/actions/crud";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Badge, Card, Modal, Field, EmptyState } from "@/components/ui/card";
import { Plus, Skull, Trash2 } from "lucide-react";
import { formatNumber, formatPercent } from "@/lib/utils";

export function GraveyardBoard({ entries, games }: any) {
  const [open, setOpen] = useState(false);

  const del = (id: string) => {
    if (!confirm("Remover do cemitério?")) return;
    removeFromGraveyardAction(id).then(() => window.location.reload());
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="danger" size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> Enterrar vídeo
        </Button>
      </div>

      {entries.length === 0 ? (
        <EmptyState
          icon={<Skull className="h-5 w-5" />}
          title="Nenhum fracasso documentado"
          description="Aqui é onde você aprende. Documente vídeos que não performaram."
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {entries.map((e: any) => (
            <Card
              key={e.id}
              className="border-blood-dark/50 bg-gradient-to-b from-card to-blood-dark/10 relative overflow-hidden"
            >
              <div className="absolute top-2 right-2 text-3xl opacity-10">
                ☠
              </div>
              <div className="p-4 space-y-2 relative">
                <h3 className="font-semibold text-fg">{e.title}</h3>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border text-center">
                  <Stat label="Views" value={formatNumber(e.views)} />
                  <Stat label="CTR" value={formatPercent(e.ctr)} />
                  <Stat label="Ret." value={formatPercent(e.retention)} />
                </div>
                {e.failureReason && (
                  <div className="rounded border border-blood-dark/50 bg-blood-dark/10 p-2">
                    <div className="font-mono text-[9px] text-blood-bright uppercase tracking-widest mb-1">
                      ▸ Motivo do fracasso
                    </div>
                    <p className="text-xs text-muted">{e.failureReason}</p>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2">
                  <Badge variant="muted">
                    {CHANNEL_LABELS[e.channel as keyof typeof CHANNEL_LABELS] ?? e.channel}
                  </Badge>
                  <button
                    onClick={() => del(e.id)}
                    className="text-dim hover:text-blood-bright"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {open && (
        <GraveModal games={games} onClose={() => setOpen(false)} />
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-sm font-bold">{value}</div>
      <div className="text-[9px] text-dim uppercase tracking-widest">{label}</div>
    </div>
  );
}

function GraveModal({ games, onClose }: any) {
  const [state, action, pending] = useActionStateCompat(addToGraveyardAction);
  return (
    <Modal
      open
      onClose={onClose}
      title="Enterrar vídeo"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button variant="danger" form="grave-form" type="submit">
            {pending ? "..." : "Enterrar ▸"}
          </Button>
        </>
      }
    >
      <form id="grave-form" action={(fd) => action(fd)} className="space-y-4">
        <Field label="Título do vídeo">
          <Input name="title" required />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Jogo">
            <Select name="gameId" defaultValue="">
              <option value="">—</option>
              {games.map((g: any) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Canal">
            <Select name="channel" defaultValue="allanos">
              {Object.entries(CHANNEL_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </Select>
          </Field>
          <Field label="Views"><Input name="views" type="number" defaultValue={0} /></Field>
          <Field label="CTR (%)"><Input name="ctr" type="number" step="0.1" defaultValue={0} /></Field>
          <Field label="Retenção (%)"><Input name="retention" type="number" step="0.1" defaultValue={0} /></Field>
        </div>
        <Field label="Motivo do fracasso" hint="Seja honesto. Isso é aprendizado.">
          <Textarea name="failureReason" placeholder="Ex: Thumbnail ruim, gancho fraco, jogo saturado..." />
        </Field>
      </form>
    </Modal>
  );
}

function useActionStateCompat(actionFn: any) {
  const [state, setState] = useState<any>(null);
  const [pending, setPending] = useState(false);
  const action = (fd: FormData) => {
    setPending(true);
    Promise.resolve(actionFn(state, fd)).then((res: any) => {
      setState(res);
      setPending(false);
      if (res?.success) setTimeout(() => window.location.reload(), 200);
    });
  };
  return [state, action, pending] as const;
}
