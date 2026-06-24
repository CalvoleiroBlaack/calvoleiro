"use client";

import { LogOut } from "lucide-react";
import { logoutAction } from "@/actions/auth";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface/40 text-muted hover:text-fg hover:border-border-2 hover:bg-surface transition-colors"
        aria-label="Sair"
        title="Sair"
      >
        <LogOut className="h-3.5 w-3.5" />
      </button>
    </form>
  );
}
