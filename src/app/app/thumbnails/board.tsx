"use client";

import { useState } from "react";
import {
  createThumbnailTestAction,
  deleteThumbnailTestAction,
} from "@/actions/crud";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge, Card, Modal, Field, EmptyState } from "@/components/ui/card";
import { Plus, Image as ImageIcon, Trash2, Trophy } from "lucide-react";
import { formatNumber, formatPercent } from "@/lib/utils";

export function ThumbnailsBoard({ tests }: any) {
  const [open, setOpen] = useState(false);
  const del = (id: string) => {
    if (!confirm("Excluir teste?")) return;
    deleteThumbnailTestAction(id).then(() => window.location.reload());
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> Novo teste A/B
        </Button>
      </div>

      {tests.length === 0 ? (
        <EmptyState
          icon={<ImageIcon className="h-5 w-5" />}
          title="Nenhum teste A/B ainda"
          description="O YouTube Studio permite testar thumbnails. Registre aqui os resultados."
        />
      ) : (
        <div className="space-y-3">
          {tests.map((t: any) => {
            const winner = (t.ctrA || 0) >= (t.ctrB || 0) ? "A" : "B";
            return (
              <Card key={t.id} className="p-4">
                <div className="flex items-start gap-4 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <div className="font-mono text-[10px] text-blood-bright uppercase tracking-widest mb-1">
                      TEST · {t.winner ? `WINNER: ${t.winner}` : "IN PROGRESS"}
                    </div>
                    <h3 className="font-semibold">{t.title}</h3>
                    {t.notes && (
                      <p className="text-xs text-muted mt-1">{t.notes}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <ThumbCol
                      label="A"
                      ctr={t.ctrA}
                      imp={t.impressionsA}
                      win={winner === "A"}
                    />
                    <ThumbCol
                      label="B"
                      ctr={t.ctrB}
                      imp={t.impressionsB}
                      win={winner === "B"}
                    />
                  </div>

                  <button
                    onClick={() => del(t.id)}
                    className="text-dim hover:text-blood-bright"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {open && <ThumbModal onClose={() => setOpen(false)} />}
    </div>
  );
}

function ThumbCol({
  label,
  ctr,
  imp,
  win,
}: {
  label: string;
  ctr: number;
  imp: number;
  win: boolean;
}) {
  return (
    <div
      className={
        "rounded border p-3 min-w-[140px] " +
        (win ? "border-acid/50 bg-acid/5" : "border-border bg-card-2")
      }
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-xs uppercase tracking-widest">
          Thumb {label}
        </span>
        {win && <Trophy className="h-3.5 w-3.5 text-acid" />}
      </div>
      <div className="h-20 rounded bg-gradient-to-br from-blood-dark/30 via-card to-card-2 border border-border flex items-center justify-center text-dim text-xs font-mono">
        PREVIEW
      </div>
      <div className="grid grid-cols-2 gap-1 mt-2 text-center">
        <div>
          <div className="font-mono text-sm font-bold">
            {formatPercent(ctr)}
          </div>
          <div className="text-[9px] text-dim uppercase">CTR</div>
        </div>
        <div>
          <div className="font-mono text-sm font-bold">
            {formatNumber(imp)}
          </div>
          <div className="text-[9px] text-dim uppercase">Impr.</div>
        </div>
      </div>
    </div>
  );
}

function ThumbModal({ onClose }: { onClose: () => void }) {
  const [state, action, pending] = useActionStateCompat(
    createThumbnailTestAction
  );
  return (
    <Modal
      open
      onClose={onClose}
      title="Novo teste A/B"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" form="thumb-form" type="submit">
            {pending ? "..." : "Salvar ▸"}
          </Button>
        </>
      }
    >
      <form id="thumb-form" action={(fd) => action(fd)} className="space-y-4">
        <Field label="Título / Vídeo">
          <Input name="title" required />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="CTR A (%)"><Input name="ctrA" type="number" step="0.1" defaultValue={0} /></Field>
          <Field label="CTR B (%)"><Input name="ctrB" type="number" step="0.1" defaultValue={0} /></Field>
          <Field label="Impressões A"><Input name="impressionsA" type="number" defaultValue={0} /></Field>
          <Field label="Impressões B"><Input name="impressionsB" type="number" defaultValue={0} /></Field>
        </div>
        <Field label="Observações">
          <Textarea name="notes" placeholder="Diferenças visuais, padrão descoberto..." />
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
