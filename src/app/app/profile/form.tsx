"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Card, Field } from "@/components/ui/card";
import { updateProfileAction } from "@/actions/calvoleiro";

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

export function ProfileForm({ user, profile }: any) {
  const p = profile ?? {};
  const [state, action, pending] = useActionStateCompat(updateProfileAction);
  const [color, setColor] = useState(p.accentColor ?? "#3b82f6");
  const [avatar, setAvatar] = useState(p.avatarUrl ?? "");
  const [gif, setGif] = useState(p.avatarGifUrl ?? "");
  const [banner, setBanner] = useState(p.bannerUrl ?? "");
  const socials = (p.socials ?? {}) as Record<string, string>;

  return (
    <form action={(fd) => action(fd)} className="space-y-6">
      {state?.error && (
        <div className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
          {state.success}
        </div>
      )}

      {/* Banner + Avatar preview */}
      <Card>
        <div
          className="h-44 relative"
          style={{
            background: banner
              ? `url(${banner}) center/cover`
              : `linear-gradient(135deg, ${color}, ${color}40)`,
          }}
        >
          <div className="absolute -bottom-10 left-6 flex items-end gap-3">
            <div
              className="h-20 w-20 rounded-xl border-4 border-bg flex items-center justify-center text-white text-2xl font-semibold cl-glow-soft overflow-hidden"
              style={{
                background: gif
                  ? `url(${gif}) center/cover`
                  : avatar
                  ? `url(${avatar}) center/cover`
                  : `linear-gradient(135deg, ${color}, ${color}cc)`,
              }}
            >
              {!gif && !avatar && user.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="pb-2">
              <div className="text-xl font-semibold text-fg">
                {user.name}
              </div>
              <div className="text-xs text-muted">{user.email}</div>
            </div>
          </div>
        </div>
        <div className="h-12" />
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <div className="p-5 space-y-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-fg-2">
              Identidade
            </div>
            <Field label="Display name">
              <Input
                name="displayName"
                defaultValue={p.displayName ?? user.name}
              />
            </Field>
            <Field label="Bio">
              <Textarea name="bio" defaultValue={p.bio ?? ""} placeholder="Conte algo sobre você" />
            </Field>
            <Field label="Avatar URL">
              <Input
                name="avatarUrl"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://…"
              />
            </Field>
            <Field label="Avatar GIF URL (animado)">
              <Input
                name="avatarGifUrl"
                value={gif}
                onChange={(e) => setGif(e.target.value)}
                placeholder="https://…/avatar.gif"
              />
            </Field>
            <Field label="Banner URL">
              <Input
                name="bannerUrl"
                value={banner}
                onChange={(e) => setBanner(e.target.value)}
                placeholder="https://…/banner.jpg"
              />
            </Field>
          </div>
        </Card>

        <Card>
          <div className="p-5 space-y-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-fg-2">
              Estilo
            </div>
            <Field label="Cor de destaque">
              <div className="flex gap-2 flex-wrap">
                {COLORS.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setColor(c)}
                    className="h-9 w-9 rounded-md border-2 transition-all"
                    style={{
                      background: c,
                      borderColor: color === c ? "#eef2ff" : "transparent",
                    }}
                  />
                ))}
                <input type="hidden" name="accentColor" value={color} />
              </div>
            </Field>
            <Field label="Tema">
              <select
                name="theme"
                defaultValue={p.theme ?? "midnight"}
                className="cl-input h-10 w-full rounded-md px-3 text-sm"
              >
                <option value="midnight">Midnight (padrão)</option>
                <option value="ocean">Ocean</option>
                <option value="cobalt">Cobalt</option>
                <option value="arctic">Arctic</option>
              </select>
            </Field>

            <div className="pt-4 border-t border-border/60">
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-fg-2 mb-3">
                Links sociais
              </div>
              <div className="space-y-2">
                <Field label="Twitter / X">
                  <Input name="twitter" defaultValue={socials.twitter ?? ""} placeholder="@usuario" />
                </Field>
                <Field label="YouTube">
                  <Input name="youtube" defaultValue={socials.youtube ?? ""} placeholder="@canal" />
                </Field>
                <Field label="Twitch">
                  <Input name="twitch" defaultValue={socials.twitch ?? ""} placeholder="canal" />
                </Field>
                <Field label="GitHub">
                  <Input name="github" defaultValue={socials.github ?? ""} placeholder="user" />
                </Field>
                <Field label="Website">
                  <Input name="website" defaultValue={socials.website ?? ""} placeholder="https://…" />
                </Field>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Salvando…" : "Salvar perfil"}
        </Button>
      </div>
    </form>
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
    });
  };
  return [state, action, pending] as const;
}
