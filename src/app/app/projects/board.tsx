"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Badge, Card, Modal, Field, EmptyState } from "@/components/ui/card";
import {
  Plus,
  FolderKanban,
  Trash2,
  Pin,
  PinOff,
  Archive,
} from "lucide-react";
import {
  createProjectAction,
  deleteProjectAction,
  updateProjectAction,
} from "@/actions/calvoleiro";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

const COLORS = [
  "#3b82f6",
  "#38bdf8",
  "#818cf8",
  "#06b6d4",
  "#2b4dff",
  "#10b981",
  "#f59e0b",
  "#e879f9",
];

export function ProjectsBoard({ projects }: any) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const del = async (id: string) => {
    if (!confirm("Excluir projeto?")) return;
    await deleteProjectAction(id);
    router.refresh();
  };

  const togglePin = async (id: string, pinned: boolean) => {
    await updateProjectAction(id, { pinned: !pinned });
    router.refresh();
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-3.5 w-3.5" /> Novo projeto
        </Button>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon={<FolderKanban className="h-5 w-5" />}
          title="Nenhum projeto ainda"
          description="Crie seu primeiro projeto e comece a organizar seu trabalho."
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {projects.map((p: any) => (
            <Card key={p.id} className="cl-lift">
              <div
                className="h-16 relative"
                style={{
                  background: `linear-gradient(135deg, ${p.color}30, ${p.color}10)`,
                }}
              >
                <div
                  className="absolute -bottom-5 left-4 h-10 w-10 rounded-lg flex items-center justify-center text-white text-sm font-semibold border-2 border-bg"
                  style={{
                    background: `linear-gradient(135deg, ${p.color}, ${p.color}cc)`,
                  }}
                >
                  {p.name.slice(0, 2).toUpperCase()}
                </div>
                <button
                  onClick={() => togglePin(p.id, p.pinned)}
                  className="absolute top-2 right-2 h-7 w-7 rounded-md cl-glass flex items-center justify-center text-muted hover:text-neon"
                >
                  {p.pinned ? (
                    <PinOff className="h-3 w-3" />
                  ) : (
                    <Pin className="h-3 w-3" />
                  )}
                </button>
              </div>
              <div className="p-4 pt-7 space-y-2">
                <div>
                  <h3 className="font-semibold text-fg">{p.name}</h3>
                  {p.description && (
                    <p className="text-xs text-muted line-clamp-2 mt-1">
                      {p.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <Badge
                    variant={
                      p.status === "active"
                        ? "success"
                        : p.status === "completed"
                        ? "royal"
                        : "muted"
                    }
                  >
                    {p.status}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-dim font-mono">
                      {formatDate(p.updatedAt)}
                    </span>
                    <button
                      onClick={() => del(p.id)}
                      className="h-6 w-6 rounded hover:bg-rose-500/10 text-dim hover:text-rose-300 flex items-center justify-center"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {open && <CreateProjectModal onClose={() => setOpen(false)} />}
    </div>
  );
}

function CreateProjectModal({ onClose }: { onClose: () => void }) {
  const [state, action, pending] = useActionStateCompat(createProjectAction);
  const [color, setColor] = useState("#3b82f6");

  return (
    <Modal
      open
      onClose={onClose}
      title="Novo projeto"
      subtitle="Defina seu próximo universo."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" form="proj-form" type="submit">
            {pending ? "Criando…" : "Criar projeto"}
          </Button>
        </>
      }
    >
      {state?.error && (
        <div className="mb-4 rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
          {state.error}
        </div>
      )}
      <form id="proj-form" action={(fd) => action(fd)} className="space-y-4">
        <Field label="Nome do projeto">
          <Input name="name" required placeholder="Canal Allanos, Empresa, Curso…" />
        </Field>
        <Field label="Descrição">
          <Textarea name="description" placeholder="Sobre o que é este projeto?" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Status">
            <Select name="status" defaultValue="active">
              <option value="active">Ativo</option>
              <option value="planning">Planejamento</option>
              <option value="on_hold">Em espera</option>
              <option value="completed">Concluído</option>
              <option value="archived">Arquivado</option>
            </Select>
          </Field>
          <Field label="Ícone">
            <Select name="icon" defaultValue="folder">
              <option value="folder">📁 Pasta</option>
              <option value="rocket">🚀 Rocket</option>
              <option value="brain">🧠 Cérebro</option>
              <option value="star">⭐ Star</option>
              <option value="zap">⚡ Bolt</option>
            </Select>
          </Field>
        </div>
        <Field label="Cor do projeto">
          <div className="flex gap-2">
            {COLORS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setColor(c)}
                className="h-8 w-8 rounded-md border-2 transition-all"
                style={{
                  background: c,
                  borderColor: color === c ? "#eef2ff" : "transparent",
                }}
              />
            ))}
            <input type="hidden" name="color" value={color} />
          </div>
        </Field>
        <label className="flex items-center gap-2 text-sm text-fg-2">
          <input type="checkbox" name="pinned" className="accent-neon" />
          Fixar no topo
        </label>
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
