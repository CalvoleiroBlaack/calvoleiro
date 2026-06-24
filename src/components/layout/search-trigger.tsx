"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Kbd } from "@/components/ui/card";
import { CommandPalette } from "@/components/command/palette";

export function SearchTrigger() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="cl-input flex w-full items-center gap-2.5 rounded-md px-3 h-9 text-sm text-muted hover:text-fg-2 transition-colors"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="flex-1 text-left">Buscar tudo no Calvoleiro…</span>
        <Kbd>⌘K</Kbd>
      </button>
      <CommandPalette open={open} onClose={() => setOpen(false)} />
    </>
  );
}
