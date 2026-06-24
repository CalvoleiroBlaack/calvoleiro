"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Badge, Card, Modal, Field, EmptyState } from "@/components/ui/card";
import { Plus, Sparkles, Trash2, ExternalLink, FileText, AtSign, Film, Image as ImageIcon, MessageSquare } from "lucide-react";
import {
  createResearchItemAction,
  deleteResearchItemAction,
} from "@/actions/calvoleiro";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";

const KIND_META: Record<string, { icon: any; label: string; color: string }> = {
  article: { icon: FileText, label: "Artigo", color: "text-neon" },
  video: { icon: Film, label: "Vídeo", color: "text-rose-300" },
  tweet: { icon: AtSign, label: "Tweet", color: "text-electric" },
  reddit: { icon: MessageSquare, label: "Reddit", color: "text-amber-300" },
  image: { icon: ImageIcon, label: "Imagem", color: "text-glow" },
  pdf: { icon: FileText, label: "PDF", color: "text-fg-2" },
  note: { icon: FileText, label: "Nota", color: "text-muted" },
};

export function ResearchBoard({ items, projects }: any) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const del = async (id: string) => {
    if (!confirm("Excluir?")) return;
    await deleteResearchItemAction(id);
    router.refresh();
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-3.5 w-3.5" /> Nova pesquisa
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<Sparkles className="h-5 w-5" />}
          title="Sem pesquisas"
          description="Comece a salvar artigos, vídeos, tweets e tudo que merece atenção."
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((i: any) => {
            const meta = KIND_META[i.kind] ?? KIND_META.article;
            const Icon = meta.icon;
            return (
              <Card key={i.id} className="cl-lift group">
                <div className="p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <div className={`h-8 w-8 rounded-md bg-surface-2 border border-border-2 flex items-center justify-center ${meta.color} flex-shrink-0`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-fg line-clamp-2">
                        {i.title}
                      </h3>
                      {i.source && (
                        <div className="text-[11px] text-muted truncate">
                          {i.source}
                        </div>
                      )}
                    </div>
                  </div>
                  {i.excerpt && (
                    <p className="text-[11px] text-muted line-clamp-3">
                      {i.excerpt}
                    </p>
                  )}
                  {i.url && (
                    <a
                      href={i.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-neon hover:text-neon-2 flex items-center gap-1 truncate"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {i.url}
                    </a>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-border/60">
                    <Badge variant="muted">{meta.label}</Badge>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-dim font-mono">
                        {formatDate(i.createdAt)}
                      </span>
                      <button
                        onClick={() => del(i.id)}
                        className="h-6 w-6 rounded hover:bg-rose-500/10 text-dim hover:text-rose-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {open && <CreateModal projects={projects} onClose={() => setOpen(false)} />}
    </div>
  );
}

function CreateModal({ projects, onClose }: any) {
  const [state, action, pending] = useActionStateCompat(createResearchItemAction);
  return (
    <Modal
      open
      onClose={onClose}
      title="Nova pesquisa"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" form="research-form" type="submit">
            {pending ? "…" : "Salvar"}
          </Button>
        </>
      }
    >
      <form id="research-form" action={(fd) => action(fd)} className="space-y-4">
        <Field label="Título">
          <Input name="title" required />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tipo">
            <Select name="kind" defaultValue="article">
              {Object.entries(KIND_META).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </Select>
          </Field>
          <Field label="Fonte">
            <Input name="source" placeholder="Ex: Twitter, Reddit" />
          </Field>
        </div>
        <Field label="URL">
          <Input name="url" placeholder="https://…" />
        </Field>
        <Field label="Resumo / Trecho">
          <Textarea name="excerpt" />
        </Field>
        <Field label="Notas pessoais">
          <Textarea name="notes" />
        </Field>
        <Field label="Projeto">
          <Select name="projectId" defaultValue="">
            <option value="">—</option>
            {projects.map((p: any) => (
              <option key={p.id} value={p.id}>{p.name}</option>
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
