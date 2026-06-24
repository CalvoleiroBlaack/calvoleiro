"use client";

import { useState, useMemo } from "react";
import { CHANNEL_LABELS, TYPE_LABELS } from "@/types";
import {
  createCalendarEventAction,
  deleteCalendarEventAction,
} from "@/actions/crud";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Badge, Card, Modal, Field, EmptyState } from "@/components/ui/card";
import { Plus, Calendar as CalIcon, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function CalendarBoard({ events }: any) {
  const router = useRouter();
  const [cursor, setCursor] = useState(new Date());
  const [open, setOpen] = useState(false);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startWeekday = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const prev = () => setCursor(new Date(year, month - 1, 1));
  const next = () => setCursor(new Date(year, month + 1, 1));

  const monthName = cursor.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  const cells: (number | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const eventsByDay = useMemo(() => {
    const m: Record<number, any[]> = {};
    events.forEach((e: any) => {
      const d = new Date(e.startsAt);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        (m[day] = m[day] || []).push(e);
      }
    });
    return m;
  }, [events, year, month]);

  const del = (id: string) => {
    if (!confirm("Excluir evento?")) return;
    deleteCalendarEventAction(id).then(() => router.refresh());
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={prev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-semibold uppercase tracking-wider min-w-[180px] text-center">
            {monthName}
          </div>
          <Button variant="ghost" size="sm" onClick={next}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> Novo Evento
        </Button>
      </div>

      <Card>
        <div className="grid grid-cols-7 border-b border-border font-mono text-[10px] uppercase tracking-widest text-muted">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
            <div key={d} className="px-2 py-2 text-center border-r border-border last:border-r-0">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((day, idx) => {
            const dayEvents = day ? eventsByDay[day] || [] : [];
            const today =
              day &&
              new Date().toDateString() === new Date(year, month, day).toDateString();
            return (
              <div
                key={idx}
                className={
                  "min-h-[110px] border-r border-b border-border p-1.5 last:border-r-0 " +
                  (!day ? "bg-bg/30" : "bg-card")
                }
              >
                {day && (
                  <>
                    <div
                      className={
                        "text-[11px] font-mono mb-1 flex justify-between " +
                        (today ? "text-blood-bright" : "text-muted")
                      }
                    >
                      <span>{day}</span>
                      {dayEvents.length > 0 && (
                        <span className="text-[9px] uppercase tracking-widest">
                          {dayEvents.length}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.map((e: any) => (
                        <div
                          key={e.id}
                          className="rounded bg-blood-dark/30 border border-blood-dark/50 px-1.5 py-1 text-[10px] group relative"
                        >
                          <div className="font-medium truncate">
                            {e.title}
                          </div>
                          <div className="text-[9px] text-muted flex gap-1 items-center">
                            <Badge variant="muted">
                              {TYPE_LABELS[e.type as keyof typeof TYPE_LABELS] ?? e.type}
                            </Badge>
                          </div>
                          <button
                            onClick={() => del(e.id)}
                            className="absolute top-0.5 right-0.5 h-4 w-4 opacity-0 group-hover:opacity-100 bg-blood-dark text-blood-bright rounded flex items-center justify-center"
                          >
                            <Trash2 className="h-2 w-2" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {open && <CreateEventModal onClose={() => setOpen(false)} />}
    </div>
  );
}

function CreateEventModal({ onClose }: { onClose: () => void }) {
  const [state, action, pending] = useActionStateCompat(createCalendarEventAction);
  return (
    <Modal
      open
      onClose={onClose}
      title="Novo Evento"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" form="event-form" type="submit">
            {pending ? "..." : "Criar ▸"}
          </Button>
        </>
      }
    >
      <form id="event-form" action={(fd) => action(fd)} className="space-y-4">
        <Field label="Título">
          <Input name="title" required />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tipo">
            <Select name="type" defaultValue="video">
              {Object.entries(TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
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
        </div>
        <Field label="Data/Hora">
          <Input name="startsAt" type="datetime-local" required />
        </Field>
        <Field label="Observações">
          <Textarea name="notes" />
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
