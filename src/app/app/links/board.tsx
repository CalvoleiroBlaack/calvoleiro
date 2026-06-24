"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Badge, Card, Modal, Field, EmptyState } from "@/components/ui/card";
import {
  Plus,
  Link as LinkIcon,
  Trash2,
  Star,
  Search,
  ExternalLink,
} from "lucide-react";
import {
  createLinkAction,
  deleteLinkAction,
  toggleLinkFavoriteAction,
} from "@/actions/calvoleiro";
import { useRouter } from "next/navigation";

export function LinksBoard({ links, projects }: any) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [onlyFav, setOnlyFav] = useState(false);
  const [folder, setFolder] = useState("");
  const router = useRouter();

  const folders = useMemo(() => {
    const s = new Set<string>();
    links.forEach((l: any) => l.folder && s.add(l.folder));
    return Array.from(s);
  }, [links]);

  const filtered = links.filter((l: any) => {
    if (onlyFav && !l.favorite) return false;
    if (folder && l.folder !== folder) return false;
    if (q) {
      const blob = `${l.title ?? ""} ${l.url} ${l.siteName ?? ""} ${l.notes ?? ""}`.toLowerCase();
      if (!blob.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  const del = async (id: string) => {
    if (!confirm("Excluir link?")) return;
    await deleteLinkAction(id);
    router.refresh();
  };

  const fav = async (id: string, current: boolean) => {
    await toggleLinkFavoriteAction(id, !current);
    router.refresh();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar links…"
            className="pl-9"
          />
        </div>
        <Select
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
          className="max-w-[180px]"
        >
          <option value="">Todas as pastas</option>
          {folders.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </Select>
        <Button
          variant={onlyFav ? "neon" : "ghost"}
          size="sm"
          onClick={() => setOnlyFav((v) => !v)}
        >
          <Star className="h-3.5 w-3.5" /> Favoritos
        </Button>
        <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-3.5 w-3.5" /> Novo link
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<LinkIcon className="h-5 w-5" />}
          title="Sem links"
          description="Salve qualquer URL importante. Artigos, vídeos, repositórios, tudo."
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((l: any) => {
            const host = (() => {
              try {
                return new URL(l.url).hostname.replace("www.", "");
              } catch {
                return l.url;
              }
            })();
            return (
              <Card key={l.id} className="cl-lift group">
                <div className="p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="h-8 w-8 rounded-md cl-gradient-brand flex items-center justify-center text-white flex-shrink-0">
                      <LinkIcon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <a
                        href={l.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-fg hover:text-neon transition-colors line-clamp-2 block"
                      >
                        {l.title ?? l.url}
                      </a>
                      <div className="text-[11px] text-muted truncate flex items-center gap-1">
                        <ExternalLink className="h-2.5 w-2.5" />
                        {host}
                      </div>
                    </div>
                  </div>
                  {l.notes && (
                    <p className="text-[11px] text-muted line-clamp-2 pl-10">
                      {l.notes}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-border/60">
                    <div className="flex gap-1">
                      {l.folder && <Badge variant="default">{l.folder}</Badge>}
                      {l.category && <Badge variant="royal">{l.category}</Badge>}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => fav(l.id, l.favorite)}
                        className="h-6 w-6 rounded hover:bg-surface-2 flex items-center justify-center"
                      >
                        <Star
                          className={`h-3 w-3 ${
                            l.favorite ? "text-amber-300 fill-amber-300" : "text-dim"
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => del(l.id)}
                        className="h-6 w-6 rounded hover:bg-rose-500/10 text-dim hover:text-rose-300 flex items-center justify-center"
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

      {open && <CreateLinkModal projects={projects} onClose={() => setOpen(false)} />}
    </div>
  );
}

function CreateLinkModal({ projects, onClose }: any) {
  const [state, action, pending] = useActionStateCompat(createLinkAction);
  return (
    <Modal
      open
      onClose={onClose}
      title="Salvar link"
      subtitle="Adicione à sua biblioteca pessoal."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" form="link-form" type="submit">
            {pending ? "Salvando…" : "Salvar"}
          </Button>
        </>
      }
    >
      <form id="link-form" action={(fd) => action(fd)} className="space-y-4">
        <Field label="URL">
          <Input name="url" type="url" required placeholder="https://…" />
        </Field>
        <Field label="Título">
          <Input name="title" placeholder="Título descritivo (opcional)" />
        </Field>
        <Field label="Notas">
          <Textarea name="notes" placeholder="Por que este link importa?" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Pasta">
            <Input name="folder" placeholder="Ex: Inspiração" />
          </Field>
          <Field label="Categoria">
            <Input name="category" placeholder="Ex: Artigo, Tutorial" />
          </Field>
        </div>
        <Field label="Projeto relacionado">
          <Select name="projectId" defaultValue="">
            <option value="">—</option>
            {projects.map((p: any) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
        </Field>
        <label className="flex items-center gap-2 text-sm text-fg-2">
          <input type="checkbox" name="favorite" className="accent-neon" />
          Marcar como favorito
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
