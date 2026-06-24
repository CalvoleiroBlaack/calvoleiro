"use client";

import { useState } from "react";
import { createAssetAction, deleteAssetAction } from "@/actions/crud";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Badge, Card, Modal, Field, EmptyState } from "@/components/ui/card";
import { Plus, FolderOpen, Trash2, Image as ImageIcon, Music, Film, Smile, Sparkles } from "lucide-react";

const TYPE_LABELS: Record<string, string> = {
  thumbnail: "Thumbnail",
  sound: "Som",
  meme: "Meme",
  video: "Vídeo",
  effect: "Efeito",
  music: "Música",
};

const TYPE_ICON: Record<string, any> = {
  thumbnail: ImageIcon,
  sound: Music,
  music: Music,
  video: Film,
  meme: Smile,
  effect: Sparkles,
};

export function AssetsBoard({ assets }: any) {
  const [open, setOpen] = useState(false);
  const del = (id: string) => {
    if (!confirm("Excluir?")) return;
    deleteAssetAction(id).then(() => window.location.reload());
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> Novo asset
        </Button>
      </div>

      {assets.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-5 w-5" />}
          title="Nenhum asset ainda"
          description="Faça upload de thumbnails, sons, memes e tudo que você usa nos vídeos."
        />
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {assets.map((a: any) => {
            const Icon = TYPE_ICON[a.type] ?? FolderOpen;
            const isImage = a.mimeType?.startsWith("image/");
            return (
              <Card key={a.id} className="group relative">
                <div className="aspect-video bg-gradient-to-br from-card-2 to-bg flex items-center justify-center border-b border-border overflow-hidden">
                  {isImage && a.url ? (
                    <img src={a.url} alt={a.name} className="w-full h-full object-cover" />
                  ) : (
                    <Icon className="h-8 w-8 text-dim" />
                  )}
                </div>
                <div className="p-3 flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{a.name}</div>
                    <Badge variant="muted">{TYPE_LABELS[a.type] ?? a.type}</Badge>
                  </div>
                  <button
                    onClick={() => del(a.id)}
                    className="opacity-0 group-hover:opacity-100 h-7 w-7 rounded hover:bg-blood-dark/30 text-dim hover:text-blood-bright flex items-center justify-center transition-opacity"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {open && <AssetModal onClose={() => setOpen(false)} />}
    </div>
  );
}

function AssetModal({ onClose }: { onClose: () => void }) {
  const [state, action, pending] = useActionStateCompat(createAssetAction);
  return (
    <Modal
      open
      onClose={onClose}
      title="Novo asset"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" form="asset-form" type="submit">
            {pending ? "Enviando..." : "Upload ▸"}
          </Button>
        </>
      }
    >
      <form id="asset-form" action={(fd) => action(fd)} className="space-y-4">
        <Field label="Nome"><Input name="name" /></Field>
        <Field label="Tipo">
          <Select name="type" defaultValue="thumbnail">
            {Object.entries(TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </Select>
        </Field>
        <Field label="Arquivo" hint="Upload local (demo). Em produção: Firebase Storage.">
          <Input name="file" type="file" />
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
