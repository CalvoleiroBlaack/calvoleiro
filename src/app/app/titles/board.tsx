"use client";

import { useState } from "react";
import { GRADE_LABELS, CHANNEL_LABELS } from "@/types";
import { createTitleAction, deleteTitleAction } from "@/actions/crud";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Badge, Card, Modal, Field, EmptyState } from "@/components/ui/card";
import { Plus, Type, Trash2 } from "lucide-react";
import { formatPercent } from "@/lib/utils";

export function TitlesBoard({ titles }: any) {
  const [open, setOpen] = useState(false);
  const del = (id: string) => {
    if (!confirm("Excluir título?")) return;
    deleteTitleAction(id).then(() => window.location.reload());
  };

  const gradeVariant: Record<string, "success" | "accent" | "warn" | "danger"> = {
    excellent: "success",
    good: "accent",
    weak: "warn",
    bad: "danger",
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> Novo título
        </Button>
      </div>

      {titles.length === 0 ? (
        <EmptyState
          icon={<Type className="h-5 w-5" />}
          title="Nenhum título cadastrado"
          description="Registre títulos antigos e seus CTRs para descobrir padrões."
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {titles.map((t: any) => (
            <Card key={t.id} className="p-4 flex items-center gap-3 hover:border-blood-dark transition-colors">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium leading-snug">
                  {t.title}
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant={gradeVariant[t.grade]}>
                    {GRADE_LABELS[t.grade as keyof typeof GRADE_LABELS]}
                  </Badge>
                  <Badge variant="muted">
                    {CHANNEL_LABELS[t.channel as keyof typeof CHANNEL_LABELS] ?? t.channel}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-lg font-bold text-acid">
                  {formatPercent(t.ctr)}
                </div>
                <div className="text-[9px] text-dim uppercase tracking-widest">
                  CTR
                </div>
              </div>
              <button
                onClick={() => del(t.id)}
                className="text-dim hover:text-blood-bright"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </Card>
          ))}
        </div>
      )}

      {open && <TitleModal onClose={() => setOpen(false)} />}
    </div>
  );
}

function TitleModal({ onClose }: { onClose: () => void }) {
  const [state, action, pending] = useActionStateCompat(createTitleAction);
  return (
    <Modal
      open
      onClose={onClose}
      title="Novo título"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" form="title-form" type="submit">
            {pending ? "..." : "Salvar ▸"}
          </Button>
        </>
      }
    >
      <form id="title-form" action={(fd) => action(fd)} className="space-y-4">
        <Field label="Título">
          <Input name="title" required placeholder="Ex: Sobrevivi à Night 6..." />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="CTR (%)"><Input name="ctr" type="number" step="0.1" required defaultValue={0} /></Field>
          <Field label="Canal">
            <Select name="channel" defaultValue="allanos">
              {Object.entries(CHANNEL_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </Select>
          </Field>
        </div>
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
