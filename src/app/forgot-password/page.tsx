"use client";

import Link from "next/link";
import { useActionState } from "react";
import { forgotPasswordAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { AuthShell } from "../login/page";

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(
    forgotPasswordAction,
    null
  );

  return (
    <AuthShell
      title="Recuperar senha"
      subtitle="Informe seu email para receber instruções."
    >
      <form action={formAction} className="space-y-4">
        {state?.error && (
          <div className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
            {state.error}
          </div>
        )}
        {state?.success && (
          <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
            {state.success}
          </div>
        )}
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
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={pending}
        >
          {pending ? "Enviando…" : "Enviar instruções"}
        </Button>
        <div className="text-center text-xs pt-2">
          <Link
            href="/login"
            className="text-muted hover:text-fg-2 transition-colors"
          >
            ← Voltar ao login
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
