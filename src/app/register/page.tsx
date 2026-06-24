"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { AuthShell } from "../login/page";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(registerAction, null);

  return (
    <AuthShell
      title="Crie sua conta"
      subtitle="Inicialize seu cérebro digital em segundos."
    >
      <form action={formAction} className="space-y-4">
        {state?.error && (
          <div className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
            {state.error}
          </div>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" name="name" placeholder="Seu nome" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
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
            placeholder="mínimo 6 caracteres"
            required
            minLength={6}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirm">Confirmar senha</Label>
          <Input
            id="confirm"
            name="confirm"
            type="password"
            placeholder="repita a senha"
            required
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={pending}
        >
          {pending ? "Criando…" : "Criar minha conta"}
        </Button>

        <div className="text-center text-xs pt-2 text-muted">
          Já tem conta?{" "}
          <Link
            href="/login"
            className="text-neon hover:text-neon-2 transition-colors"
          >
            Entrar
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
