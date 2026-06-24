"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Logo } from "@/components/brand/logo";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <AuthShell title="Bem-vindo de volta" subtitle="Acesse seu Second Brain.">
      <form action={formAction} className="space-y-4">
        {state?.error && (
          <div className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
            {state.error}
          </div>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="voce@email.com"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={pending}
        >
          {pending ? "Entrando…" : "Entrar"}
        </Button>

        <div className="flex items-center justify-between text-xs pt-2">
          <Link
            href="/forgot-password"
            className="text-muted hover:text-fg-2 transition-colors"
          >
            Esqueci minha senha
          </Link>
          <Link
            href="/register"
            className="text-neon hover:text-neon-2 transition-colors"
          >
            Criar conta
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg text-fg flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 cl-grid opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] bg-gradient-radial from-royal/15 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="inline-block mb-8">
          <Logo size="md" />
        </Link>

        <div className="cl-glass-strong rounded-xl p-7 cl-glow-soft">
          <h1 className="text-xl font-semibold mb-1">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted mb-6">{subtitle}</p>
          )}
          {children}
        </div>

        <div className="text-center mt-6 text-[10px] font-mono uppercase tracking-[0.18em] text-dim">
          <span className="text-neon">●</span> Secure Session · Calvoleiro
        </div>
      </div>
    </div>
  );
}
