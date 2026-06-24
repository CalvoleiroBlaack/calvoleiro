"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Badge, Card, Modal, Field, EmptyState } from "@/components/ui/card";
import { Plus, Bell, Trash2, Check } from "lucide-react";
import {
  createReminderAction,
  deleteReminderAction,
  toggleReminderAction,
} from "@/actions/calvoleiro";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";

export function RemindersBoard({ reminders, projects }: any) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const pending = reminders.filter((r: any) => r.status === "pending");
  const done = reminders.filter((r: any) => r.status === "done");

  const del = async (id: string) => {
    if (!confirm("Excluir?")) return;
    await deleteReminderAction(id);
    router.refresh();
  };
  const toggle = async (id: string, currentDone: boolean) => {
    await toggleReminderAction(id, !currentDone);
    router.refresh();
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-3.5 w-3.5" /> Novo lembrete
        </Button>
      </div>

      {reminders.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-5 w-5" />}
          title="Nada para lembrar"
          description="Tudo sob controle. Crie um lembrete quando precisar."
        />
      ) : (
        <div className="space-y-6">
          {pending.length > 0 && (
            <Section title="Pendentes" count={pending.length}>
              {pending.map((r: any) => (
                <ReminderRow
                  key={r.id}
                  r={r}
                  onToggle={() => toggle(r.id, false)}
                  onDelete={() => del(r.id)}
                />
              ))}
            </Section>
          )}
          {done.length > 0 && (
            <Section title="Concluídos" count={done.length}>
              {done.map((r: any) => (
                <ReminderRow
                  key={r.id}
                  r={r}
                  done
                  onToggle={() => toggle(r.id, true)}
                  onDelete={() => del(r.id)}
                />
              ))}
            </Section>
          )}
        </div>
      )}

      {open && <CreateModal projects={projects} onClose={() => setOpen(false)} />}
    </div>
  );
}

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2 px-1">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-fg-2">
          {title}
        </h3>
        <Badge variant="muted">{count}</Badge>
      </div>
      <Card>
        <div className="divide-y divide-border/60">{children}</div>
      </Card>
    </div>
  );
}

function ReminderRow({
  r,
  done,
  onToggle,
  onDelete,
}: {
  r: any;
  done?: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="px-4 py-3 flex items-center gap-3 hover:bg-surface/40 transition-colors group">
      <button
        onClick={onToggle}
        className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all ${
          done
            ? "bg-neon border-neon"
            : "border-border-2 hover:border-neon"
        }`}
      >
        {done && <Check className="h-3 w-3 text-bg" strokeWidth={3} />}
      </button>
      <div className="flex-1 min-w-0">
        <div
          className={`text-sm ${
            done ? "line-through text-dim" : "text-fg"
          }`}
        >
          {r.title}
        </div>
        {r.notes && (
          <div className="text-[11px] text-muted truncate">{r.notes}</div>
        )}
      </div>
      <div className="flex items-center gap-2">
        {r.dueAt && (
          <span className="text-[10px] text-muted font-mono">
            {formatDate(r.dueAt)}
          </span>
        )}
        <Badge
          variant={
            r.priority === "critical" || r.priority === "high"
              ? "danger"
              : r.priority === "medium"
              ? "warn"
              : "muted"
          }
        >
          {r.priority}
        </Badge>
        <button
          onClick={onDelete}
          className="h-6 w-6 rounded hover:bg-rose-500/10 text-dim hover:text-rose-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

function CreateModal({ projects, onClose }: any) {
  const [state, action, pending] = useActionStateCompat(createReminderAction);
  return (
    <Modal
      open
      onClose={onClose}
      title="Novo lembrete"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" form="rm-form" type="submit">
            {pending ? "…" : "Criar"}
          </Button>
        </>
      }
    >
      <form id="rm-form" action={(fd) => action(fd)} className="space-y-4">
        <Field label="Título">
          <Input name="title" required placeholder="O que você quer lembrar?" />
        </Field>
        <Field label="Notas">
          <Textarea name="notes" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Data/Hora">
            <Input name="dueAt" type="datetime-local" />
          </Field>
          <Field label="Prioridade">
            <Select name="priority" defaultValue="medium">
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
              <option value="critical">Crítica</option>
            </Select>
          </Field>
        </div>
        <Field label="Projeto">
          <Select name="projectId" defaultValue="">
            <option value="">—</option>
            {projects.map((p: any) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
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
